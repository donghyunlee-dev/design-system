import { ReactNode } from 'react'
import { Stat, StatProps } from '../../components/data/Stat'
import { Table, Column } from '../../components/data/Table'
import { cn } from '../../utils/cn'

export interface DashboardFullProps {
  title?: string
  actions?: ReactNode
  stats: StatProps[]
  mainChart?: ReactNode
  secondaryChart?: ReactNode
  recentData?: {
    title: string
    columns: Column<Record<string, unknown>>[]
    data: Record<string, unknown>[]
    rowKey: string
  }
  className?: string
}

export function DashboardFull({
  title = '대시보드', actions, stats, mainChart, secondaryChart, recentData, className,
}: DashboardFullProps) {
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
        {(mainChart || secondaryChart) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {mainChart && (
              <div className="lg:col-span-2 bg-surface border border-border rounded-card p-4">{mainChart}</div>
            )}
            {secondaryChart && (
              <div className="bg-surface border border-border rounded-card p-4">{secondaryChart}</div>
            )}
          </div>
        )}
        {recentData && (
          <div className="bg-surface border border-border rounded-card">
            <div className="px-4 py-3 border-b border-border">
              <p className="font-semibold text-foreground">{recentData.title}</p>
            </div>
            <div className="p-4">
              <Table columns={recentData.columns} data={recentData.data} rowKey={recentData.rowKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
