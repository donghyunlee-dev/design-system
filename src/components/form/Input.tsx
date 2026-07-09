import { cn } from '../../utils/cn'
import { InputHTMLAttributes } from 'react'

/**
 * 단일 줄 텍스트 입력 컴포넌트.
 * HTML input의 모든 속성을 지원합니다.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50 disabled:bg-surface-raised',
        error ? 'border-danger focus:ring-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
}
