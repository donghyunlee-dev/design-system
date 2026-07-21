import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Divider } from '../../components/layout/Divider'
import { Input } from '../../components/form/Input'
import { cn } from '../../utils/cn'

export interface DocsHubNavItem {
  id: string
  label: string
  href?: string
}

export interface DocsHubNavSection {
  id: string
  /** 시스템 구분 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  label: string
  items: DocsHubNavItem[]
}

export interface DocsHubGuideCard {
  id: string
  icon?: string
  /** 소속 시스템 태그 (예: ERP) */
  system?: string
  title: string
  description?: string
  href?: string
  onClick?: () => void
}

export interface DocsHubQuickLink {
  id: string
  label: string
  description?: string
  href?: string
  onClick?: () => void
}

export interface DocsHubAnnouncement {
  id: string
  title: string
  date?: string
  tag?: string
}

export interface DocsHubProps {
  title?: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  /** 검색창 placeholder */
  searchPlaceholder?: string
  /** 좌측 네비게이션에 표시할 시스템별 문서 섹션 */
  sections: DocsHubNavSection[]
  /** 현재 활성화된 네비게이션 항목 id */
  activeItemId?: string
  onNavSelect?: (item: DocsHubNavItem) => void
  /** 중앙 영역에 표시할 주요 가이드 카드 */
  featuredTitle?: string
  featured: DocsHubGuideCard[]
  /** 우측 패널 — 바로가기 */
  quickLinks?: DocsHubQuickLink[]
  /** 우측 패널 — 공지사항 */
  announcements?: DocsHubAnnouncement[]
  className?: string
}

export function DocsHub({
  title = '업무 시스템 문서 홈',
  description,
  breadcrumb,
  searchPlaceholder = '시스템 매뉴얼·API·FAQ 검색 (예: 발주 등록, 재고 조회)',
  sections,
  activeItemId,
  onNavSelect,
  featuredTitle = '많이 찾는 가이드',
  featured,
  quickLinks,
  announcements,
  className,
}: DocsHubProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>}

        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-5">{description}</p>}
        {!description && <div className="mb-5" />}

        <div className="mb-6 max-w-xl">
          <Input type="search" placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
        </div>

        <div className="flex gap-6 items-start">
          {/* 좌측: 시스템별 문서 네비게이션 */}
          <nav className="w-56 flex-shrink-0 hidden lg:block">
            {sections.map(section => (
              <div key={section.id} className="mb-5">
                <p className="px-1 mb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                  {section.label}
                </p>
                <ul>
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onNavSelect?.(item)}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 text-sm rounded-btn transition-colors',
                          item.id === activeItemId
                            ? 'bg-brand-subtle text-brand font-medium'
                            : 'text-foreground hover:bg-surface-subtle'
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* 중앙: 주요 가이드 카드 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-3">{featuredTitle}</p>
            <Grid cols={3} gap={4}>
              {featured.map(card => (
                <Card
                  key={card.id}
                  onClick={card.onClick}
                  className={cn((card.onClick || card.href) && 'cursor-pointer hover:bg-surface-raised transition-colors')}
                >
                  <div className="flex items-start justify-between mb-2">
                    {card.icon && <span className="text-2xl">{card.icon}</span>}
                    {card.system && <Tag>{card.system}</Tag>}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{card.title}</p>
                  {card.description && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">{card.description}</p>
                  )}
                </Card>
              ))}
            </Grid>
          </div>

          {/* 우측: 바로가기 · 공지사항 */}
          <aside className="w-72 flex-shrink-0 hidden xl:block space-y-6">
            {quickLinks && quickLinks.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">바로가기</p>
                <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border">
                  {quickLinks.map(link => (
                    <button
                      key={link.id}
                      type="button"
                      onClick={link.onClick}
                      className="w-full text-left px-3 py-2.5 hover:bg-surface-subtle transition-colors"
                    >
                      <p className="text-sm text-foreground font-medium">{link.label}</p>
                      {link.description && <p className="text-xs text-muted mt-0.5">{link.description}</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {announcements && announcements.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">공지사항</p>
                <div className="bg-surface border border-border rounded-card shadow-card p-3 space-y-3">
                  {announcements.map((item, i) => (
                    <div key={item.id}>
                      {i > 0 && <Divider className="mb-3" />}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-foreground">{item.title}</p>
                        {item.tag && <Tag>{item.tag}</Tag>}
                      </div>
                      {item.date && <p className="text-xs text-muted mt-1">{item.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
