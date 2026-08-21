import { cn } from '../../utils/cn'
import { SVGAttributes } from 'react'

/**
 * 목록 행(row)이 클릭 가능함을 알리는 보조 시각 단서.
 * Icon.tsx의 IconName 세트(search/comment)와 별개 용도(내비게이션 힌트)라
 * 기존 Icon 컴포넌트를 건드리지 않고 같은 SVG 컴포지션 방식으로 별도 추가합니다.
 */
export interface ChevronRightIconProps extends SVGAttributes<SVGSVGElement> {
  /** 기존 Icon 컴포넌트와 동일한 크기 스케일(w-*, h-*) */
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const sizeMap = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
}

export function ChevronRightIcon({ size = 'sm', className, ...props }: ChevronRightIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(sizeMap[size], className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}
