import { cn } from '../../utils/cn'
import { Icon } from '../foundation/Icon'
import { ReactNode, useEffect, useId, useRef } from 'react'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'

/**
 * 화면 측면에서 슬라이드되어 나타나는 드로어 컴포넌트.
 * 닫힌 상태에서도 전환 애니메이션을 위해 패널을 유지하고 inert로 상호작용을 막습니다.
 */
export interface DrawerProps {
  /** 드로어 표시 여부 */
  open: boolean
  /** 닫기 콜백 */
  onClose: () => void
  /** 드로어가 열리는 방향 */
  side?: 'left' | 'right'
  /** 드로어 제목 */
  title?: string
  /** 제목이 없을 때 dialog의 접근 가능한 이름 */
  label?: string
  children: ReactNode
  /** 드로어 너비 (Tailwind 클래스, 예: "w-80") */
  width?: string
}

export function Drawer({ open, onClose, side = 'right', title, label = '패널', children, width = 'w-80' }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useFocusTrap(panelRef, open)
  useBodyScrollLock(open)

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : label}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'fixed top-0 bottom-0 z-50 bg-surface shadow-lg transition-transform duration-300 flex flex-col',
          width,
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 id={titleId} className="font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} aria-label="닫기" className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <Icon name="close" size="sm" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}
