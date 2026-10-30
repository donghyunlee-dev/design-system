import { ReactNode, useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

export interface MonitoringKPI {
  label: string
  value: string | number
  unit?: string
  /** 수치 상태에 따른 의미 색상 */
  status?: 'normal' | 'warning' | 'danger'
}

export interface MonitoringStation {
  id: string
  name: string
  status: 'running' | 'idle' | 'error' | 'offline'
  value?: string
}

export interface MonitoringBoardProps {
  title: string
  /** 고정 타임스탬프 (생략 시 실시간 시계) */
  timestamp?: string
  kpis: MonitoringKPI[]
  stations?: MonitoringStation[]
  chart?: ReactNode
  onRefresh?: () => void
  className?: string
}

const KPI_STATUS_COLOR: Record<string, string> = {
  normal:  'text-foreground',
  warning: 'text-warning-foreground',
  danger:  'text-danger-foreground',
}

const STATION_CONFIG = {
  running: { dot: 'bg-success',  text: 'text-success-foreground',  label: '가동중' },
  idle:    { dot: 'bg-muted',    text: 'text-muted',               label: '대기중' },
  error:   { dot: 'bg-danger',   text: 'text-danger-foreground',    label: '오류' },
  offline: { dot: 'bg-border-strong', text: 'text-muted',           label: '오프라인' },
}

export function MonitoringBoard({
  title,
  timestamp,
  kpis,
  stations,
  chart,
  onRefresh,
  className,
}: MonitoringBoardProps) {
  const [now, setNow] = useState(timestamp ?? '')

  useEffect(() => {
    if (timestamp) { setNow(timestamp); return }
    const update = () => setNow(new Date().toLocaleTimeString('ko-KR'))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timestamp])

  return (
    <div className={cn('min-h-screen bg-background text-foreground flex flex-col', className)}>
      {/* 헤더 */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <h1 className="text-lg font-bold tracking-wide">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-secondary">
          <span>{now}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="hover:text-foreground transition-colors"
            >
              ↻ 갱신
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse" />
            <span className="text-xs">LIVE</span>
          </div>
        </div>
      </header>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4">
            <p className="text-xs text-secondary uppercase tracking-widest mb-2">{kpi.label}</p>
            <p className={cn('text-3xl font-bold', KPI_STATUS_COLOR[kpi.status ?? 'normal'])}>
              {kpi.value}
              {kpi.unit && (
                <span className="text-base font-normal text-secondary ml-1">{kpi.unit}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* 차트 + 설비 현황 */}
      <div
        className="flex-1 grid px-8 pb-6 gap-4"
        style={{ gridTemplateColumns: stations ? '2fr 1fr' : '1fr' }}
      >
        {chart && (
          <div className="bg-surface border border-border rounded-lg p-4">
            {chart}
          </div>
        )}
        {stations && (
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">
              설비 현황
            </h3>
            <div className="space-y-2">
              {stations.map(s => {
                const cfg = STATION_CONFIG[s.status]
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between bg-surface-subtle rounded-md px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                      <span className="text-sm">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.value && (
                        <span className="text-xs text-muted">{s.value}</span>
                      )}
                      <span className={cn('text-xs font-medium', cfg.text)}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
