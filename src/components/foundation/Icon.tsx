import { cn } from '../../utils/cn'
import { JSX, SVGAttributes } from 'react'

/**
 * 외부 아이콘 라이브러리 없이 검색·상태·표 조작·내비게이션 아이콘을 같은 크기와 선 굵기로 표시합니다.
 */
export type IconName = 'search' | 'comment' | 'settings' | 'sort' | 'sort-asc' | 'sort-desc' | 'filter' | 'grip' | 'close' | 'chevron-down' | 'chevron-right'

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName
  /** 아이콘 크기. 기존 컴포넌트에서 쓰는 크기 단위(w-*, h-*)와 동일한 스케일 */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
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
  settings: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.51-6.49-2.12 2.12m-8.74 8.74-2.12 2.12m0-12.98 2.12 2.12m8.74 8.74 2.12 2.12" />
    </>
  ),
  sort: (
    <>
      <path d="m8 4-3 3 3 3" /><path d="M5 7h9a4 4 0 0 1 4 4v1" />
      <path d="m16 20 3-3-3-3" /><path d="M19 17h-9a4 4 0 0 1-4-4v-1" />
    </>
  ),
  'sort-asc': <path d="m6 14 6-6 6 6" />,
  'sort-desc': <path d="m6 10 6 6 6-6" />,
  filter: <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" />,
  grip: (
    <>
      <circle cx="8" cy="6" r="1" /><circle cx="16" cy="6" r="1" />
      <circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" />
      <circle cx="8" cy="18" r="1" /><circle cx="16" cy="18" r="1" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
}

/** WindSoft UI 공용 아이콘을 표시합니다. */
export function Icon({ name, size = 'sm', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
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
