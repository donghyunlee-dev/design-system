import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { Badge } from '../../../components/foundation/Badge'
import { cn } from '../../../utils/cn'
import { NavItem, FeatureItem } from '../../types'

export interface LandingCenteredProps {
  logo?: ReactNode
  nav?: NavItem[]
  badge?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  features?: FeatureItem[]
  className?: string
}

export function LandingCentered({
  logo,
  nav = [],
  badge,
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  features = [],
  className,
}: LandingCenteredProps) {
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
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="px-[var(--page-padding)] pb-[var(--spacing-2xl)]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <p className="font-semibold text-foreground mb-1">{f.title}</p>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-[var(--page-padding)] py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
