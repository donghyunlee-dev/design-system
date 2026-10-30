import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { MediaCard } from '../../components/data/MediaCard'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Button } from '../../components/foundation/Button'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGallerySpotlightCategory {
  id: string
  /** 소속 시스템 또는 업무 영역 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
}

export interface TemplateGallerySpotlightItem {
  id: string
  categoryId: string
  icon?: string
  /** 템플릿 미리보기 썸네일 이미지 URL. 미지정 시 icon으로 대체됩니다. */
  thumbnailSrc?: string
  title: string
  description?: string
  /** 제공 부서/팀 (예: 재무팀, 구매팀) */
  owner?: string
  badge?: string
  onUse?: () => void
}

/**
 * 상단 밑줄형 탭으로 시스템/업무 영역을 전환하고, 탭 상단에 큰 썸네일의 "주요 추천"
 * 카드 행을 별도로 강조 노출한 뒤 그 아래 전체 템플릿을 일반 그리드로 보여주는 구성.
 * 사이드바(TemplateGallery)·부서 타일(TemplateGalleryDirectory)·가로 스크롤 섹션
 * (TemplateCommunity)과 달리, 탭 전환 + 카드 크기 위계(추천 대형 카드 vs 일반 그리드)로
 * 탐색 동선을 구성하는 화면에 사용한다.
 */
export interface TemplateGallerySpotlightProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  categories: TemplateGallerySpotlightCategory[]
  /** 최초 활성화할 카테고리 id. 미지정 시 "전체" */
  initialCategoryId?: string
  onCategoryChange?: (categoryId: string) => void
  spotlightTitle?: string
  /** 상단에 크게 강조할 추천 템플릿 (전체 탭에서만 노출) */
  spotlight: TemplateGallerySpotlightItem[]
  /** 전체 템플릿 목록 */
  items: TemplateGallerySpotlightItem[]
  className?: string
}

const ALL_CATEGORY_ID = '__all__'

export function TemplateGallerySpotlight({
  title = '업무 템플릿 갤러리',
  description,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고 실사)',
  categories,
  initialCategoryId,
  onCategoryChange,
  spotlightTitle = '주요 추천 템플릿',
  spotlight,
  items,
  className,
}: TemplateGallerySpotlightProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId ?? ALL_CATEGORY_ID)
  const [search, setSearch] = useState('')

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    onCategoryChange?.(categoryId)
  }

  const keyword = search.trim().toLowerCase()
  const matches = (item: TemplateGallerySpotlightItem) =>
    !keyword ||
    item.title.toLowerCase().includes(keyword) ||
    item.description?.toLowerCase().includes(keyword) ||
    item.owner?.toLowerCase().includes(keyword)

  const isAll = activeCategoryId === ALL_CATEGORY_ID

  const visibleSpotlight = useMemo(
    () => (isAll ? spotlight.filter(matches) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spotlight, keyword, isAll]
  )

  const visibleItems = useMemo(
    () => items.filter(item => (isAll || item.categoryId === activeCategoryId) && matches(item)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, activeCategoryId, keyword, isAll]
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
            {description && <p className="text-sm text-muted">{description}</p>}
          </div>
          <div className="w-72 flex-shrink-0">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 시스템/업무 영역 밑줄형 탭 */}
        <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleCategorySelect(ALL_CATEGORY_ID)}
            className={cn(
              'px-1 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
              isAll ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-foreground'
            )}
          >
            전체
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategorySelect(category.id)}
              className={cn(
                'px-1 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
                category.id === activeCategoryId
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 주요 추천 템플릿: 큰 썸네일 카드 */}
        {visibleSpotlight.length > 0 && (
          <div className="mb-10">
            <p className="text-sm font-semibold text-foreground mb-3">{spotlightTitle}</p>
            <Grid cols={3} gap={4}>
              {visibleSpotlight.map(item => (
                <MediaCard
                  key={item.id}
                  aspect="video"
                  image={item.thumbnailSrc}
                  imageAlt={item.title}
                  fallback={item.icon && <span className="text-4xl">{item.icon}</span>}
                  className="flex flex-col"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-base font-semibold text-foreground">{item.title}</p>
                    {item.badge && <Tag>{item.badge}</Tag>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted mt-1 leading-relaxed flex-1">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    {item.owner ? <span className="text-xs text-muted">{item.owner}</span> : <span />}
                    <Button size="sm" variant="secondary" onClick={item.onUse}>이 템플릿 사용</Button>
                  </div>
                </MediaCard>
              ))}
            </Grid>
          </div>
        )}

        {/* 전체 템플릿 그리드 */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            {isAll ? '전체 템플릿' : categories.find(c => c.id === activeCategoryId)?.label ?? ''}{' '}
            <span className="text-muted font-normal">{visibleItems.length}건</span>
          </p>
          {visibleItems.length === 0 ? (
            <EmptyState title="템플릿을 찾을 수 없습니다" description="검색어나 카테고리를 변경해 보세요." />
          ) : (
            <Grid cols={3} gap={4}>
              {visibleItems.map(item => (
                <MediaCard
                  key={item.id}
                  fallback={item.icon && <span className="text-2xl">{item.icon}</span>}
                  className="flex flex-col"
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
              ))}
            </Grid>
          )}
        </div>
      </div>
    </div>
  )
}
