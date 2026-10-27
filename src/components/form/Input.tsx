import { cn } from '../../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * 단일 줄 텍스트 입력 컴포넌트.
 * HTML input의 모든 속성을 지원합니다.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, className, 'aria-invalid': ariaInvalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full h-[var(--control-height-md)] px-ws-3 text-body bg-surface border rounded-input text-foreground placeholder:text-placeholder',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:opacity-50 disabled:bg-surface-subtle',
        error ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-brand',
        className
      )}
      aria-invalid={error || ariaInvalid}
      {...props}
    />
  )
})
