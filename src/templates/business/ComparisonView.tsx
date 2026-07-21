import { ReactNode } from 'react'
import { Card } from '../../components/data/Card'
import { Tag } from '../../components/data/Tag'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { cn } from '../../utils/cn'

/** 비교 대상 하나의 헤더 정보 */
export interface ComparisonSide {
  label: string
  meta?: string
}

/** 좌우 비교 필드 한 행 */
export interface ComparisonField {
  label: string
  left: ReactNode
  right: ReactNode
  /** true면 좌/우 값이 다름을 강조 표시 */
  changed?: boolean
}

export interface ComparisonViewProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  left: ComparisonSide
  right: ComparisonSide
  fields: ComparisonField[]
  actions?: ReactNode
  className?: string
}

export function ComparisonView({
  title,
  breadcrumb,
  left,
  right,
  fields,
  actions,
  className,
}: ComparisonViewProps) {
  const changedCount = fields.filter(f => f.changed).length

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {changedCount > 0 && (
              <p className="text-sm text-muted mt-1">변경된 항목 {changedCount}건</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <p className="text-sm font-semibold text-foreground">{left.label}</p>
            {left.meta && <p className="text-xs text-muted mt-0.5">{left.meta}</p>}
          </Card>
          <Card>
            <p className="text-sm font-semibold text-foreground">{right.label}</p>
            {right.meta && <p className="text-xs text-muted mt-0.5">{right.meta}</p>}
          </Card>
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card p-6">
          <Stack gap={4}>
            {fields.map((field, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide">{field.label}</p>
                  {field.changed && <Tag>변경됨</Tag>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn('text-sm text-foreground rounded-md px-3 py-2', field.changed && 'bg-danger/10')}>
                    {field.left}
                  </div>
                  <div className={cn('text-sm text-foreground rounded-md px-3 py-2', field.changed && 'bg-success/10')}>
                    {field.right}
                  </div>
                </div>
                {i < fields.length - 1 && <Divider className="mt-4 mb-0" />}
              </div>
            ))}
          </Stack>
        </div>
      </div>
    </div>
  )
}
