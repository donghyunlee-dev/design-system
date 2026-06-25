import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-badge',
        variant === 'default' && 'bg-surface-overlay text-secondary border border-border',
        variant === 'success' && 'bg-green-50 text-green-700 border border-green-200',
        variant === 'warning' && 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        variant === 'danger'  && 'bg-red-50 text-red-700 border border-red-200',
        variant === 'info'    && 'bg-blue-50 text-blue-700 border border-blue-200',
        className
      )}
      {...props}
    />
  )
}
