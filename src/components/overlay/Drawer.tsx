import { cn } from '../../utils/cn'
import { ReactNode } from 'react'

/**
 * 화면 측면에서 슬라이드되어 나타나는 드로어 컴포넌트.
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
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={cn(
        'fixed top-0 bottom-0 z-50 bg-surface shadow-lg transition-transform duration-300 flex flex-col',
        width,
        side === 'right' ? 'right-0' : 'left-0',
        open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
      )}>
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} className="text-muted hover:text-foreground">✕</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}
