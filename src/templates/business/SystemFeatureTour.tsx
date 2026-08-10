import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Tag } from '../../components/data/Tag'
import { Divider } from '../../components/layout/Divider'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

export interface SystemFeatureTourSection {
  id: string
  /** 좌측 목차·본문에 노출되는 시스템 구분 태그 (예: ERP, OMS, WMS, PRM, 그룹웨어) */
  system: string
  title: string
  description: string
  /** 핵심 기능 bullet 목록 */
  highlights?: string[]
  /** 화면 미리보기 영역. 생략하면 기본 placeholder가 표시됩니다. */
  visual?: ReactNode
}

export interface SystemFeatureTourProps {
  title?: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  sections: SystemFeatureTourSection[]
  /** 각 섹션 하단에 표시할 안내/문의 버튼 */
  ctaLabel?: string
  onCtaClick?: () => void
  className?: string
}

export function SystemFeatureTour({
  title = '사내 시스템 기능 둘러보기',
  description,
  breadcrumb,
  sections,
  ctaLabel,
  onCtaClick,
  className,
}: SystemFeatureTourProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>}

        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        {description && <p className="text-sm text-muted mb-6 max-w-2xl leading-relaxed">{description}</p>}
        {!description && <div className="mb-6" />}

        <div className="flex gap-8 items-start">
          {/* 좌측: 기능 목차 (스크롤 시 고정) */}
          <aside className="w-48 flex-shrink-0 hidden lg:block sticky top-6">
            <p className="px-1 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">기능 목록</p>
            <ul className="space-y-1">
              {sections.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block px-2.5 py-1.5 text-sm text-muted hover:text-brand hover:bg-surface-subtle rounded-btn transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* 우측: 기능 소개 섹션 (교차 레이아웃) */}
          <div className="flex-1 min-w-0">
            {sections.map((section, i) => (
              <div key={section.id}>
                {i > 0 && <Divider className="my-10" />}
                <section
                  id={section.id}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-2 gap-8 items-center',
                    i % 2 === 1 && 'md:[&>*:first-child]:order-2'
                  )}
                >
                  <div>
                    <Tag className="mb-3">{section.system}</Tag>
                    <h2 className="text-xl font-bold text-foreground mb-2">{section.title}</h2>
                    <p className="text-sm text-muted leading-relaxed mb-4">{section.description}</p>
                    {section.highlights && section.highlights.length > 0 && (
                      <ul className="space-y-1.5">
                        {section.highlights.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="text-brand mt-0.5">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {ctaLabel && (
                      <Button variant="secondary" size="sm" className="mt-5" onClick={onCtaClick}>
                        {ctaLabel}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {section.visual ?? (
                      <div className="w-full aspect-video bg-surface-overlay rounded-card border border-border flex items-center justify-center text-muted text-sm">
                        화면 미리보기
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
