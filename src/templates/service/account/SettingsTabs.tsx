import { ReactNode, useState } from 'react'
import { cn } from '../../../utils/cn'

export interface SettingsTab {
  key: string
  label: string
  content: ReactNode
}

export interface SettingsTabsProps {
  tabs: SettingsTab[]
  defaultTab?: string
  header?: ReactNode
  className?: string
}

export function SettingsTabs({ tabs, defaultTab, header, className }: SettingsTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)
  const current = tabs.find(t => t.key === active)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header && (
        <div className="border-b border-border px-[var(--page-padding)] py-4">{header}</div>
      )}
      <div className="max-w-3xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        <div className="flex border-b border-border mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-default',
                active === t.key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {current?.content}
      </div>
    </div>
  )
}
