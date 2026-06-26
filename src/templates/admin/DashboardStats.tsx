import { ReactNode } from 'react'
import { Stat, StatProps } from '../../components/data/Stat'
import { cn } from '../../utils/cn'

export interface DashboardStatsProps {
  title?: string
  actions?: ReactNode
  stats: StatProps[]
  chart?: ReactNode
  className?: string
}

export function DashboardStats({ title = '대시보드', actions, stats, chart, className }: DashboardStatsProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>
        {chart && (
          <div className="bg-surface border border-border rounded-card p-4">
            {chart}
          </div>
        )}
      </div>
    </div>
  )
}
