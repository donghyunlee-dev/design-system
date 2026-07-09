import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

/** 최대 너비를 제한하고 중앙 정렬하는 컨테이너 컴포넌트. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)} {...props} />
}
