import { cn } from '../../utils/cn'
import { ReactNode, useState } from 'react'

export interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className={cn(
          'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap pointer-events-none',
          side === 'top'    && 'bottom-full left-1/2 -translate-x-1/2 mb-1',
          side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1',
          side === 'left'   && 'right-full top-1/2 -translate-y-1/2 mr-1',
          side === 'right'  && 'left-full top-1/2 -translate-y-1/2 ml-1',
        )}>
          {content}
        </span>
      )}
    </span>
  )
}
