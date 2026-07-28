import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGalleryCategory {
  id: string
  /** 시스템/업무 분류 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
  count?: number
}

export interface TemplateGalleryItem {
  id: string
  categoryId: string
  icon?: string
  title: string
  description?: string
  /** 즐겨찾기·인기 등 강조 배지 */
  badge?: string
  onClick?: () => void
}

export interface TemplateGalleryProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  /** 좌측 카테고리 목록. 첫 항목은 보통 "전체" */
  categories: TemplateGalleryCategory[]
  activeCategoryId?: string
  onCategoryChange?: (categoryId: string) => void
  /** 상단에 노출할 추천/인기 템플릿 */
  featuredTitle?: string
  featured?: TemplateGalleryItem[]
  /** 전체 템플릿 그리드 */
  items: TemplateGalleryItem[]
  className?: string
}

export function TemplateGallery({
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
}: TemplateGalleryProps) {
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
                    <Card
                      key={item.id}
                      onClick={item.onClick}
                      className={cn(item.onClick && 'cursor-pointer hover:bg-surface-raised transition-colors')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        {item.icon && <span className="text-2xl">{item.icon}</span>}
                        {item.badge && <Tag>{item.badge}</Tag>}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted mt-1 leading-relaxed">{item.description}</p>
                      )}
                    </Card>
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
                  <Card
                    key={item.id}
                    onClick={item.onClick}
                    className={cn(item.onClick && 'cursor-pointer hover:bg-surface-raised transition-colors')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      {item.icon && <span className="text-2xl">{item.icon}</span>}
                      {item.badge && <Tag>{item.badge}</Tag>}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-muted mt-1 leading-relaxed">{item.description}</p>
                    )}
                  </Card>
                ))}
              </Grid>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
