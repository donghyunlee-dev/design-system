import { cn } from '../../utils/cn'
import { SelectHTMLAttributes, forwardRef } from 'react'

/**
 * 드롭다운 선택 컴포넌트.
 * options 배열로 항목을 주입하며, 네이티브 select 속성을 모두 지원합니다.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** 오류 상태 표시 여부 */
  error?: boolean
  /** 선택 항목 목록 */
  options: { value: string; label: string }[]
  /** 미선택 상태 안내 문구 */
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error, options, placeholder, className, ...props },
  ref
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none px-3 py-2 pr-10 text-sm bg-surface border rounded-input text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
          'disabled:opacity-50',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
})
