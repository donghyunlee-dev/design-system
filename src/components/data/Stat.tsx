import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

/**
 * KPI 수치를 강조하여 표시하는 통계 카드 컴포넌트.
 */
export interface StatProps {
  /** 지표 레이블 */
  label: string
  /** 표시할 수치 */
  value: string | number
  /** 변화율 표시 */
  change?: { value: string; trend: 'up' | 'down' | 'neutral' }
  /** 지표 아이콘 */
  icon?: ReactNode
  className?: string
}

export function Stat({ label, value, change, icon, className }: StatProps) {
  return (
    <div className={cn('bg-surface border border-border rounded-card p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={cn(
              'text-xs mt-1 font-medium',
              change.trend === 'up' && 'text-success',
              change.trend === 'down' && 'text-danger',
              change.trend === 'neutral' && 'text-muted'
            )}>
              {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '—'} {change.value}
            </p>
          )}
        </div>
        {icon && <span className="text-muted text-xl">{icon}</span>}
      </div>
    </div>
  )
}
