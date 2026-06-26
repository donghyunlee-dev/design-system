import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 4 | 6 | 8
}

export function Grid({ cols = 2, gap = 4, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        cols === 1 && 'grid-cols-1', cols === 2 && 'grid-cols-2',
        cols === 3 && 'grid-cols-3', cols === 4 && 'grid-cols-4',
        cols === 6 && 'grid-cols-6', cols === 12 && 'grid-cols-12',
        gap === 2 && 'gap-2', gap === 4 && 'gap-4',
        gap === 6 && 'gap-6', gap === 8 && 'gap-8',
        className
      )}
      {...props}
    />
  )
}
