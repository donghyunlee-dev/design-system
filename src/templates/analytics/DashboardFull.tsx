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
      <div className="mx-auto max-w-6xl px-[var(--windsoft-page-gutter)] py-ws-6">
        <div className="mb-ws-6 flex flex-wrap items-center justify-between gap-ws-3">
          <h1 className="text-page-title text-foreground">{title}</h1>
          {actions && <div className="flex flex-wrap gap-ws-2">{actions}</div>}
        </div>
        <div className="mb-ws-6 grid grid-cols-1 gap-ws-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>
        {(mainChart || secondaryChart) && (
          <div className={cn('mb-ws-6 grid grid-cols-1 gap-ws-4', secondaryChart ? 'lg:grid-cols-3' : 'lg:grid-cols-1')}>
            {mainChart && (
              <div className={cn('rounded-card border border-border bg-surface p-ws-4', secondaryChart && 'lg:col-span-2')}>{mainChart}</div>
            )}
            {secondaryChart && (
              <div className="rounded-card border border-border bg-surface p-ws-4">{secondaryChart}</div>
            )}
          </div>
        )}
        {recentData && (
          <div className="rounded-card border border-border bg-surface">
            <div className="border-b border-border px-ws-4 py-ws-3">
              <p className="text-section-title text-foreground">{recentData.title}</p>
            </div>
            <div className="p-ws-4">
              <Table columns={recentData.columns} data={recentData.data} rowKey={recentData.rowKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
