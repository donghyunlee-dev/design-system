import { ReactNode, useState } from 'react'
import { cn } from '../../utils/cn'

export interface SettingsSection {
  id: string
  label: string
  icon?: string
  content: ReactNode
}

export interface SettingsPageProps {
  title: string
  sections: SettingsSection[]
  defaultSection?: string
  className?: string
}

export function SettingsPage({
  title,
  sections,
  defaultSection,
  className,
}: SettingsPageProps) {
  const [active, setActive] = useState(defaultSection ?? sections[0]?.id ?? '')
  const current = sections.find(s => s.id === active)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        <div className="flex gap-6 items-start">
          {/* 사이드바 내비 */}
          <nav className="w-48 flex-shrink-0 bg-surface border border-border rounded-card shadow-card p-2">
            <ul className="space-y-0.5">
              {sections.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(s.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                      active === s.id
                        ? 'bg-brand-subtle text-brand'
                        : 'text-muted hover:text-foreground hover:bg-surface-subtle'
                    )}
                  >
                    {s.icon && <span className="text-base">{s.icon}</span>}
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 콘텐츠 */}
          <div className="flex-1 bg-surface border border-border rounded-card shadow-card p-6">
            {current && (
              <>
                <h2 className="text-base font-semibold text-foreground mb-5">{current.label}</h2>
                {current.content}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
