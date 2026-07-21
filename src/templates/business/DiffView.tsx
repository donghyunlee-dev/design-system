import { ReactNode } from 'react'
import { Divider } from '../../components/layout/Divider'
import { Tag } from '../../components/data/Tag'
import { cn } from '../../utils/cn'

export type DiffFieldStatus = 'added' | 'removed' | 'changed' | 'unchanged'

/** 비교 대상 필드 한 줄 */
export interface DiffField {
  label: string
  before: ReactNode
  after: ReactNode
  /** 변경 유형. 미지정 시 before/after 문자열을 비교해 자동 판단 */
  status?: DiffFieldStatus
}

export interface DiffViewProps {
  title?: string
  beforeLabel?: string
  afterLabel?: string
  /** 좌측 버전에 대한 부가 정보 (예: "2026-06-01 등록") */
  beforeMeta?: string
  afterMeta?: string
  fields: DiffField[]
  actions?: ReactNode
  className?: string
}

const STATUS_LABEL: Record<DiffFieldStatus, string> = {
  added: '추가',
  removed: '삭제',
  changed: '수정',
  unchanged: '동일',
}

function resolveStatus(field: DiffField): DiffFieldStatus {
  if (field.status) return field.status
  if (typeof field.before !== 'string' || typeof field.after !== 'string') return 'unchanged'
  if (field.before === field.after) return 'unchanged'
  if (!field.before) return 'added'
  if (!field.after) return 'removed'
  return 'changed'
}

const CELL_CLASS: Record<DiffFieldStatus, { before: string; after: string }> = {
  added:     { before: 'bg-surface-subtle text-muted', after: 'bg-success/10 text-foreground' },
  removed:   { before: 'bg-danger/10 text-foreground line-through', after: 'bg-surface-subtle text-muted' },
  changed:   { before: 'bg-warning/10 text-foreground', after: 'bg-warning/10 text-foreground' },
  unchanged: { before: 'text-muted', after: 'text-muted' },
}

export function DiffView({
  title = '변경 비교',
  beforeLabel = '변경 전',
  afterLabel = '변경 후',
  beforeMeta,
  afterMeta,
  fields,
  actions,
  className,
}: DiffViewProps) {
  const changedCount = fields.filter(f => resolveStatus(f) !== 'unchanged').length

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted mt-1">전체 {fields.length}개 항목 중 {changedCount}개 변경</p>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
          {/* 헤더: 좌우 라벨 */}
          <div className="grid grid-cols-[160px_1fr_1fr] border-b border-border bg-surface-raised">
            <div className="px-4 py-3" />
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{beforeLabel}</p>
              {beforeMeta && <p className="text-xs text-muted mt-0.5">{beforeMeta}</p>}
            </div>
            <div className="px-4 py-3 border-l border-border">
              <p className="text-sm font-semibold text-foreground">{afterLabel}</p>
              {afterMeta && <p className="text-xs text-muted mt-0.5">{afterMeta}</p>}
            </div>
          </div>

          <div className="divide-y divide-border">
            {fields.map((field, i) => {
              const status = resolveStatus(field)
              return (
                <div key={i} className="grid grid-cols-[160px_1fr_1fr]">
                  <div className="px-4 py-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted">{field.label}</span>
                    {status !== 'unchanged' && (
                      <Tag className={cn(
                        status === 'added' && 'text-success border-success/30 bg-success/10',
                        status === 'removed' && 'text-danger border-danger/30 bg-danger/10',
                        status === 'changed' && 'text-warning border-warning/30 bg-warning/10',
                      )}>
                        {STATUS_LABEL[status]}
                      </Tag>
                    )}
                  </div>
                  <div className={cn('px-4 py-3 text-sm', CELL_CLASS[status].before)}>{field.before}</div>
                  <div className={cn('px-4 py-3 text-sm border-l border-border', CELL_CLASS[status].after)}>{field.after}</div>
                </div>
              )
            })}
          </div>
        </div>

        {fields.length === 0 && (
          <>
            <Divider />
            <p className="text-sm text-muted text-center">비교할 항목이 없습니다.</p>
          </>
        )}
      </div>
    </div>
  )
}
