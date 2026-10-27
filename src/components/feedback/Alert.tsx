import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

/**
 * 중요 메시지를 강조하여 표시하는 알림 컴포넌트.
 */
export interface AlertProps {
  /** 알림의 의미적 유형 */
  variant?: 'info' | 'success' | 'warning' | 'danger'
  /** 알림 제목 */
  title?: string
  children: ReactNode
  className?: string
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-card border px-ws-4 py-ws-3 text-body',
        variant === 'info'    && 'border-info-foreground/20 bg-info-subtle text-info-foreground',
        variant === 'success' && 'border-success-foreground/20 bg-success-subtle text-success-foreground',
        variant === 'warning' && 'border-warning-foreground/20 bg-warning-subtle text-warning-foreground',
        variant === 'danger'  && 'border-danger-foreground/20 bg-danger-subtle text-danger-foreground',
        className
      )}
    >
      {title && <p className="mb-1 font-medium">{title}</p>}
      <p>{children}</p>
    </div>
  )
}
