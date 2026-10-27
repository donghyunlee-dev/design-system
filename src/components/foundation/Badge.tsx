import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

/**
 * 상태나 카테고리를 나타내는 인라인 배지 컴포넌트.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 배지의 색상 의미 */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-caption font-medium rounded-badge',
        variant === 'default' && 'bg-surface-overlay text-secondary border border-border',
        variant === 'success' && 'bg-success-subtle text-success-foreground border border-success-foreground/20',
        variant === 'warning' && 'bg-warning-subtle text-warning-foreground border border-warning-foreground/20',
        variant === 'danger'  && 'bg-danger-subtle text-danger-foreground border border-danger-foreground/20',
        variant === 'info'    && 'bg-info-subtle text-info-foreground border border-info-foreground/20',
        className
      )}
      {...props}
    />
  )
}
