import { cn } from '../../utils/cn'
import { SVGAttributes } from 'react'

/**
 * 시스템에서 공용으로 사용하는 최소 아이콘 세트.
 * 외부 아이콘 라이브러리 의존성 없이, 코멘트 수/검색 등 텍스트로만 표현되던
 * 보조 정보에 시각적 단서를 더하기 위한 용도로 사용합니다.
 */
export type IconName = 'search' | 'comment'

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName
  /** 아이콘 크기. 기존 컴포넌트에서 쓰는 크기 단위(w-*, h-*)와 동일한 스케일 */
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const sizeMap = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
}

const paths: Record<IconName, JSX.Element> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  comment: (
    <path d="M4 4h16v12H8l-4 4V4z" />
  ),
}

export function Icon({ name, size = 'sm', className, ...props }: IconProps) {
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
      {paths[name]}
    </svg>
  )
}
