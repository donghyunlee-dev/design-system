import { ReactNode } from 'react'

export interface NavbarProps {
  logo?: ReactNode
  items?: { label: string; href: string; active?: boolean }[]
  actions?: ReactNode
}

export function Navbar({ logo, items = [], actions }: NavbarProps) {
  return (
    <nav className="h-14 bg-surface border-b border-border flex items-center px-4 gap-6">
      {logo && <div className="font-semibold text-foreground">{logo}</div>}
      <ul className="flex items-center gap-1 flex-1">
        {items.map((item, i) => (
          <li key={i}>
            <a href={item.href} className={`px-3 py-1.5 text-sm rounded-btn transition-colors ${item.active ? 'bg-surface-raised text-foreground font-medium' : 'text-muted hover:text-foreground'}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </nav>
  )
}
