import { ReactNode, useState, useRef, useEffect } from 'react'

/**
 * 요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트.
 */
export interface PopoverProps {
  /** 팝오버를 여는 트리거 요소 */
  trigger: ReactNode
  children: ReactNode
}

export function Popover({ trigger, children }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen(v => !v)}>{trigger}</span>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg p-3 min-w-[160px]">
          {children}
        </div>
      )}
    </div>
  )
}
