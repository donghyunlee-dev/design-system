import { useMemo, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Card } from '../../components/data/Card'
import { MediaCard } from '../../components/data/MediaCard'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Button } from '../../components/foundation/Button'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface TemplateGalleryHeroTeam {
  id: string
  icon?: string
  /** 업무 영역/시스템 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
  count?: number
  onClick?: () => void
}

export interface TemplateGalleryHeroItem {
  id: string
  title: string
  description?: string
  icon?: string
  thumbnailSrc?: string
  /** 제공 부서/작성자 (예: 구매팀) */
  owner?: string
  /** 인기·신규 등 강조 배지 */
  badge?: string
  onUse?: () => void
}

export interface TemplateGalleryHeroSection {
  id: string
  icon?: string
  label: string
  description?: string
  items: TemplateGalleryHeroItem[]
  onViewAll?: () => void
}

/**
 * Asana 템플릿 갤러리 패턴을 참고한 변형: 좌측 사이드바 대신
 * 중앙 정렬 히어로(검색) + "업무 영역별로 찾기" 타일 그리드 + 영역별 섹션 나열 구조.
 * 사이드바 내비게이션 중심인 TemplateGallery/TemplateGalleryMedia와 달리
 * 탐색 진입점을 히어로 검색과 타일 그리드에 두는 화면에 사용한다.
 */
export interface TemplateGalleryHeroProps {
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  teamsTitle?: string
  teams: TemplateGalleryHeroTeam[]
  activeTeamId?: string
  featuredTitle?: string
  featured?: TemplateGalleryHeroItem[]
  sections: TemplateGalleryHeroSection[]
  ctaTitle?: string
  ctaDescription?: string
  ctaActionLabel?: string
  onCtaAction?: () => void
  className?: string
}

function TemplateItemCard({ item }: { item: TemplateGalleryHeroItem }) {
  return (
    <MediaCard
      image={item.thumbnailSrc}
      imageAlt={item.title}
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
        {item.owner ? <Tag className="truncate">{item.owner}</Tag> : <span />}
        <Button size="sm" variant="secondary" onClick={item.onUse} className="flex-shrink-0">
          이 템플릿 사용
        </Button>
      </div>
    </MediaCard>
  )
}

export function TemplateGalleryHero({
  title = '업무 템플릿 갤러리',
  subtitle = '자주 쓰는 업무 문서를 바로 시작해 보세요',
  searchPlaceholder = '템플릿 검색 (예: 발주서, 품의서, 재고 실사)',
  onSearch,
  teamsTitle = '업무 영역별로 찾기',
  teams,
  activeTeamId,
  featuredTitle = '많이 사용하는 템플릿',
  featured,
  sections,
  ctaTitle = '필요한 템플릿이 없나요?',
  ctaDescription = 'IT담당·AX팀에 새 템플릿 제작을 요청할 수 있습니다.',
  ctaActionLabel = '템플릿 요청하기',
  onCtaAction,
  className,
}: TemplateGalleryHeroProps) {
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearch?.(value)
  }

  const keyword = search.trim().toLowerCase()
  const matches = (item: TemplateGalleryHeroItem) =>
    !keyword ||
    item.title.toLowerCase().includes(keyword) ||
    item.description?.toLowerCase().includes(keyword) ||
    item.owner?.toLowerCase().includes(keyword)

  const visibleFeatured = useMemo(
    () => (featured ?? []).filter(matches),
    [featured, keyword]
  )

  const visibleSections = useMemo(
    () =>
      sections
        .map(section => ({ ...section, items: section.items.filter(matches) }))
        .filter(section => section.items.length > 0),
    [sections, keyword]
  )

  const hasResults = visibleFeatured.length > 0 || visibleSections.length > 0

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* 히어로: 중앙 정렬 타이틀 + 검색 */}
      <section className="bg-surface-subtle border-b border-border px-4 py-[var(--spacing-2xl)]">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-muted">{subtitle}</p>}
          <div className="mt-6">
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

      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-8 space-y-10">
        {/* 업무 영역 타일 그리드 */}
        {teams.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">{teamsTitle}</p>
            <Grid cols={4} gap={4}>
              {teams.map(team => (
                <Card
                  key={team.id}
                  onClick={team.onClick}
                  className={cn(
                    team.onClick && 'cursor-pointer hover:bg-surface-raised transition-colors',
                    team.id === activeTeamId && 'ring-2 ring-brand'
                  )}
                >
                  {team.icon && <p className="text-2xl mb-2">{team.icon}</p>}
                  <Tag>{team.label}</Tag>
                  {team.count !== undefined && (
                    <p className="text-xs text-muted mt-2">{team.count}개 템플릿</p>
                  )}
                </Card>
              ))}
            </Grid>
          </div>
        )}

        {!hasResults ? (
          <div className="bg-surface border border-border rounded-card shadow-card">
            <EmptyState title="템플릿을 찾을 수 없습니다" description="다른 검색어로 다시 시도해 보세요." />
          </div>
        ) : (
          <>
            {/* 추천 템플릿 */}
            {visibleFeatured.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">{featuredTitle}</p>
                <Grid cols={3} gap={4}>
                  {visibleFeatured.map(item => (
                    <TemplateItemCard key={item.id} item={item} />
                  ))}
                </Grid>
              </div>
            )}

            {/* 업무 영역별 섹션 */}
            {visibleSections.map(section => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {section.icon && <span className="text-base">{section.icon}</span>}
                    <Tag>{section.label}</Tag>
                    {section.description && (
                      <span className="text-xs text-muted">{section.description}</span>
                    )}
                  </div>
                  {section.onViewAll && (
                    <button
                      type="button"
                      onClick={section.onViewAll}
                      className="text-sm text-brand hover:underline flex-shrink-0"
                    >
                      전체 보기
                    </button>
                  )}
                </div>
                <Grid cols={3} gap={4}>
                  {section.items.map(item => (
                    <TemplateItemCard key={item.id} item={item} />
                  ))}
                </Grid>
              </div>
            ))}
          </>
        )}

        {/* 하단 CTA 배너 */}
        <Card className="bg-brand-subtle border-brand text-center py-8">
          <p className="text-base font-semibold text-foreground">{ctaTitle}</p>
          {ctaDescription && <p className="text-sm text-muted mt-1">{ctaDescription}</p>}
          {onCtaAction && (
            <Button className="mt-4" onClick={onCtaAction}>{ctaActionLabel}</Button>
          )}
        </Card>
      </div>
    </div>
  )
}
