import { ReactNode, useState } from 'react'
import { cn } from '../../../utils/cn'

export interface SettingsSection {
  key: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

export interface SettingsSidebarProps {
  sections: SettingsSection[]
  defaultSection?: string
  header?: ReactNode
  className?: string
}

export function SettingsSidebar({ sections, defaultSection, header, className }: SettingsSidebarProps) {
  const [active, setActive] = useState(defaultSection ?? sections[0]?.key)
  const current = sections.find(s => s.key === active)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header && (
        <div className="border-b border-border px-[var(--page-padding)] py-4">{header}</div>
      )}
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)] flex gap-8">
        <aside className="w-48 flex-shrink-0">
          <nav className="flex flex-col gap-0.5">
            {sections.map(s => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(s.key)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 text-sm rounded-btn text-left transition-colors duration-default',
                  active === s.key
                    ? 'bg-surface-overlay text-foreground font-medium'
                    : 'text-muted hover:text-foreground hover:bg-surface-raised'
                )}
              >
                {s.icon && <span className="w-4 h-4 flex-shrink-0">{s.icon}</span>}
                {s.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          {current && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">{current.label}</h2>
              {current.content}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
