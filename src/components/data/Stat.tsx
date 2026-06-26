import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

export interface StatProps {
  label: string
  value: string | number
  change?: { value: string; trend: 'up' | 'down' | 'neutral' }
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
