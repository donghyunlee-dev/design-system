import { cn } from '../../utils/cn'

/**
 * 토글 스위치 컴포넌트. controlled 방식으로 동작합니다.
 */
export interface SwitchProps {
  /** 현재 활성화 여부 */
  checked: boolean
  /** 상태 변경 콜백 */
  onChange: (checked: boolean) => void
  /** 스크린 리더용 접근성 레이블 텍스트 (화면에 미표시) */
  label?: string
  /** 비활성화 여부 */
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand',
        checked ? 'bg-brand' : 'bg-border',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <span className={cn(
        'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-4' : 'translate-x-1'
      )} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}
