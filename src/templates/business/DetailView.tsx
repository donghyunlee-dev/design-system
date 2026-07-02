import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Tabs, TabItem } from '../../components/navigation/Tabs'
import { cn } from '../../utils/cn'
import { DetailField } from './types'

export interface HistoryItem {
  timestamp: string
  label: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export interface DetailViewProps {
  title: string
  status?: ReactNode
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  fields: DetailField[]
  history?: HistoryItem[]
  tabs?: TabItem[]
  className?: string
}

const DOT_COLOR: Record<string, string> = {
  default: 'bg-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

export function DetailView({
  title,
  status,
  breadcrumb,
  actions,
  fields,
  history,
  tabs,
  className,
}: DetailViewProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {status}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 정보 + 이력 영역 */}
        <div className={cn('grid gap-4 mb-4', history ? 'grid-cols-3' : 'grid-cols-1')}>
          {/* 좌측: 기본 정보 */}
          <div className={cn('bg-surface border border-border rounded-card shadow-card p-6', history ? 'col-span-2' : '')}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
              {fields.map((f, i) => (
                <div key={i} className={f.span === 2 ? 'col-span-2' : ''}>
                  <dt className="text-xs font-medium text-muted mb-1">{f.label}</dt>
                  <dd className="text-sm text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 우측: 처리 이력 */}
          {history && (
            <div className="bg-surface border border-border rounded-card shadow-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">처리 이력</h3>
              <div className="space-y-0">
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', DOT_COLOR[h.variant ?? 'default'])} />
                      {i < history.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1 mb-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs text-muted">{h.timestamp}</p>
                      <p className="text-sm font-medium text-foreground">{h.label}</p>
                      {h.description && (
                        <p className="text-xs text-muted mt-0.5">{h.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 탭 */}
        {tabs && tabs.length > 0 && (
          <div className="bg-surface border border-border rounded-card shadow-card p-4">
            <Tabs items={tabs} />
          </div>
        )}
      </div>
    </div>
  )
}
