import { cn } from '../../utils/cn'
import { SVGAttributes } from 'react'

/**
 * 문서 허브 등 카드형 목록에서 항목 성격을 표시하는 보조 아이콘 세트.
 * (design-system-gap 대응: Icon.tsx의 IconName은 'search'|'comment' 두 종류뿐이라
 * 계정/장비/문서/보안/자료 등 업무 카드 아이콘을 표현할 수 없어, Icon.tsx는 수정하지 않고
 * 동일한 스타일링 방식(24x24 viewBox, stroke currentColor, 동일 size 스케일)으로
 * 별도 파일에 확장 세트를 추가함)
 */
export type HubIconName = 'account' | 'device' | 'document' | 'folder' | 'lock' | 'box'

export interface HubIconProps extends SVGAttributes<SVGSVGElement> {
  name: HubIconName
  /** 아이콘 크기. Icon.tsx와 동일한 크기 단위(w-*, h-*) 스케일 */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const paths: Record<HubIconName, JSX.Element> = {
  account: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.5-1.5 1.8-2.5 3-2.5s2.5 1 3 2.5" />
      <line x1="14" y1="10" x2="18" y2="10" />
      <line x1="14" y1="13" x2="18" y2="13" />
    </>
  ),
  device: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <line x1="9.5" y1="12.5" x2="14.5" y2="12.5" />
      <line x1="9.5" y1="16" x2="14.5" y2="16" />
    </>
  ),
  folder: (
    <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  box: (
    <>
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 8v9l9 5 9-5V8" />
      <line x1="12" y1="13" x2="12" y2="22" />
    </>
  ),
}

/** 허브와 가이드 화면에서 사용하는 업무 카테고리 아이콘을 표시합니다. */
export function HubIcon({ name, size = 'sm', className, ...props }: HubIconProps) {
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
