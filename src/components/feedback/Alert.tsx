import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
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
