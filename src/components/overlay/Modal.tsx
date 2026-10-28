import { cn } from '../../utils/cn'
import { Icon } from '../foundation/Icon'
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
  /** 제목 앞에 표시할 아이콘 또는 배지 */
  titleIcon?: ReactNode
  /** 제목 아래 구분선을 표시할지 여부 */
  showHeaderDivider?: boolean
  /** 액션 영역 구분선을 좌우 여백 안쪽에 표시할지 여부 */
  insetFooterDivider?: boolean
  /** 제목이 없을 때 dialog의 접근 가능한 이름 */
  label?: string
  /** 본문 설명 요소의 id. 전달하면 dialog의 aria-describedby로 연결됩니다. */
  descriptionId?: string
  children: ReactNode
  /** 하단 액션 버튼 영역 */
  footer?: ReactNode
  /** 모달 너비 */
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, titleIcon, showHeaderDivider = true, insetFooterDivider = false, label = '확인', descriptionId, children, footer, size = 'md' }: ModalProps) {
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
        aria-label={title ? undefined : label}
        aria-describedby={descriptionId}
        className={cn('relative bg-surface rounded-card shadow-lg w-full', sizeMap[size])}
      >
        {title && (
          <div className={cn('flex items-center justify-between px-6 py-4', showHeaderDivider && 'border-b border-border')}>
            <div className="flex min-w-0 items-center gap-3">
              {titleIcon}
              <h2 id={titleId} className="text-base font-semibold text-foreground">{title}</h2>
            </div>
            <button onClick={onClose} aria-label="닫기" className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:bg-surface-subtle focus-visible:text-foreground">
              <Icon name="close" size="sm" />
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (insetFooterDivider ? (
          <div className="px-6 pb-4">
            <div className="flex justify-end gap-2 border-t border-border pt-4">{footer}</div>
          </div>
        ) : (
          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>
        ))}
      </div>
    </div>
  )
}
