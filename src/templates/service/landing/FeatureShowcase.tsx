import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Badge } from '../../../components/foundation/Badge'
import { Divider } from '../../../components/layout/Divider'
import { cn } from '../../../utils/cn'
import { NavItem } from '../../types'

export interface FeatureShowcaseSection {
  id: string
  /** 섹션 상단 배지 (예: 발주관리, 협력사 포털) */
  eyebrow?: string
  title: string
  description: string
  /** 핵심 기능 bullet 목록 */
  highlights?: string[]
  /** 화면 미리보기 영역. 생략하면 기본 placeholder가 표시됩니다. */
  media?: ReactNode
}

export interface FeatureShowcaseProps {
  logo?: ReactNode
  nav?: NavItem[]
  badge?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  /** 히어로 하단의 빠른 이동 목록 */
  sections: FeatureShowcaseSection[]
  /** 마지막 섹션 아래 CTA 배너 */
  closingTitle?: string
  closingCta?: { label: string; onClick: () => void }
  className?: string
}

export function FeatureShowcase({
  logo,
  nav = [],
  badge,
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  sections,
  closingTitle,
  closingCta,
  className,
}: FeatureShowcaseProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Nav */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-[var(--page-padding)]">
        <div className="flex items-center gap-2 flex-1">
          {logo && <span className="font-bold text-foreground text-lg">{logo}</span>}
        </div>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <a key={item.href} href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors duration-default rounded-btn',
                item.active ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
              )}>
              {item.label}
            </a>
          ))}
        </nav>
        {ctaPrimary && (
          <Button size="sm" className="ml-4" onClick={ctaPrimary.onClick}>
            {ctaPrimary.label}
          </Button>
        )}
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-[var(--spacing-2xl)] pb-[var(--spacing-xl)]">
        {badge && <Badge className="mb-4">{badge}</Badge>}
        <h1 className="text-5xl font-bold tracking-tight text-foreground max-w-3xl leading-tight">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-4 text-lg text-muted max-w-xl leading-relaxed">{subheadline}</p>
        )}
        <div className="mt-8 flex gap-3">
          {ctaPrimary && (
            <Button size="lg" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
          )}
          {ctaSecondary && (
            <Button size="lg" variant="secondary" onClick={ctaSecondary.onClick}>
              {ctaSecondary.label}
            </Button>
          )}
        </div>

        {/* Quick jump */}
        {sections.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-3xl">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-3.5 py-1.5 text-sm text-muted bg-surface border border-border rounded-full hover:text-brand hover:border-brand transition-colors duration-default"
              >
                {section.eyebrow ?? section.title}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Feature sections */}
      <section className="bg-surface border-t border-border px-[var(--page-padding)] py-[var(--spacing-2xl)]">
        <div className="max-w-5xl mx-auto">
          {sections.map((section, i) => (
            <div key={section.id}>
              {i > 0 && <Divider className="my-14" />}
              <div
                id={section.id}
                className={cn(
                  'grid grid-cols-1 md:grid-cols-2 gap-12 items-center scroll-mt-20',
                  i % 2 === 1 && 'md:[&>*:first-child]:order-2'
                )}
              >
                <div>
                  {section.eyebrow && <Badge className="mb-3">{section.eyebrow}</Badge>}
                  <h2 className="text-2xl font-bold text-foreground mb-3">{section.title}</h2>
                  <p className="text-base text-muted leading-relaxed mb-5">{section.description}</p>
                  {section.highlights && section.highlights.length > 0 && (
                    <ul className="space-y-2">
                      {section.highlights.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="text-brand mt-0.5">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {section.media ?? (
                    <div className="w-full aspect-video bg-surface-overlay rounded-card border border-border flex items-center justify-center text-muted text-sm">
                      화면 미리보기
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      {(closingTitle || closingCta) && (
        <section className="px-[var(--page-padding)] py-[var(--spacing-2xl)] text-center">
          {closingTitle && (
            <h2 className="text-2xl font-bold text-foreground max-w-xl mx-auto leading-snug">
              {closingTitle}
            </h2>
          )}
          {closingCta && (
            <Button size="lg" className="mt-6" onClick={closingCta.onClick}>
              {closingCta.label}
            </Button>
          )}
        </section>
      )}

      <footer className="border-t border-border px-[var(--page-padding)] py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
