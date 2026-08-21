import { InputHTMLAttributes, forwardRef } from 'react'
import { Input } from './Input'

/** date | time | datetime-local 중 하나 */
export type DateTimeMode = 'date' | 'time' | 'datetime'

/**
 * 날짜·시간 선택 입력 컴포넌트.
 * mode로 날짜만 / 시간만 / 날짜+시간 선택을 제어합니다.
 * 브라우저 네이티브 date picker를 사용합니다.
 */
export interface DateTimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 선택 모드 — date(날짜만) | time(시간만) | datetime(날짜+시간), 기본값: date */
  mode?: DateTimeMode
  /** 오류 상태 표시 여부 */
  error?: boolean
}

const MODE_TYPE: Record<DateTimeMode, string> = {
  date: 'date',
  time: 'time',
  datetime: 'datetime-local',
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(function DateTimePicker(
  { mode = 'date', error, ...props },
  ref
) {
  return <Input ref={ref} type={MODE_TYPE[mode]} error={error} {...props} />
})
