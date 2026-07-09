import { ReactNode } from 'react'
import { Stat } from '../../components/data/Stat'
import { DataTable, DataColumn } from '../../components/data/DataTable'
import { cn } from '../../utils/cn'

export interface KPICard {
  label: string
  value: string | number
  change?: { value: string; trend: 'up' | 'down' | 'neutral' }
  icon?: string
}

export interface DashboardKPIProps {
  title: string
  /** "2026년 7월 1주차" 등 기간 레이블 */
  period?: string
  /** 상단 KPI 카드 (4개 권장) */
  kpis: KPICard[]
  /** 메인 차트 (LineChart, BarChart 등) */
  mainChart?: ReactNode
  /** 우측 서브 차트 (PieChart 등) — mainChart가 있을 때만 표시 */
  subChart?: ReactNode
  tableTitle?: string
  tableColumns?: DataColumn<Record<string, unknown>>[]
  tableData?: Record<string, unknown>[]
  actions?: ReactNode
  className?: string
}

export function DashboardKPI({
  title,
  period,
  kpis,
  mainChart,
  subChart,
  tableTitle,
  tableColumns,
  tableData,
  actions,
  className,
}: DashboardKPIProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {period && <p className="text-sm text-muted mt-0.5">{period}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <Stat
              key={i}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon ? <span>{kpi.icon}</span> : undefined}
            />
          ))}
        </div>

        {/* 차트 영역 */}
        {(mainChart || subChart) && (
          <div className={cn('grid gap-4 mb-6', subChart ? 'grid-cols-3' : 'grid-cols-1')}>
            {mainChart && (
              <div className={cn('bg-surface border border-border rounded-card p-4 shadow-card', subChart ? 'col-span-2' : 'col-span-1')}>
                {mainChart}
              </div>
            )}
            {subChart && (
              <div className="bg-surface border border-border rounded-card p-4 shadow-card">
                {subChart}
              </div>
            )}
          </div>
        )}

        {/* 요약 테이블 */}
        {tableColumns && tableData && (
          <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
            {tableTitle && (
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">{tableTitle}</h2>
              </div>
            )}
            <DataTable columns={tableColumns} data={tableData} rowKey="id" />
          </div>
        )}
      </div>
    </div>
  )
}
