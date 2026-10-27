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
    <div className={cn('rounded-card border border-border bg-surface p-ws-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption font-medium text-secondary">{label}</p>
          <p className="mt-ws-1 text-page-title font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              'mt-ws-1 text-caption font-medium',
              change.trend === 'up' && 'text-success-foreground',
              change.trend === 'down' && 'text-danger-foreground',
              change.trend === 'neutral' && 'text-secondary'
            )}>
              {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '—'} {change.value}
            </p>
          )}
        </div>
        {icon && <span aria-hidden="true" className="text-muted text-xl">{icon}</span>}
      </div>
    </div>
  )
}
