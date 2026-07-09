import { useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Button } from '../../components/foundation/Button'
import { Textarea } from '../../components/form/Textarea'
import { cn } from '../../utils/cn'
import { DetailField } from './types'

export type ApprovalStatus = 'draft' | 'inProgress' | 'approved' | 'rejected'

export interface ApprovalStep {
  label: string
  status: 'done' | 'current' | 'pending' | 'rejected'
  approver?: string
  date?: string
}

export interface ApprovalViewProps {
  title: string
  status: ApprovalStatus
  breadcrumb?: BreadcrumbItem[]
  fields: DetailField[]
  steps: ApprovalStep[]
  /** 현재 사용자가 결재자인 경우 true — 결재 의견 폼 표시 */
  canApprove?: boolean
  onApprove?: (comment: string) => void
  onReject?: (comment: string) => void
  onCancel?: () => void
  className?: string
}

const STATUS_BADGE: Record<ApprovalStatus, { text: string; cls: string }> = {
  draft:      { text: '기안',   cls: 'bg-surface-subtle text-muted border border-border' },
  inProgress: { text: '결재중', cls: 'bg-brand-subtle text-brand border border-brand' },
  approved:   { text: '승인완료', cls: 'bg-green-50 text-success border border-success' },
  rejected:   { text: '반려',   cls: 'bg-red-50 text-danger border border-danger' },
}

const STEP_DOT: Record<ApprovalStep['status'], string> = {
  done:     'bg-success border-success',
  current:  'bg-brand border-brand',
  pending:  'bg-surface border-border',
  rejected: 'bg-danger border-danger',
}

const STEP_LINE: Record<ApprovalStep['status'], string> = {
  done:     'bg-success',
  current:  'bg-border',
  pending:  'bg-border',
  rejected: 'bg-danger',
}

export function ApprovalView({
  title,
  status,
  breadcrumb,
  fields,
  steps,
  canApprove,
  onApprove,
  onReject,
  onCancel,
  className,
}: ApprovalViewProps) {
  const [comment, setComment] = useState('')
  const badge = STATUS_BADGE[status]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-badge', badge.cls)}>
              {badge.text}
            </span>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>회수</Button>
          )}
        </div>

        {/* 결재선 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-5 mb-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">결재선</h3>
          <div className="flex items-start">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div className={cn('flex-1 h-0.5', STEP_LINE[steps[i - 1].status])} />
                    )}
                    <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0', STEP_DOT[s.status])} />
                    {i < steps.length - 1 && (
                      <div className={cn('flex-1 h-0.5', STEP_LINE[s.status])} />
                    )}
                  </div>
                  <div className="text-center mt-2 px-1">
                    <p className="text-xs font-medium text-foreground">{s.label}</p>
                    {s.approver && <p className="text-xs text-muted">{s.approver}</p>}
                    {s.date && <p className="text-xs text-muted">{s.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 문서 내용 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">결재 내용</h3>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            {fields.map((f, i) => (
              <div key={i} className={f.span === 2 ? 'col-span-2' : ''}>
                <dt className="text-xs font-medium text-muted mb-1">{f.label}</dt>
                <dd className="text-sm text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 결재 의견 (결재자만) */}
        {canApprove && (
          <div className="bg-surface border border-border rounded-card shadow-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">결재 의견</h3>
            <Textarea
              placeholder="의견을 입력하세요 (선택)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="danger" onClick={() => onReject?.(comment)}>반려</Button>
              <Button variant="primary" onClick={() => onApprove?.(comment)}>승인</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
