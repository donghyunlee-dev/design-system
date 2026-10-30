import { ReactNode } from 'react'
import type { StatProps } from '../../components/data/Stat'
import { DashboardFull } from './DashboardFull'

export interface DashboardStatsProps {
  title?: string
  actions?: ReactNode
  stats: StatProps[]
  chart?: ReactNode
  className?: string
}

export function DashboardStats({ title = '대시보드', actions, stats, chart, className }: DashboardStatsProps) {
  return <DashboardFull title={title} actions={actions} stats={stats} mainChart={chart} className={className} />
}
