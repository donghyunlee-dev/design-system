import { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { UptimeHistoryStrip, UptimeDay } from '../../components/data/UptimeHistoryStrip'

export type SystemHealthStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'

export interface SystemStatusItem {
  id: string
  /** 시스템명 (예: ERP, OMS, WMS) */
  name: string
  status: SystemHealthStatus
  /** 시스템 설명 (예: Full Name) */
  description?: string
  /** "99.98%" 등 가동률 표시 */
  uptime?: string
  /** 최근 90일 등 일별 가동 이력 (오래된 날짜 → 최근 날짜 순) */
  history?: UptimeDay[]
  /** 소속 그룹명 (예: "핵심 업무 시스템", "협업 도구"). 생략 시 미분류 목록에 표시 */
  group?: string
}

export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed'

export interface MaintenanceRecord {
  id: string
  /** "2026-08-10 00:00 ~ 02:00" 등 표시용 점검 기간 */
  window: string
  title: string
  status: MaintenanceStatus
  description?: string
  /** 점검 대상 시스템명 (예: ["ERP", "OMS"]) */
  affected?: string[]
}

export interface IncidentUpdate {
  /** "14:32" 등 표시용 시각 */
  time: string
  message: string
}

export interface IncidentRecord {
  id: string
  /** "2026-08-04" 등 표시용 날짜 */
  date: string
  title: string
  status: 'investigating' | 'monitoring' | 'resolved'
  updates: IncidentUpdate[]
}

export interface SystemStatusBoardProps {
  title: string
  /** "2026-08-05 09:00 기준" 등 마지막 갱신 시각 */
  lastUpdated?: string
  overall: {
    status: SystemHealthStatus
    message: string
  }
  systems: SystemStatusItem[]
  incidents?: IncidentRecord[]
  /** 예정/진행중/완료된 점검 목록 (장애 이력과 별도 섹션으로 표시) */
  maintenances?: MaintenanceRecord[]
  actions?: ReactNode
  className?: string
}

const HEALTH_CONFIG: Record<SystemHealthStatus, { dot: string; text: string; label: string }> = {
  operational: { dot: 'bg-success', text: 'text-success', label: '정상' },
  degraded:    { dot: 'bg-warning', text: 'text-warning', label: '지연' },
  outage:      { dot: 'bg-danger',  text: 'text-danger',  label: '장애' },
  maintenance: { dot: 'bg-muted',   text: 'text-muted',   label: '점검중' },
}

const OVERALL_BANNER: Record<SystemHealthStatus, string> = {
  operational: 'bg-success/10 border-success text-success',
  degraded:    'bg-warning/10 border-warning text-warning',
  outage:      'bg-danger/10 border-danger text-danger',
  maintenance: 'bg-surface-subtle border-border text-muted',
}

const INCIDENT_STATUS_LABEL: Record<IncidentRecord['status'], string> = {
  investigating: '조사중',
  monitoring: '모니터링중',
  resolved: '해결됨',
}

const INCIDENT_STATUS_CLASS: Record<IncidentRecord['status'], string> = {
  investigating: 'text-danger border-danger/30 bg-danger/10',
  monitoring:    'text-warning border-warning/30 bg-warning/10',
  resolved:      'text-success border-success/30 bg-success/10',
}

const MAINTENANCE_STATUS_LABEL: Record<MaintenanceStatus, string> = {
  scheduled: '예정',
  'in-progress': '진행중',
  completed: '완료',
}

const MAINTENANCE_STATUS_CLASS: Record<MaintenanceStatus, string> = {
  scheduled: 'text-info border-info/30 bg-info/10',
  'in-progress': 'text-warning border-warning/30 bg-warning/10',
  completed: 'text-muted border-border bg-surface-subtle',
}

function groupSystems(systems: SystemStatusItem[]): Array<{ label: string | null; items: SystemStatusItem[] }> {
  const ungrouped = systems.filter(s => !s.group)
  const groupLabels = Array.from(new Set(systems.filter(s => s.group).map(s => s.group as string)))
  const groups = groupLabels.map(label => ({ label, items: systems.filter(s => s.group === label) }))
  return ungrouped.length > 0 ? [...groups, { label: null, items: ungrouped }] : groups
}

export function SystemStatusBoard({
  title,
  lastUpdated,
  overall,
  systems,
  incidents,
  maintenances,
  actions,
  className,
}: SystemStatusBoardProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {lastUpdated && <p className="text-sm text-muted mt-0.5">{lastUpdated}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 전체 상태 배너 */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-card border p-4 mb-6',
            OVERALL_BANNER[overall.status]
          )}
        >
          <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', HEALTH_CONFIG[overall.status].dot)} />
          <p className="text-sm font-semibold">{overall.message}</p>
        </div>

        {/* 시스템별 상태 (그룹 지정 시 그룹별로 묶어 표시) */}
        <div className="space-y-6 mb-6">
          {groupSystems(systems).map((group, gi) => (
            <div key={group.label ?? `ungrouped-${gi}`}>
              {group.label && (
                <h2 className="text-sm font-semibold text-foreground mb-2">{group.label}</h2>
              )}
              <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
                {group.items.map((system, i) => {
                  const cfg = HEALTH_CONFIG[system.status]
                  return (
                    <div
                      key={system.id}
                      className={cn(
                        'px-5 py-4',
                        i < group.items.length - 1 && 'border-b border-border'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{system.name}</p>
                          {system.description && (
                            <p className="text-xs text-muted mt-0.5">{system.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {system.uptime && (
                            <span className="text-xs text-muted">{system.uptime}</span>
                          )}
                          <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', cfg.text)}>
                            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                      {system.history && system.history.length > 0 && (
                        <UptimeHistoryStrip days={system.history} className="mt-3" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 예정된 점검 */}
        {maintenances && maintenances.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">예정된 점검</h2>
            <div className="space-y-3">
              {maintenances.map(maintenance => (
                <div key={maintenance.id} className="bg-surface border border-border rounded-card shadow-card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground">{maintenance.title}</p>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full border',
                        MAINTENANCE_STATUS_CLASS[maintenance.status]
                      )}
                    >
                      {MAINTENANCE_STATUS_LABEL[maintenance.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-2">{maintenance.window}</p>
                  {maintenance.affected && maintenance.affected.length > 0 && (
                    <p className="text-xs text-muted mb-2">대상: {maintenance.affected.join(', ')}</p>
                  )}
                  {maintenance.description && (
                    <p className="text-xs text-foreground">{maintenance.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 장애/공지 이력 */}
        {incidents && incidents.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">장애 및 공지 이력</h2>
            <div className="space-y-3">
              {incidents.map(incident => (
                <div key={incident.id} className="bg-surface border border-border rounded-card shadow-card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground">{incident.title}</p>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full border',
                        INCIDENT_STATUS_CLASS[incident.status]
                      )}
                    >
                      {INCIDENT_STATUS_LABEL[incident.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-3">{incident.date}</p>
                  <div className="space-y-2">
                    {incident.updates.map((update, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <span className="text-muted flex-shrink-0">{update.time}</span>
                        <span className="text-foreground">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
