import { ReactNode } from 'react'
import { Button } from '../../../components/foundation/Button'
import { cn } from '../../../utils/cn'
import { NavItem } from '../../types'

export interface LandingMinimalProps {
  logo?: ReactNode
  nav?: NavItem[]
  eyebrow?: string
  headline: string
  subheadline?: string
  ctaPrimary?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  className?: string
}

export function LandingMinimal({
  logo, nav = [], eyebrow, headline, subheadline,
  ctaPrimary, ctaSecondary, className,
}: LandingMinimalProps) {
  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      {/* Minimal Nav */}
      <header className="flex items-center justify-between px-[var(--page-padding)] py-4">
        <div className="flex-1">
          {logo && <span className="font-bold text-foreground">{logo}</span>}
        </div>
        <nav className="flex items-center gap-4">
          {nav.map((item) => (
            <a key={item.href} href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'text-sm transition-colors duration-default',
                item.active ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
              )}>
              {item.label}
            </a>
          ))}
          {ctaPrimary && (
            <Button size="sm" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
          )}
        </nav>
      </header>

      {/* Full-height Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-[var(--spacing-2xl)]">
        {eyebrow && (
          <p className="text-sm font-medium text-brand uppercase tracking-widest mb-4">{eyebrow}</p>
        )}
        <h1 className="text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-none">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-6 text-xl text-muted max-w-2xl leading-relaxed">{subheadline}</p>
        )}
        <div className="mt-10 flex gap-4">
          {ctaPrimary && (
            <Button size="lg" onClick={ctaPrimary.onClick}>{ctaPrimary.label}</Button>
          )}
          {ctaSecondary && (
            <Button size="lg" variant="ghost" onClick={ctaSecondary.onClick}>
              {ctaSecondary.label} →
            </Button>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-muted py-6">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  )
}
