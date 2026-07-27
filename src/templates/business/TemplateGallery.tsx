import { useMemo, useState } from 'react'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Input } from '../../components/form/Input'
import { Button } from '../../components/foundation/Button'
import { EmptyState } from '../../components/feedback/EmptyState'
import { ChipGroup } from '../../components/navigation/ChipGroup'
import { cn } from '../../utils/cn'

export interface TemplateGalleryCategory {
  id: string
  /** 시스템/분류 라벨 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
}

export interface TemplateGalleryItem {
  id: string
  icon?: string
  title: string
  description?: string
  /** TemplateGalleryCategory.id 와 매칭되는 분류 */
  categoryId: string
  /** 부가 정보 (예: 사용 횟수, 최근 업데이트일) */
  meta?: string
  /** 추천 템플릿으로 상단에 노출 */
  featured?: boolean
  onUse?: () => void
}

export interface TemplateGalleryProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  categories: TemplateGalleryCategory[]
  items: TemplateGalleryItem[]
  featuredTitle?: string
  /** 카드 액션 버튼 라벨 */
  useLabel?: string
  className?: string
}

const ALL_CATEGORY_ID = 'all'

export function TemplateGallery({
  title = '업무 템플릿 갤러리',
  description,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 재고조사서, 협력사 등록)',
  categories,
  items,
  featuredTitle = '추천 템플릿',
  useLabel = '템플릿 사용',
  className,
}: TemplateGalleryProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_CATEGORY_ID)
  const [search, setSearch] = useState('')

  const keyword = search.trim().toLowerCase()

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCategoryId === ALL_CATEGORY_ID || item.categoryId === activeCategoryId
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
      return matchesCategory && matchesKeyword
    })
  }, [items, activeCategoryId, keyword])

  const showFeatured = activeCategoryId === ALL_CATEGORY_ID && !keyword
  const featuredItems = showFeatured ? items.filter(item => item.featured) : []

  const groupedByCategory = useMemo(() => {
    return categories
      .map(category => ({
        category,
        items: filteredItems.filter(item => item.categoryId === category.id),
      }))
      .filter(group => group.items.length > 0)
  }, [categories, filteredItems])

  function renderCard(item: TemplateGalleryItem) {
    const category = categories.find(c => c.id === item.categoryId)
    return (
      <Card key={item.id} className="flex flex-col">
        <div className="flex items-start justify-between mb-2">
          {item.icon && <span className="text-2xl">{item.icon}</span>}
          {category && <Tag>{category.label}</Tag>}
        </div>
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted mt-1 leading-relaxed flex-1">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted">{item.meta}</span>
          <Button size="sm" variant="secondary" onClick={item.onUse}>
            {useLabel}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-5">{description}</p>}
        {!description && <div className="mb-5" />}

        <div className="mb-4 max-w-xl">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <ChipGroup
          className="mb-6"
          value={activeCategoryId}
          onChange={setActiveCategoryId}
          items={[{ id: ALL_CATEGORY_ID, label: '전체' }, ...categories.map(c => ({ id: c.id, label: c.label }))]}
        />

        {filteredItems.length === 0 ? (
          <EmptyState title="템플릿이 없습니다" description="검색어나 분류를 변경해 다시 시도해 주세요." />
        ) : (
          <div className="space-y-8">
            {featuredItems.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">{featuredTitle}</p>
                <Grid cols={3} gap={4}>
                  {featuredItems.map(renderCard)}
                </Grid>
              </div>
            )}

            {groupedByCategory.map(group => (
              <div key={group.category.id}>
                <p className="text-sm font-semibold text-foreground mb-3">{group.category.label}</p>
                <Grid cols={3} gap={4}>
                  {group.items.map(renderCard)}
                </Grid>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
