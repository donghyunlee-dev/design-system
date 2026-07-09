import { cn } from '../../utils/cn'

export type StatusVariant = 'active' | 'inactive' | 'pending' | 'warning' | 'error' | 'success'

/**
 * 상태를 컬러 점(dot)과 레이블로 표시하는 컴포넌트.
 * Badge와 달리 "상태"의 의미에 특화되어 있으며, 컬러 점으로 시각적 상태를 전달합니다.
 */
export interface StatusBadgeProps {
  /** 상태 종류 — 색상과 기본 레이블을 결정 */
  status: StatusVariant
  /** 표시 텍스트 (생략 시 status 기본 레이블 사용) */
  label?: string
  className?: string
}

const STATUS_CONFIG: Record<StatusVariant, { dotClass: string; defaultLabel: string }> = {
  active:   { dotClass: 'bg-success',  defaultLabel: '활성' },
  inactive: { dotClass: 'bg-muted',    defaultLabel: '비활성' },
  pending:  { dotClass: 'bg-warning',  defaultLabel: '대기중' },
  warning:  { dotClass: 'bg-warning',  defaultLabel: '경고' },
  error:    { dotClass: 'bg-danger',   defaultLabel: '오류' },
  success:  { dotClass: 'bg-success',  defaultLabel: '완료' },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { dotClass, defaultLabel } = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-foreground', className)}>
      <span className={cn('w-2 h-2 rounded-full shrink-0', dotClass)} aria-hidden="true" />
      {label ?? defaultLabel}
    </span>
  )
}
