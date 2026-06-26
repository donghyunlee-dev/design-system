import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface ListItem {
  id: string | number
  primary: string
  secondary?: string
  leading?: ReactNode
  trailing?: ReactNode
}

export function List({ items, onItemClick, className }: { items: ListItem[]; onItemClick?: (item: ListItem) => void; className?: string }) {
  return (
    <ul className={cn('divide-y divide-border border border-border rounded-card overflow-hidden', className)}>
      {items.map(item => (
        <li
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className={cn('flex items-center gap-3 px-4 py-3 bg-surface', onItemClick && 'cursor-pointer hover:bg-surface-raised')}
        >
          {item.leading && <span className="flex-shrink-0">{item.leading}</span>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{item.primary}</p>
            {item.secondary && <p className="text-xs text-muted truncate">{item.secondary}</p>}
          </div>
          {item.trailing && <span className="flex-shrink-0 text-muted">{item.trailing}</span>}
        </li>
      ))}
    </ul>
  )
}
