import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ title, description, footer, padding = 'md', className, children, ...props }: CardProps) {
  const p = { sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding]
  return (
    <div className={cn('bg-surface border border-border rounded-card shadow-sm', className)} {...props}>
      {(title || description) && (
        <div className={cn(p, 'border-b border-border')}>
          {title && <p className="font-semibold text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <div className={p}>{children}</div>
      {footer && <div className={cn(p, 'border-t border-border')}>{footer}</div>}
    </div>
  )
}
