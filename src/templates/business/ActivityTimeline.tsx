import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Avatar } from '../../components/foundation/Avatar'
import { Divider } from '../../components/layout/Divider'
import { cn } from '../../utils/cn'

export interface ActivityEvent {
  id: string
  /** "2026-07-11 09:32" 등 표시용 시각 */
  time: string
  actor: { name: string; initials?: string }
  /** "발주를 승인했습니다" 등 행위 설명 */
  action: string
  detail?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export interface ActivityGroup {
  /** "2026-07-11" 등 날짜 구분 레이블 */
  date: string
  events: ActivityEvent[]
}

export interface ActivityTimelineProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  groups: ActivityGroup[]
  filters?: ReactNode
  actions?: ReactNode
  className?: string
}

const DOT_COLOR: Record<NonNullable<ActivityEvent['variant']>, string> = {
  default: 'bg-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

export function ActivityTimeline({
  title,
  breadcrumb,
  groups,
  filters,
  actions,
  className,
}: ActivityTimelineProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-3xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {filters && (
          <div className="flex gap-2 mb-4">{filters}</div>
        )}

        <div className="bg-surface border border-border rounded-card shadow-card p-6">
          {groups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-6' : ''}>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                {group.date}
              </p>
              <div>
                {group.events.map((ev, i) => (
                  <div key={ev.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', DOT_COLOR[ev.variant ?? 'default'])} />
                      {i < group.events.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1 mb-1" />
                      )}
                    </div>
                    <div className="pb-5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" initials={ev.actor.initials} alt={ev.actor.name} />
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{ev.actor.name}</span>
                          {' '}{ev.action}
                        </p>
                      </div>
                      <p className="text-xs text-muted mt-1 ml-8">{ev.time}</p>
                      {ev.detail && (
                        <p className="text-xs text-muted mt-1 ml-8">{ev.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {gi < groups.length - 1 && <Divider className="mt-2" />}
            </div>
          ))}
          {groups.length === 0 && (
            <p className="text-sm text-muted text-center py-8">활동 이력이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
