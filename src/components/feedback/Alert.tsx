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
        'rounded-card border px-4 py-3 text-sm',
        variant === 'info'    && 'bg-blue-50 border-blue-200 text-blue-800',
        variant === 'success' && 'bg-green-50 border-green-200 text-green-800',
        variant === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
        variant === 'danger'  && 'bg-red-50 border-red-200 text-red-800',
        className
      )}
    >
      {title && <p className="font-medium mb-1">{title}</p>}
      <p>{children}</p>
    </div>
  )
}
