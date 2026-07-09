import { cn } from '../../utils/cn'

/**
 * 작업 진행률을 나타내는 프로그레스 바 컴포넌트.
 */
export interface ProgressProps {
  /** 진행률 (0~100) */
  value: number
  /** 진행률의 기준 최대값. 진행률은 (value / max) × 100%로 계산됩니다. (기본값: 100) */
  max?: number
  className?: string
}

export function Progress({ value, max = 100, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className={cn('h-2 w-full rounded-full bg-surface-overlay overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
    >
      <div className="h-full bg-brand rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}
