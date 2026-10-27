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
      <div className="mx-auto max-w-6xl px-[var(--windsoft-page-gutter)] py-ws-6">
        <div className="mb-ws-6 flex flex-wrap items-center justify-between gap-ws-3">
          <h1 className="text-page-title text-foreground">{title}</h1>
          {actions && <div className="flex flex-wrap gap-ws-2">{actions}</div>}
        </div>
        <div className="mb-ws-6 grid grid-cols-1 gap-ws-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>
        {chart && (
          <div className="rounded-card border border-border bg-surface p-ws-4">
            {chart}
          </div>
        )}
      </div>
    </div>
  )
}
