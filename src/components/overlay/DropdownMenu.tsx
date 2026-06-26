import { cn } from '../../utils/cn'
import { ReactNode, useState, useRef, useEffect } from 'react'

export interface DropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  danger?: boolean
  divider?: boolean
}

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownItem[]
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen(v => !v)}>{trigger}</span>
      {open && (
        <div className="absolute top-full right-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg py-1 min-w-[160px]">
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="border-t border-border my-1" />}
              <button
                className={cn('w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-surface-raised', item.danger && 'text-danger')}
                onClick={() => { item.onClick(); setOpen(false) }}
              >
                {item.icon}{item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
