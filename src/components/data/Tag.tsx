import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'
import { Icon } from '../foundation/Icon'

/**
 * 태그 또는 키워드를 표시하는 인라인 태그 컴포넌트.
 * onRemove prop을 제공하면 삭제 버튼이 표시됩니다.
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 태그 삭제 콜백 — 제공 시 × 버튼 렌더링 */
  onRemove?: () => void
  /** 삭제 버튼의 접근성 레이블 (스크린리더용). 기본값: "삭제" */
  removeLabel?: string
}

export function Tag({ onRemove, removeLabel = '삭제', className, children, ...props }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-ws-1 rounded-badge border border-border bg-surface-subtle px-ws-2 py-0.5 text-caption text-secondary', className)} {...props}>
      {children}
      {onRemove && (
          <button type="button" onClick={onRemove} aria-label={removeLabel} className="ml-ws-1 inline-flex size-4 items-center justify-center rounded-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <Icon name="close" size="xs" />
          </button>
      )}
    </span>
  )
}
