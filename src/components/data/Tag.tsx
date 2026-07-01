import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

/**
 * 태그 또는 키워드를 표시하는 인라인 태그 컴포넌트.
 * onRemove prop을 제공하면 삭제 버튼이 표시됩니다.
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 태그 삭제 콜백 — 제공 시 × 버튼 렌더링 */
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
