import { cn } from '../../utils/cn'
import { HTMLAttributes } from 'react'

export type ColorTagVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

/**
 * 부서/영역 등을 색상으로 구분해야 하는 태그.
 * (design-system-gap 대응: Tag에는 variant/색상 prop이 없어 항상 중립 회색으로만 렌더링됨.
 * Tag 파일은 수정하지 않고 별도 컴포넌트로 분리 — 기존 semantic 색상 토큰만 alpha 조합으로 재사용.)
 */
export interface ColorTagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 색상 변형 — 부서/영역 구분용. 기본값: neutral (기존 Tag와 동일한 톤) */
  variant?: ColorTagVariant
  /** 태그 삭제 콜백 — 제공 시 × 버튼 렌더링 */
  onRemove?: () => void
  /** 삭제 버튼의 접근성 레이블 (스크린리더용). 기본값: "삭제" */
  removeLabel?: string
}

const VARIANT_CLASSES: Record<ColorTagVariant, string> = {
  neutral: 'bg-surface-overlay border-border text-secondary',
  brand:   'bg-brand-subtle border-brand/30 text-brand',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  danger:  'bg-danger/10 border-danger/30 text-danger',
  info:    'bg-info/10 border-info/30 text-info',
}

export function ColorTag({ variant = 'neutral', onRemove, removeLabel = '삭제', className, children, ...props }: ColorTagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-badge', VARIANT_CLASSES[variant], className)} {...props}>
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={removeLabel} className="ml-0.5 opacity-70 hover:opacity-100 leading-none">×</button>
      )}
    </span>
  )
}
