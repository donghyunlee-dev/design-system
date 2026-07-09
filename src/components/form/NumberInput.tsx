import { InputHTMLAttributes } from 'react'
import { Input } from './Input'
import { cn } from '../../utils/cn'

/**
 * 숫자 전용 입력 컴포넌트.
 * unit prop으로 우측에 단위 레이블(개, kg, ℃ 등)을 표시합니다.
 * HTML number input의 모든 속성을 지원합니다.
 */
export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 우측에 표시할 단위 레이블 (예: "개", "kg", "℃") */
  unit?: string
  /** 오류 상태 표시 여부 — 테두리를 danger 색상으로 변경 */
  error?: boolean
}

export function NumberInput({ unit, error, className, ...props }: NumberInputProps) {
  if (!unit) {
    return <Input type="number" error={error} className={className} {...props} />
  }
  return (
    <div className="relative">
      <Input
        type="number"
        error={error}
        className={cn('pr-10', className)}
        {...props}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none select-none">
        {unit}
      </span>
    </div>
  )
}
