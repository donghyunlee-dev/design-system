import { cn } from '../../utils/cn'
import { ReactNode, useState } from 'react'

export interface TabItem { label: string; content: ReactNode; key: string }

export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.key)
  return (
    <div>
      <div className="flex border-b border-border">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              active === item.key
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-foreground'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{items.find(i => i.key === active)?.content}</div>
    </div>
  )
}
