import { cn } from '../../utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

/**
 * 관련 콘텐츠를 그룹화하는 카드 컴포넌트.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 제목 */
  title?: string
  /** 카드 부제목 */
  description?: string
  /** 카드 하단 액션 영역 */
  footer?: ReactNode
  /** 카드 내부 패딩 크기 */
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
