import { useMemo, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { MediaCard } from '../../components/data/MediaCard'
import { Tag } from '../../components/data/Tag'
import { Checkbox } from '../../components/form/Checkbox'
import { Grid } from '../../components/layout/Grid'
import { Divider } from '../../components/layout/Divider'
import { Input } from '../../components/form/Input'
import { Button } from '../../components/foundation/Button'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGalleryFilteredFacetOption {
  id: string
  label: string
  count?: number
}

export interface TemplateGalleryFilteredFacet {
  id: string
  /** 패싯 그룹명 (예: "업무 시스템", "적용 규모") */
  label: string
  options: TemplateGalleryFilteredFacetOption[]
}

export interface TemplateGalleryFilteredItem {
  id: string
  icon?: string
  thumbnailSrc?: string
  title: string
  description?: string
  /** 제공 부서/팀 (예: 재무팀, 구매팀) */
  owner?: string
  badge?: string
  /** 이 템플릿이 해당하는 패싯 옵션 id 목록 (여러 패싯에 걸쳐 모두 포함) */
  facetOptionIds: string[]
  onUse?: () => void
}

/**
 * Trello 템플릿 갤러리(카테고리 페이지)의 우측 다중 조건 필터 패널 구조를 참고한 변형.
 * TemplateGallery/TemplateGalleryMedia/TemplateGalleryDirectory가 좌측 또는 상단의
 * 단일 선택 카테고리 내비게이션인 것과 달리, 우측 패널에서 여러 패싯(업무 시스템, 적용 규모 등)을
 * 동시에 체크박스로 다중 선택해 좁혀가는 교차 필터링(패싯 간 AND, 패싯 내 OR)에 사용한다.
 */
export interface TemplateGalleryFilteredProps {
  title?: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  facets: TemplateGalleryFilteredFacet[]
  /** 선택된 패싯 옵션 id 목록 (패싯 전체에 걸친 평면 배열) */
  selectedOptionIds: string[]
  onToggleOption: (optionId: string) => void
  onResetFilters?: () => void
  /** 필터와 무관하게 항상 상단에 노출되는 고정 추천 템플릿 */
  pinnedTitle?: string
  pinned?: TemplateGalleryFilteredItem[]
  items: TemplateGalleryFilteredItem[]
  className?: string
}

function TemplateCard({ item }: { item: TemplateGalleryFilteredItem }) {
  return (
    <MediaCard
      className="flex flex-col"
      image={item.thumbnailSrc}
      imageAlt={item.title}
      fallback={item.icon && <span className="text-2xl">{item.icon}</span>}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        {item.badge && <Tag>{item.badge}</Tag>}
      </div>
      {item.description && (
        <p className="text-xs text-muted mt-1 leading-relaxed flex-1">{item.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {item.owner ? <span className="text-xs text-muted">{item.owner}</span> : <span />}
        <Button size="sm" variant="secondary" onClick={item.onUse}>이 템플릿 사용</Button>
      </div>
    </MediaCard>
  )
}

export function TemplateGalleryFiltered({
  title = '업무 템플릿 갤러리',
  description,
  breadcrumb,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고 실사)',
  onSearch,
  facets,
  selectedOptionIds,
  onToggleOption,
  onResetFilters,
  pinnedTitle = '가장 많이 사용된 템플릿',
  pinned,
  items,
  className,
}: TemplateGalleryFilteredProps) {
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearch?.(value)
  }

  const selectedOptions = useMemo(
    () =>
      facets.flatMap(facet =>
        facet.options
          .filter(option => selectedOptionIds.includes(option.id))
          .map(option => ({ facetId: facet.id, ...option }))
      ),
    [facets, selectedOptionIds]
  )

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter(item => {
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword) ||
        item.owner?.toLowerCase().includes(keyword)
      if (!matchesKeyword) return false

      // 패싯 간 AND, 패싯 내 선택 옵션 간 OR
      return facets.every(facet => {
        const selectedInFacet = facet.options
          .filter(option => selectedOptionIds.includes(option.id))
          .map(option => option.id)
        return selectedInFacet.length === 0 || selectedInFacet.some(id => item.facetOptionIds.includes(id))
      })
    })
  }, [items, facets, selectedOptionIds, search])

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">

        {breadcrumb && <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>}

        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-5">{description}</p>}
        {!description && <div className="mb-5" />}

        <div className="mb-6 max-w-xl">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-6 items-start">
          {/* 좌측: 고정 추천 + 필터 결과 그리드 */}
          <div className="flex-1 min-w-0 space-y-8">
            {pinned && pinned.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">{pinnedTitle}</p>
                <Grid cols={3} gap={4}>
                  {pinned.map(item => (
                    <TemplateCard key={item.id} item={item} />
                  ))}
                </Grid>
                <Divider className="mt-8" />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="text-sm font-semibold text-foreground">
                  전체 템플릿 <span className="text-muted font-normal">{filteredItems.length}건</span>
                </p>
                {selectedOptions.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedOptions.map(option => (
                      <Tag key={option.id} onRemove={() => onToggleOption(option.id)}>
                        {option.label}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {filteredItems.length === 0 ? (
                <EmptyState title="템플릿을 찾을 수 없습니다" description="검색어나 필터 조건을 변경해 보세요." />
              ) : (
                <Grid cols={3} gap={4}>
                  {filteredItems.map(item => (
                    <TemplateCard key={item.id} item={item} />
                  ))}
                </Grid>
              )}
            </div>
          </div>

          {/* 우측: 다중 선택 패싯 필터 패널 */}
          <aside className="w-60 flex-shrink-0 hidden lg:block">
            <div className="bg-surface border border-border rounded-card shadow-card p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">필터</p>
                {onResetFilters && selectedOptions.length > 0 && (
                  <button type="button" onClick={onResetFilters} className="text-xs text-brand hover:underline">
                    초기화
                  </button>
                )}
              </div>
              {facets.map((facet, i) => (
                <div key={facet.id} className={i > 0 ? 'mt-5' : 'mt-4'}>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{facet.label}</p>
                  <ul className="space-y-1.5">
                    {facet.options.map(option => (
                      <li key={option.id} className="flex items-center justify-between">
                        <Checkbox
                          label={option.label}
                          checked={selectedOptionIds.includes(option.id)}
                          onChange={() => onToggleOption(option.id)}
                        />
                        {option.count !== undefined && (
                          <span className="text-xs text-muted">{option.count}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
