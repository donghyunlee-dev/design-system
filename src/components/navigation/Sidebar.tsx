import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface SidebarItem {
  label: string
  icon?: ReactNode
  href?: string
  active?: boolean
}

export function Sidebar({ items, className }: { items: SidebarItem[]; className?: string }) {
  return (
    <aside className={cn('w-56 bg-surface border-r border-border flex flex-col py-2', className)}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href ?? '#'}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 text-sm rounded-btn mx-1 transition-colors',
            item.active
              ? 'bg-surface-overlay text-foreground font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface-raised'
          )}
        >
          {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
          {item.label}
        </a>
      ))}
    </aside>
  )
}
