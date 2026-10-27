import { Icon } from './Icon'
import { SVGAttributes } from 'react'

/**
 * 목록 행(row)이 클릭 가능함을 알리는 공용 chevron icon wrapper입니다.
 */
export interface ChevronRightIconProps extends SVGAttributes<SVGSVGElement> {
  /** 기존 Icon 컴포넌트와 동일한 크기 스케일(w-*, h-*) */
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function ChevronRightIcon({ size = 'sm', className, ...props }: ChevronRightIconProps) {
  return <Icon {...props} name="chevron-right" size={size} className={className} />
}
