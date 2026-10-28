import { forwardRef } from 'react'
import { Icon } from '../foundation/Icon'
import { Input, InputProps } from './Input'

/** 검색 아이콘과 간격을 적용한 재사용 가능한 검색 입력입니다. */
export interface SearchFieldProps extends Omit<InputProps, 'type'> {}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { className, ...props },
  ref
) {
  return (
    <span className="relative block min-w-0">
      <Icon name="search" className="pointer-events-none absolute left-ws-3 top-1/2 -translate-y-1/2 text-muted" />
      <Input {...props} ref={ref} type="search" className={`pl-10 ${className ?? ''}`} />
    </span>
  )
})
