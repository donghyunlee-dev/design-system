import { cn } from '../../utils/cn'
import { TextareaHTMLAttributes, forwardRef } from 'react'

/**
 * 여러 줄 텍스트 입력 컴포넌트.
 * HTML textarea의 모든 속성을 지원합니다.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, 'aria-invalid': ariaInvalid, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full min-h-[var(--textarea-min-height)] px-ws-2 py-1.5 text-body bg-surface border rounded-input text-foreground placeholder:text-placeholder resize-y',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:opacity-50 disabled:bg-surface-subtle',
        error ? 'border-danger focus-visible:border-danger focus-visible:ring-danger' : 'border-border focus-visible:border-focus focus-visible:ring-focus',
        className
      )}
      aria-invalid={error || ariaInvalid}
      {...props}
    />
  )
})
