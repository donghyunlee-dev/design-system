import { cn } from '../../utils/cn'

export interface ProgressProps {
  value: number
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
