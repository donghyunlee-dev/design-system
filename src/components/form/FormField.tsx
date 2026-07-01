import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

/**
 * 레이블, 힌트, 오류 메시지를 포함한 폼 필드 래퍼 컴포넌트.
 * children으로 Input, Select 등을 감쌉니다.
 */
export interface FormFieldProps {
  /** 필드 레이블 텍스트 */
  label?: string
  /** 오류 메시지 — 입력 아래에 danger 색상으로 표시 */
  error?: string
  /** 보조 안내 텍스트 */
  hint?: string
  /** 필수 항목 여부 — 레이블 옆 * 표시 */
  required?: boolean
  /** 폼 필드 내부에 렌더링할 입력 컴포넌트 */
  children: ReactNode
  /** 최상위 래퍼 요소에 적용할 추가 CSS 클래스 */
  className?: string
}

export function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
