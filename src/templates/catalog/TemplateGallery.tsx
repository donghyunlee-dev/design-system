import { useMemo, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { MediaCard } from '../../components/data/MediaCard'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Divider } from '../../components/layout/Divider'
import { Input } from '../../components/form/Input'
import { Button } from '../../components/foundation/Button'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGalleryItem {
  id: string
  icon?: string
  /** 템플릿 미리보기 썸네일 이미지 URL. 미지정 시 icon으로 대체됩니다. */
  thumbnailSrc?: string
  title: string
  description?: string
  /** 제공 부서/팀 (예: 재무팀, 구매팀) */
  owner?: string
  /** 카드 상단 태그 (예: 인기, 신규) */
  badge?: string
  onUse?: () => void
}

export interface TemplateGalleryCategory {
  id: string
  /** 소속 시스템 또는 업무 영역 (예: ERP, OMS, 그룹웨어) */
  label: string
  items: TemplateGalleryItem[]
}

export interface TemplateGalleryProps {
  title?: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  categories: TemplateGalleryCategory[]
  /** 최초 활성화할 카테고리 id. 미지정 시 "전체" */
  initialCategoryId?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onCategoryChange?: (categoryId: string) => void
  className?: string
}

const ALL_CATEGORY_ID = '__all__'

export function TemplateGallery({
  title = '업무 템플릿 갤러리',
  description,
  breadcrumb,
  categories,
  initialCategoryId,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고 실사)',
  onSearch,
  onCategoryChange,
  className,
}: TemplateGalleryProps) {
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
          {/* 좌측: 업무 영역 카테고리 */}
          <nav className="w-56 flex-shrink-0 hidden lg:block">
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategorySelect(ALL_CATEGORY_ID)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 text-sm rounded-btn transition-colors',
                    activeCategoryId === ALL_CATEGORY_ID
                      ? 'bg-brand-subtle text-brand font-medium'
                      : 'text-foreground hover:bg-surface-subtle'
                  )}
                >
                  <span>전체</span>
                  <span className="text-xs text-muted">{totalCount}</span>
                </button>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 text-sm rounded-btn transition-colors',
                      activeCategoryId === category.id
                        ? 'bg-brand-subtle text-brand font-medium'
                        : 'text-foreground hover:bg-surface-subtle'
                    )}
                  >
                    <span>{category.label}</span>
                    <span className="text-xs text-muted">{category.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 우측: 카테고리별 템플릿 카드 그리드 */}
          <div className="flex-1 min-w-0 space-y-8">
            {visibleCategories.length === 0 && (
              <EmptyState title="템플릿을 찾을 수 없습니다" description="검색어나 카테고리를 변경해 보세요." />
            )}
            {visibleCategories.map((category, i) => (
              <div key={category.id}>
                {i > 0 && <Divider className="mb-8" />}
                <p className="text-sm font-semibold text-foreground mb-3">{category.label}</p>
                <Grid cols={3} gap={4}>
                  {category.items.map(item => (
                    <MediaCard
                      key={item.id}
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
                        {item.owner ? (
                          <span className="text-xs text-muted">{item.owner}</span>
                        ) : <span />}
                        <Button size="sm" variant="secondary" onClick={item.onUse}>이 템플릿 사용</Button>
                      </div>
                    </MediaCard>
                  ))}
                </Grid>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
