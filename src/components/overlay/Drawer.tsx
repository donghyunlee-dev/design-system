import { cn } from '../../utils/cn'
import { ReactNode, useEffect, useId, useRef } from 'react'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'

/**
 * 화면 측면에서 슬라이드되어 나타나는 드로어 컴포넌트.
 * 참고: 닫힌 상태에서도 패널이 DOM에 남아있어(전환 애니메이션 때문에), aria-hidden으로 스크린리더에서는 숨겨지지만
 * 키보드 Tab으로는 여전히 도달할 수 있습니다. 완전한 차단이 필요하면 상위에서 별도 처리가 필요합니다.
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
  children: ReactNode
  /** 드로어 너비 (Tailwind 클래스, 예: "w-80") */
  width?: string
}

export function Drawer({ open, onClose, side = 'right', title, children, width = 'w-80' }: DrawerProps) {
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
        aria-hidden={!open}
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
            <button onClick={onClose} aria-label="닫기" className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}
