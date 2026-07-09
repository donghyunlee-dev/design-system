import { cn } from '../../utils/cn'
import { ReactNode, useState, Children, cloneElement, isValidElement, FocusEvent, ChangeEvent } from 'react'
import { FieldRules } from '../../types/validation'

/**
 * 레이블, 힌트, 오류 메시지를 포함한 폼 필드 래퍼 컴포넌트.
 * children으로 Input, Select 등을 감쌉니다.
 * rules prop으로 기본 유효성 검사를 내장할 수 있습니다.
 */
export interface FormFieldProps {
  /** 필드 레이블 텍스트 */
  label?: string
  /** 외부에서 직접 주입하는 오류 메시지 (내부 검사 결과를 덮어씀) */
  error?: string
  /** 보조 안내 텍스트 */
  hint?: string
  /** 필수 항목 여부 — 레이블 옆 * 표시 (rules.required와 독립적) */
  required?: boolean
  /** 유효성 검사 규칙 — blur 시 자동 평가 */
  rules?: FieldRules
  /** 폼 필드 내부에 렌더링할 입력 컴포넌트 */
  children: ReactNode
  /** 최상위 래퍼 요소에 적용할 추가 CSS 클래스 */
  className?: string
}

function runRules(value: string, rules: FieldRules): string {
  const v = value ?? ''

  if (rules.required) {
    if (v === null || v === undefined || v === '') {
      return typeof rules.required === 'string' ? rules.required : '필수 입력 항목입니다'
    }
  }
  if (rules.notBlank) {
    if (v.trim() === '') {
      return typeof rules.notBlank === 'string' ? rules.notBlank : '공백만 입력할 수 없습니다'
    }
  }
  if (rules.minLength && v.length < rules.minLength.value) return rules.minLength.message
  if (rules.maxLength && v.length > rules.maxLength.value) return rules.maxLength.message
  if (rules.min !== undefined && Number(v) < rules.min.value) return rules.min.message
  if (rules.max !== undefined && Number(v) > rules.max.value) return rules.max.message
  if (rules.greaterThan !== undefined && Number(v) <= rules.greaterThan.value) return rules.greaterThan.message
  if (rules.lessThan !== undefined && Number(v) >= rules.lessThan.value) return rules.lessThan.message
  if (rules.equals !== undefined && v !== String(rules.equals.value)) return rules.equals.message
  if (rules.notEquals !== undefined && v === String(rules.notEquals.value)) return rules.notEquals.message
  if (rules.pattern && !rules.pattern.value.test(v)) return rules.pattern.message
  if (rules.validate) return rules.validate(v) ?? ''
  return ''
}

export function FormField({ label, error: externalError, hint, required, rules, children, className }: FormFieldProps) {
  const [internalError, setInternalError] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const error = externalError ?? internalError
  const showRequired = required || !!rules?.required

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!rules) return
    setIsDirty(true)
    setInternalError(runRules(e.target.value, rules))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!rules || !isDirty) return
    setInternalError(runRules(e.target.value, rules))
  }

  const childrenWithValidation = rules
    ? Children.map(children, child => {
        if (!isValidElement(child)) return child
        const childProps = child.props as Record<string, unknown>
        return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          onBlur: (e: FocusEvent<HTMLInputElement>) => {
            handleBlur(e)
            ;(childProps.onBlur as ((e: FocusEvent) => void) | undefined)?.(e)
          },
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            handleChange(e)
            ;(childProps.onChange as ((e: ChangeEvent) => void) | undefined)?.(e)
          },
          error: !!error,
        })
      })
    : children

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {showRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {childrenWithValidation}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
