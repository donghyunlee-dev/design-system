import { cn } from '../../utils/cn'
import { TextareaHTMLAttributes } from 'react'

/**
 * 여러 줄 텍스트 입력 컴포넌트.
 * HTML textarea의 모든 속성을 지원합니다.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground placeholder:text-placeholder resize-y min-h-[80px]',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50',
        error ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    />
  )
}
