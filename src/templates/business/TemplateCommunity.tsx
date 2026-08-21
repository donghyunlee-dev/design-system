import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { MediaCard } from '../../components/data/MediaCard'
import { MediaCardHoverActions } from '../../components/data/MediaCardHoverActions'
import { Tag } from '../../components/data/Tag'
import { Avatar } from '../../components/foundation/Avatar'
import { VerifiedBadge } from '../../components/foundation/VerifiedBadge'
import { Button } from '../../components/foundation/Button'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateCommunityCategory {
  id: string
  /** 시스템/업무 분류 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
}

export interface TemplateCommunityItem {
  id: string
  title: string
  description?: string
  /** 카드 상단 미리보기 이미지 URL. 없으면 coverFallback을 표시 */
  image?: string
  imageAlt?: string
  /** 이미지가 없을 때 표시할 대체 콘텐츠 (예: 아이콘) */
  coverFallback?: string
  /** 등록 부서/작성자 */
  author: string
  authorAvatarSrc?: string
  /** 등록 부서가 사내 인증된 게시자인지 여부 (인증 배지 노출) */
  authorVerified?: boolean
  /** 사용 현황 (예: "312명 사용 중") */
  usageLabel?: string
  /** 추천/좋아요 수 (예: "128") */
  likeCount?: number
  badge?: string
  onClick?: () => void
  /** 복제하기 등 카드 호버 시 노출할 액션 콜백 */
  onDuplicate?: () => void
}

export interface TemplateCommunitySection {
  id: string
  title: string
  moreLabel?: string
  onMoreClick?: () => void
  items: TemplateCommunityItem[]
}

/**
 * 여러 부서가 등록한 템플릿·양식을 카테고리별 가로 스크롤 섹션으로 훑어보는 커뮤니티형 갤러리.
 * TemplateGalleryMedia(단일 그리드 + 좌측/상단 카테고리)와 달리, 다수의 큐레이션 섹션을
 * 각각 가로로 스크롤되는 카드 행으로 노출해 "훑어보기" 중심 홈 화면 구조를 지원한다.
 */
export interface TemplateCommunityProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  /** 상단 가로 카테고리 탭 */
  categories: TemplateCommunityCategory[]
  activeCategoryId?: string
  onCategoryChange?: (categoryId: string) => void
  /** 카테고리별 큐레이션 섹션 (각 섹션은 가로 스크롤 카드 행) */
  sections: TemplateCommunitySection[]
  className?: string
}

function CommunityCard({ item }: { item: TemplateCommunityItem }) {
  const card = (
    <MediaCard
      image={item.image}
      imageAlt={item.imageAlt}
      fallback={item.coverFallback && <span className="text-2xl">{item.coverFallback}</span>}
      onClick={item.onClick}
      className={cn('w-64', item.onClick && 'cursor-pointer hover:shadow-card transition-shadow')}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</p>
        {item.badge && <Tag className="flex-shrink-0">{item.badge}</Tag>}
      </div>
      {item.description && (
        <p className="text-xs text-muted leading-relaxed line-clamp-2">{item.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="flex items-center gap-1.5 min-w-0">
          <Avatar size="sm" src={item.authorAvatarSrc} initials={item.author.slice(0, 1)} alt={item.author} />
          <span className="text-xs text-muted truncate">{item.author}</span>
          {item.authorVerified && <VerifiedBadge />}
        </span>
        <span className="flex items-center gap-2 flex-shrink-0 text-xs text-muted">
          {item.usageLabel && <span>{item.usageLabel}</span>}
          {item.likeCount !== undefined && <span>♥ {item.likeCount}</span>}
        </span>
      </div>
    </MediaCard>
  )

  if (!item.onDuplicate) {
    return <div className="w-64 flex-shrink-0 snap-start">{card}</div>
  }

  return (
    <MediaCardHoverActions
      className="w-64 flex-shrink-0 snap-start"
      actions={
        <Button size="sm" onClick={item.onDuplicate}>
          복제하기
        </Button>
      }
    >
      {card}
    </MediaCardHoverActions>
  )
}

export function TemplateCommunity({
  title = '사내 템플릿 커뮤니티',
  description,
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고실사)',
  categories,
  activeCategoryId,
  onCategoryChange,
  sections,
  className,
}: TemplateCommunityProps) {
  const [search, setSearch] = useState('')

  const filteredSections = useMemo(() => {
    const keyword = search.toLowerCase()
    return sections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          const matchesKeyword =
            !keyword ||
            item.title.toLowerCase().includes(keyword) ||
            item.description?.toLowerCase().includes(keyword)
          return matchesKeyword
        }),
      }))
      .filter(section => section.items.length > 0)
  }, [sections, search])

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-5">{description}</p>}
        {!description && <div className="mb-5" />}

        <div className="mb-5 max-w-xl">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange?.(category.id)}
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

        {filteredSections.length === 0 ? (
          <div className="bg-surface border border-border rounded-card shadow-card">
            <EmptyState title="템플릿을 찾을 수 없습니다" description="다른 검색어나 분류로 다시 시도해 보세요." />
          </div>
        ) : (
          <div className="space-y-8">
            {filteredSections.map(section => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  {section.onMoreClick && (
                    <button
                      type="button"
                      onClick={section.onMoreClick}
                      className="text-xs text-brand hover:underline"
                    >
                      {section.moreLabel ?? '더보기'}
                    </button>
                  )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-[var(--page-padding)] px-[var(--page-padding)]">
                  {section.items.map(item => (
                    <CommunityCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
