import { forwardRef } from 'react'
import { Input, InputProps } from './Input'

/**
 * 날짜 선택 입력 컴포넌트.
 * HTML date input의 모든 속성을 지원합니다.
 */
export interface DateInputProps extends Omit<InputProps, 'type'> {}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(props, ref) {
  return <Input ref={ref} type="date" {...props} />
})
