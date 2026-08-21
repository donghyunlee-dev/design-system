import { cn } from '../../utils/cn'
import { ReactNode, useEffect, useId, useRef } from 'react'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'

/**
 * 화면 중앙에 표시되는 다이얼로그 모달 컴포넌트.
 * Escape 키 및 배경 클릭으로 닫을 수 있습니다.
 */
export interface ModalProps {
  /** 모달 표시 여부 */
  open: boolean
  /** 닫기 콜백 (배경 클릭, Escape 키 포함) */
  onClose: () => void
  /** 모달 상단 제목 */
  title?: string
  children: ReactNode
  /** 하단 액션 버튼 영역 */
  footer?: ReactNode
  /** 모달 너비 */
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useFocusTrap(panelRef, open)
  useBodyScrollLock(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn('relative bg-surface rounded-card shadow-lg w-full', sizeMap[size])}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 id={titleId} className="text-base font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} aria-label="닫기" className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
