import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { StatusBadge, StatusVariant } from '../../components/foundation/StatusBadge'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Grid } from '../../components/layout/Grid'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export type DiffChangeType = 'added' | 'removed' | 'modified' | 'unchanged'

export interface DiffField {
  label: string
  before: ReactNode
  after: ReactNode
  changeType?: DiffChangeType
}

export interface ComparisonDiffViewProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  /** 좌측 대상 레이블 (예: "버전 1 (2026-06-01)") */
  leftLabel: string
  /** 우측 대상 레이블 (예: "버전 2 (2026-07-10)") */
  rightLabel: string
  leftStatus?: StatusVariant
  rightStatus?: StatusVariant
  fields: DiffField[]
  actions?: ReactNode
  className?: string
}

const CHANGE_CONFIG: Record<DiffChangeType, { rowClass: string; tagLabel: string | null }> = {
  added: { rowClass: 'bg-success/10', tagLabel: '추가' },
  removed: { rowClass: 'bg-danger/10', tagLabel: '삭제' },
  modified: { rowClass: 'bg-warning/10', tagLabel: '수정' },
  unchanged: { rowClass: '', tagLabel: null },
}

export function ComparisonDiffView({
  title,
  breadcrumb,
  leftLabel,
  rightLabel,
  leftStatus,
  rightStatus,
  fields,
  actions,
  className,
}: ComparisonDiffViewProps) {
  const changedCount = fields.filter(f => f.changeType && f.changeType !== 'unchanged').length

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <Card padding="lg">
          <Grid cols={2} gap={6} className="mb-4">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">비교 대상 A</p>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-foreground">{leftLabel}</p>
                {leftStatus && <StatusBadge status={leftStatus} />}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">비교 대상 B</p>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-foreground">{rightLabel}</p>
                {rightStatus && <StatusBadge status={rightStatus} />}
              </div>
            </div>
          </Grid>

          <Divider className="my-2" />

          <p className="text-sm text-muted mb-3">
            전체 <span className="font-semibold text-foreground">{fields.length}</span>개 항목 중{' '}
            <span className="font-semibold text-foreground">{changedCount}</span>건 변경됨
          </p>

          <Stack gap={2}>
            {fields.map((field, i) => {
              const config = CHANGE_CONFIG[field.changeType ?? 'unchanged']
              return (
                <div key={i} className={cn('rounded-card p-3', config.rowClass)}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{field.label}</p>
                    {config.tagLabel && <Tag>{config.tagLabel}</Tag>}
                  </div>
                  <Grid cols={2} gap={6}>
                    <div className="text-sm text-foreground">{field.before}</div>
                    <div className="text-sm text-foreground">{field.after}</div>
                  </Grid>
                </div>
              )
            })}
          </Stack>
        </Card>
      </div>
    </div>
  )
}
