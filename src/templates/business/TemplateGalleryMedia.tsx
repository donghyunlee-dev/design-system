import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { CardMedia, CardMediaCover } from '../../components/data/CardMedia'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGalleryMediaCategory {
  id: string
  /** 시스템/업무 분류 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
  count?: number
}

export interface TemplateGalleryMediaItem {
  id: string
  categoryId: string
  title: string
  description?: string
  /** 썸네일 이미지 URL. 지정 시 cover보다 우선한다. */
  image?: string
  imageAlt?: string
  /** 이미지가 없을 때 표시할 단색 커버 */
  cover?: CardMediaCover
  /** 즐겨찾기·인기 등 강조 배지 */
  badge?: string
  onClick?: () => void
}

/**
 * TemplateGallery와 동일한 카테고리/검색/추천 구조를 유지하되,
 * 각 항목을 썸네일/커버 이미지가 있는 카드(CardMedia)로 표시하는 변형.
 * 시각적 미리보기가 중요한 갤러리(예: 보드/문서 템플릿 썸네일)에 사용한다.
 */
export interface TemplateGalleryMediaProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  /** 좌측 카테고리 목록. 첫 항목은 보통 "전체" */
  categories: TemplateGalleryMediaCategory[]
  activeCategoryId?: string
  onCategoryChange?: (categoryId: string) => void
  /** 상단에 노출할 추천/인기 템플릿 */
  featuredTitle?: string
  featured?: TemplateGalleryMediaItem[]
  /** 전체 템플릿 그리드 */
  items: TemplateGalleryMediaItem[]
  className?: string
}

function TemplateCard({ item }: { item: TemplateGalleryMediaItem }) {
  return (
    <CardMedia
      key={item.id}
      image={item.image}
      imageAlt={item.imageAlt}
      cover={item.cover}
      onClick={item.onClick}
      className={cn(item.onClick && 'cursor-pointer hover:bg-surface-raised transition-colors')}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        {item.badge && <Tag>{item.badge}</Tag>}
      </div>
      {item.description && (
        <p className="text-xs text-muted leading-relaxed">{item.description}</p>
      )}
    </CardMedia>
  )
}

export function TemplateGalleryMedia({
  title = '템플릿 갤러리',
  description,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고실사)',
  categories,
  activeCategoryId,
  onCategoryChange,
  featuredTitle = '많이 사용하는 템플릿',
  featured,
  items,
  className,
}: TemplateGalleryMediaProps) {
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase()
    return items.filter(item => {
      const matchesCategory = !activeCategoryId || activeCategoryId === 'all' || item.categoryId === activeCategoryId
      const matchesKeyword = !keyword || item.title.toLowerCase().includes(keyword) || item.description?.toLowerCase().includes(keyword)
      return matchesCategory && matchesKeyword
    })
  }, [items, activeCategoryId, search])

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-5">{description}</p>}
        {!description && <div className="mb-5" />}

        <div className="mb-6 max-w-xl">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-6 items-start">
          {/* 좌측 카테고리 목록 */}
          <nav className="w-52 flex-shrink-0 hidden lg:block">
            <ul className="space-y-1">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange?.(category.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-btn text-sm text-left transition-colors',
                      category.id === activeCategoryId
                        ? 'bg-brand-subtle text-brand font-medium'
                        : 'text-foreground hover:bg-surface-subtle'
                    )}
                  >
                    <span>{category.label}</span>
                    {category.count !== undefined && (
                      <span className="text-xs text-muted">{category.count}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 우측 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {featured && featured.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-foreground mb-3">{featuredTitle}</p>
                <Grid cols={3} gap={4}>
                  {featured.map(item => (
                    <TemplateCard key={item.id} item={item} />
                  ))}
                </Grid>
              </div>
            )}

            <p className="text-sm font-semibold text-foreground mb-3">
              전체 템플릿 <span className="text-muted font-normal">{filteredItems.length}건</span>
            </p>
            {filteredItems.length === 0 ? (
              <div className="bg-surface border border-border rounded-card shadow-card">
                <EmptyState title="템플릿을 찾을 수 없습니다" description="다른 검색어나 분류로 다시 시도해 보세요." />
              </div>
            ) : (
              <Grid cols={3} gap={4}>
                {filteredItems.map(item => (
                  <TemplateCard key={item.id} item={item} />
                ))}
              </Grid>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
