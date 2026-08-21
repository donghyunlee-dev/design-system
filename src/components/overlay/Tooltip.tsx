import { cn } from '../../utils/cn'
import { ReactNode, useId, useState, cloneElement, isValidElement } from 'react'

/**
 * 요소에 hover 또는 포커스 시 추가 정보를 표시하는 툴팁 컴포넌트.
 */
export interface TooltipProps {
  /** 툴팁 텍스트 */
  content: string
  children: ReactNode
  /** 툴팁 표시 위치 */
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)
  const tooltipId = useId()

  const target = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-describedby': show ? tooltipId : undefined,
      })
    : children

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {target}
      {show && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-inverse-foreground bg-inverse-surface rounded whitespace-nowrap pointer-events-none',
            side === 'top'    && 'bottom-full left-1/2 -translate-x-1/2 mb-1',
            side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1',
            side === 'left'   && 'right-full top-1/2 -translate-y-1/2 mr-1',
            side === 'right'  && 'left-full top-1/2 -translate-y-1/2 ml-1',
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
