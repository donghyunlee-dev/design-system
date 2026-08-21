import { cn } from '../../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * 체크박스 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 체크박스 레이블 텍스트 */
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...props },
  ref
) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className={cn('w-4 h-4 rounded text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
})
