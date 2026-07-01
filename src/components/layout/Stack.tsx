import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

/**
 * 자식 요소를 수직 또는 수평으로 정렬하는 레이아웃 컴포넌트.
 */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** 정렬 방향. 'col'은 세로(flex-column), 'row'는 가로(flex-row) */
  direction?: 'row' | 'col'
  /** 자식 요소 간 간격 (Tailwind gap 숫자) */
  gap?: 1 | 2 | 3 | 4 | 6 | 8
  /** 교차축(cross-axis) 정렬 — CSS align-items에 대응 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** 주축(main-axis) 정렬 — CSS justify-content에 대응 */
  justify?: 'start' | 'center' | 'end' | 'between'
}

export function Stack({ direction = 'col', gap = 4, align, justify, className, ...props }: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        gap === 1 && 'gap-1', gap === 2 && 'gap-2', gap === 3 && 'gap-3',
        gap === 4 && 'gap-4', gap === 6 && 'gap-6', gap === 8 && 'gap-8',
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch',
        justify === 'start' && 'justify-start',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        justify === 'between' && 'justify-between',
        className
      )}
      {...props}
    />
  )
}
