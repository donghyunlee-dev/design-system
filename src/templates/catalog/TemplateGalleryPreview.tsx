import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { MediaCard } from '../../components/data/MediaCard'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Divider } from '../../components/layout/Divider'
import { Button } from '../../components/foundation/Button'
import { Avatar } from '../../components/foundation/Avatar'
import { EmptyState } from '../../components/feedback/EmptyState'
import { Drawer } from '../../components/overlay/Drawer'
import { cn } from '../../utils/cn'

export interface TemplateGalleryPreviewCategory {
  id: string
  /** 소속 시스템 또는 업무 영역 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
}

export interface TemplateGalleryPreviewItem {
  id: string
  categoryId: string
  icon?: string
  /** 카드 및 미리보기 상단의 썸네일 이미지 URL */
  thumbnailSrc?: string
  title: string
  /** 카드에 노출되는 한 줄 설명 */
  description?: string
  /** 미리보기 패널에만 노출되는 상세 설명 */
  longDescription?: string
  /** 제공 부서/작성자 */
  owner?: string
  ownerAvatarSrc?: string
  badge?: string
  /** 누적 사용 현황 (예: "128명 사용 중") */
  usageLabel?: string
  /** 최근 업데이트 표기 (예: "2026-08 갱신") */
  updatedLabel?: string
  /** 미리보기 패널에 노출되는 관련 키워드 태그 */
  tags?: string[]
  onUse?: () => void
}

/**
 * Notion 템플릿 갤러리의 "카드 클릭 → 우측 미리보기 패널에서 상세를 확인하고 바로 사용" 동선을
 * 참고한 변형. 다른 TemplateGallery* 계열은 카드를 누르면 페이지 이동(onClick/onUse)으로 끝나는
 * 반면, 이 템플릿은 그리드를 벗어나지 않고 Drawer로 큰 미리보기 이미지·상세 설명·태그를 먼저
 * 확인한 뒤 같은 자리에서 "사용" 여부를 결정하는 인라인 미리보기 구조에 사용한다.
 */
export interface TemplateGalleryPreviewProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  categories: TemplateGalleryPreviewCategory[]
  items: TemplateGalleryPreviewItem[]
  className?: string
}

const ALL_CATEGORY_ID = '__all__'

export function TemplateGalleryPreview({
  title = '업무 템플릿 갤러리',
  description,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고 실사)',
  categories,
  items,
  className,
}: TemplateGalleryPreviewProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORY_ID)
  const [search, setSearch] = useState('')
  const [previewId, setPreviewId] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter(item => {
      const matchesCategory = activeCategoryId === ALL_CATEGORY_ID || item.categoryId === activeCategoryId
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword) ||
        item.owner?.toLowerCase().includes(keyword)
      return matchesCategory && matchesKeyword
    })
  }, [items, activeCategoryId, search])

  const previewItem = items.find(item => item.id === previewId) ?? null
  const previewCategory = previewItem && categories.find(c => c.id === previewItem.categoryId)

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

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategoryId(ALL_CATEGORY_ID)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              activeCategoryId === ALL_CATEGORY_ID
                ? 'bg-brand-subtle text-brand font-medium'
                : 'bg-surface-subtle text-foreground hover:bg-surface-overlay'
            )}
          >
            전체
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition-colors',
                category.id === activeCategoryId
                  ? 'bg-brand-subtle text-brand font-medium'
                  : 'bg-surface-subtle text-foreground hover:bg-surface-overlay'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState title="템플릿을 찾을 수 없습니다" description="검색어나 카테고리를 변경해 보세요." />
        ) : (
          <Grid cols={3} gap={4}>
            {filteredItems.map(item => (
              <MediaCard
                key={item.id}
                image={item.thumbnailSrc}
                imageAlt={item.title}
                fallback={item.icon && <span className="text-2xl">{item.icon}</span>}
                onClick={() => setPreviewId(item.id)}
                className="flex flex-col cursor-pointer hover:shadow-card transition-shadow text-left"
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
                  {item.usageLabel && <span className="text-xs text-muted">{item.usageLabel}</span>}
                </div>
              </MediaCard>
            ))}
          </Grid>
        )}
      </div>

      <Drawer open={previewItem !== null} onClose={() => setPreviewId(null)} title="템플릿 미리보기" width="w-96">
        {previewItem && (
          <div>
            <div
              className={cn(
                'w-full aspect-video rounded-card overflow-hidden flex items-center justify-center bg-surface-overlay mb-4',
              )}
            >
              {previewItem.thumbnailSrc ? (
                <img src={previewItem.thumbnailSrc} alt={previewItem.title} className="w-full h-full object-cover" />
              ) : (
                previewItem.icon && <span className="text-5xl">{previewItem.icon}</span>
              )}
            </div>

            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground">{previewItem.title}</h3>
              {previewItem.badge && <Tag className="flex-shrink-0">{previewItem.badge}</Tag>}
            </div>
            {previewCategory && <p className="text-xs text-muted mb-3">{previewCategory.label}</p>}

            {(previewItem.owner || previewItem.usageLabel || previewItem.updatedLabel) && (
              <div className="flex items-center justify-between text-xs text-muted mb-4">
                {previewItem.owner ? (
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Avatar size="sm" src={previewItem.ownerAvatarSrc} initials={previewItem.owner.slice(0, 1)} alt={previewItem.owner} />
                    <span className="truncate">{previewItem.owner}</span>
                  </span>
                ) : <span />}
                <span className="flex-shrink-0">
                  {[previewItem.usageLabel, previewItem.updatedLabel].filter(Boolean).join(' · ')}
                </span>
              </div>
            )}

            <Divider className="mb-4" />

            <p className="text-sm text-foreground leading-relaxed mb-4">
              {previewItem.longDescription ?? previewItem.description}
            </p>

            {previewItem.tags && previewItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {previewItem.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => {
                previewItem.onUse?.()
                setPreviewId(null)
              }}
            >
              이 템플릿 사용
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}
