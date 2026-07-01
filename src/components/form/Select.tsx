import { cn } from '../../utils/cn'
import { SelectHTMLAttributes } from 'react'

/**
 * 드롭다운 선택 컴포넌트.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** 오류 상태 표시 여부 */
  error?: boolean
  /** 선택 항목 목록 */
  options: { value: string; label: string }[]
  /** 미선택 상태 안내 문구 */
  placeholder?: string
}

export function Select({ error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-input text-foreground',
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
  )
}
