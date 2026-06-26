import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void
}

export function Tag({ onRemove, className, children, ...props }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-surface-overlay border border-border rounded-badge text-secondary', className)} {...props}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 text-muted hover:text-foreground leading-none">×</button>
      )}
    </span>
  )
}
