import { useMemo, useState } from 'react'
import { Input } from '../../../components/form/Input'
import { MediaCard } from '../../../components/data/MediaCard'
import { Tag } from '../../../components/data/Tag'
import { Grid } from '../../../components/layout/Grid'
import { Divider } from '../../../components/layout/Divider'
import { Button } from '../../../components/foundation/Button'
import { EmptyState } from '../../../components/feedback/EmptyState'
import { cn } from '../../../utils/cn'

export interface ServiceCatalogItem {
  id: string
  icon?: string
  /** 서비스 미리보기 썸네일 이미지 URL. 미지정 시 icon으로 대체됩니다. */
  thumbnailSrc?: string
  title: string
  description?: string
  /** 담당 시스템/부서 (예: ERP, OMS, IT지원팀) */
  owner?: string
  /** 카드 상단 강조 배지 (예: 인기, 신규) */
  badge?: string
  /** 처리 예상 시간 (예: "1일 이내 처리") */
  etaLabel?: string
  onRequest?: () => void
}

export interface ServiceCatalogCategory {
  id: string
  /** 소속 시스템 또는 업무 영역 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
  items: ServiceCatalogItem[]
}

/**
 * 첫인상·전환(신청) 중심의 사내 서비스 신청 카탈로그.
 * 검색 히어로 + 인기 서비스 하이라이트 + 카테고리별 카드 그리드로 구성된다.
 * 정보 밀도 중심의 business/TemplateGallery(사내 문서·양식 템플릿 모음)와 달리,
 * 시스템 이용/권한 신청 등 "서비스"를 훑어보고 바로 신청까지 유도하는 화면에 사용한다.
 */
export interface ServiceCatalogProps {
  title?: string
  subtitle?: string
  categories: ServiceCatalogCategory[]
  /** 최초 활성화할 카테고리 id. 미지정 시 "전체" */
  initialCategoryId?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onCategoryChange?: (categoryId: string) => void
  featuredTitle?: string
  /** 히어로 하단에 강조 노출할 인기 서비스 */
  featured?: ServiceCatalogItem[]
  className?: string
}

const ALL_CATEGORY_ID = '__all__'

function ServiceCard({ item }: { item: ServiceCatalogItem }) {
  return (
    <MediaCard
      className="flex flex-col"
      image={item.thumbnailSrc}
      imageAlt={item.title}
      fallback={item.icon && <span className="text-2xl">{item.icon}</span>}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        {item.badge && <Tag className="flex-shrink-0">{item.badge}</Tag>}
      </div>
      {item.description && (
        <p className="text-xs text-muted mt-1 leading-relaxed flex-1">{item.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="min-w-0 truncate">
          {item.owner && <span className="text-xs text-muted">{item.owner}</span>}
          {item.owner && item.etaLabel && <span className="text-xs text-muted"> · </span>}
          {item.etaLabel && <span className="text-xs text-muted">{item.etaLabel}</span>}
        </span>
        <Button size="sm" className="flex-shrink-0" onClick={item.onRequest}>신청하기</Button>
      </div>
    </MediaCard>
  )
}

export function ServiceCatalog({
  title = '사내 서비스 카탈로그',
  subtitle = 'ERP, OMS, WMS, PRM, 그룹웨어 등 사내 시스템 이용·권한 신청을 한 곳에서 찾아보세요.',
  categories,
  initialCategoryId,
  searchPlaceholder = '서비스 검색 (예: 계정 신청, 재고 조회 권한, 회의실 예약)',
  onSearch,
  onCategoryChange,
  featuredTitle = '많이 신청하는 서비스',
  featured,
  className,
}: ServiceCatalogProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId ?? ALL_CATEGORY_ID)
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearch?.(value)
  }

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    onCategoryChange?.(categoryId)
  }

  const totalCount = useMemo(() => categories.reduce((sum, c) => sum + c.items.length, 0), [categories])

  const visibleCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return categories
      .filter(category => activeCategoryId === ALL_CATEGORY_ID || category.id === activeCategoryId)
      .map(category => ({
        ...category,
        items: keyword
          ? category.items.filter(item =>
              item.title.toLowerCase().includes(keyword) ||
              item.description?.toLowerCase().includes(keyword) ||
              item.owner?.toLowerCase().includes(keyword)
            )
          : category.items,
      }))
      .filter(category => category.items.length > 0)
  }, [categories, activeCategoryId, search])

  const showFeatured = !search.trim() && activeCategoryId === ALL_CATEGORY_ID && featured && featured.length > 0

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* 히어로: 검색 중심 */}
      <section className="bg-brand-subtle px-[var(--page-padding)] py-[var(--spacing-2xl)]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-3 text-sm text-muted leading-relaxed">{subtitle}</p>}
          <div className="mt-6 max-w-xl mx-auto">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-[var(--spacing-xl)]">
        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => handleCategorySelect(ALL_CATEGORY_ID)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              activeCategoryId === ALL_CATEGORY_ID
                ? 'bg-brand-subtle text-brand font-medium'
                : 'bg-surface-subtle text-foreground hover:bg-surface-overlay'
            )}
          >
            전체 <span className="text-xs text-muted">{totalCount}</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategorySelect(category.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition-colors',
                activeCategoryId === category.id
                  ? 'bg-brand-subtle text-brand font-medium'
                  : 'bg-surface-subtle text-foreground hover:bg-surface-overlay'
              )}
            >
              {category.label} <span className="text-xs text-muted">{category.items.length}</span>
            </button>
          ))}
        </div>

        {/* 인기 서비스 하이라이트 */}
        {showFeatured && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-foreground mb-3">{featuredTitle}</p>
            <Grid cols={3} gap={4}>
              {featured!.map(item => <ServiceCard key={item.id} item={item} />)}
            </Grid>
            <Divider className="mt-8" />
          </div>
        )}

        {/* 카테고리별 서비스 그리드 */}
        <div className="space-y-8">
          {visibleCategories.length === 0 && (
            <EmptyState title="서비스를 찾을 수 없습니다" description="검색어나 카테고리를 변경해 보세요." />
          )}
          {visibleCategories.map((category, i) => (
            <div key={category.id}>
              {i > 0 && <Divider className="mb-8" />}
              <p className="text-sm font-semibold text-foreground mb-3">{category.label}</p>
              <Grid cols={3} gap={4}>
                {category.items.map(item => <ServiceCard key={item.id} item={item} />)}
              </Grid>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
