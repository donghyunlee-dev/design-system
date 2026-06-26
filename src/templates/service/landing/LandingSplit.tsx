import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Badge } from '../../../components/foundation/Badge'
import { cn } from '../../../utils/cn'
import { NavItem, FeatureItem } from '../../types'

export interface LandingSplitProps {
  logo?: ReactNode
  nav?: NavItem[]
  badge?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  media?: ReactNode
  features?: FeatureItem[]
  className?: string
}

export function LandingSplit({
  logo, nav = [], badge, headline, subheadline,
  ctaPrimary, ctaSecondary, media, features = [], className,
}: LandingSplitProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Nav */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-[var(--page-padding)]">
        <div className="flex items-center gap-2 flex-1">
          {logo && <span className="font-bold text-foreground text-lg">{logo}</span>}
        </div>
        <nav className="flex items-center gap-1">
          {nav.map((item, i) => (
            <a key={i} href={item.href}
              className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors duration-default rounded-btn">
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

      {/* Hero Split */}
      <section className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-2xl)] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          {badge && <Badge className="mb-4">{badge}</Badge>}
          <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-4 text-lg text-muted leading-relaxed">{subheadline}</p>
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
        </div>
        <div className="flex items-center justify-center">
          {media ?? (
            <div className="w-full aspect-video bg-surface-overlay rounded-card border border-border flex items-center justify-center text-muted text-sm">
              미디어 영역
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="bg-surface border-t border-border px-[var(--page-padding)] py-[var(--spacing-xl)]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{f.title}</p>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-border px-[var(--page-padding)] py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
