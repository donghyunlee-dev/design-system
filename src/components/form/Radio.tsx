import { cn } from '../../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * 라디오 버튼 입력 컴포넌트. label prop으로 레이블을 함께 렌더링합니다.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 라디오 버튼 레이블 텍스트 */
  label?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, ...props },
  ref
) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="radio"
        className={cn('w-4 h-4 text-brand border-border focus:ring-brand', className)}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
})
