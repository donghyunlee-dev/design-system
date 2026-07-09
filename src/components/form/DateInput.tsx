import { Input, InputProps } from './Input'
import { InputHTMLAttributes } from 'react'

/**
 * 날짜 선택 입력 컴포넌트.
 * HTML date input의 모든 속성을 지원합니다.
 */
export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 오류 상태 표시 여부 */
  error?: boolean
}

export function DateInput(props: DateInputProps) {
  return <Input type="date" {...props} />
}
