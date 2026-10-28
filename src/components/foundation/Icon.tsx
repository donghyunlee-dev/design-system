import { cn } from '../../utils/cn'
import { JSX, SVGAttributes } from 'react'

/**
 * 외부 아이콘 라이브러리 없이 검색·상태·표 조작·내비게이션 아이콘을 같은 크기와 선 굵기로 표시합니다.
 */
export type IconName = 'search' | 'comment' | 'settings' | 'sort' | 'sort-asc' | 'sort-desc' | 'filter' | 'grip' | 'close' | 'check' | 'info' | 'help' | 'warning' | 'chevron-down' | 'chevron-right' | 'sidebar-close' | 'sidebar-open'

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
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
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
  check: <path d="m5 12 4 4L19 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.1 1-1.8 1.3-1.8 2.7m0 3h.01" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 4.9 2.8 18a1.4 1.4 0 0 0 1.2 2.1h15.9a1.4 1.4 0 0 0 1.2-2.1L13.7 4.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4m0 3h.01" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'sidebar-close': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M16 15l-3-3 3-3" />
    </>
  ),
  'sidebar-open': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18m5-6 3-3-3-3" />
    </>
  ),
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
