import { ReactNode } from 'react'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export type CompareChangeType = 'added' | 'removed' | 'modified' | 'unchanged'

export interface CompareField {
  key: string
  label: string
  /** 비교 이전(좌측) 값 */
  before: ReactNode
  /** 비교 이후(우측) 값 */
  after: ReactNode
  changeType: CompareChangeType
}

export interface VersionCompareProps {
  title?: string
  /** 좌측 버전 레이블 (예: "v1.2 (2026-07-01)") */
  beforeLabel: string
  /** 우측 버전 레이블 (예: "v1.3 (2026-07-15)") */
  afterLabel: string
  fields: CompareField[]
  actions?: ReactNode
  className?: string
}

const CHANGE_CONFIG: Record<CompareChangeType, { label: string; rowCls: string; badgeCls: string }> = {
  added:     { label: '추가', rowCls: 'bg-green-50', badgeCls: 'bg-success text-white' },
  removed:   { label: '삭제', rowCls: 'bg-red-50', badgeCls: 'bg-danger text-white' },
  modified:  { label: '변경', rowCls: 'bg-brand-subtle', badgeCls: 'bg-brand text-white' },
  unchanged: { label: '동일', rowCls: '', badgeCls: 'bg-surface-subtle text-muted' },
}

export function VersionCompare({
  title = '버전 비교',
  beforeLabel,
  afterLabel,
  fields,
  actions,
  className,
}: VersionCompareProps) {
  const changedCount = fields.filter(f => f.changeType !== 'unchanged').length

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted mt-1">
              변경 <span className="font-semibold text-foreground">{changedCount}</span>건
            </p>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
          <div className="grid grid-cols-2 border-b border-border">
            <div className="px-5 py-3 border-r border-border">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">이전</p>
              <p className="text-sm font-medium text-foreground">{beforeLabel}</p>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">이후</p>
              <p className="text-sm font-medium text-foreground">{afterLabel}</p>
            </div>
          </div>

          <Stack gap={1} className="p-2">
            {fields.map((f, i) => {
              const cfg = CHANGE_CONFIG[f.changeType]
              return (
                <div key={f.key}>
                  <div className={cn('rounded-md px-3 py-2.5', cfg.rowCls)}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-muted">{f.label}</p>
                      <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-badge', cfg.badgeCls)}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={cn('text-sm', f.changeType === 'removed' ? 'text-danger line-through' : 'text-foreground')}>
                        {f.before}
                      </div>
                      <div className={cn('text-sm', f.changeType === 'added' ? 'text-success font-medium' : 'text-foreground')}>
                        {f.after}
                      </div>
                    </div>
                  </div>
                  {i < fields.length - 1 && <Divider className="my-1" />}
                </div>
              )
            })}
          </Stack>
        </div>
      </div>
    </div>
  )
}
