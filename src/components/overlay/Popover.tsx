import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useId,
  cloneElement,
  isValidElement,
  MouseEvent as ReactMouseEvent,
} from 'react'

/**
 * 요소 클릭 시 추가 콘텐츠를 표시하는 팝오버 컴포넌트.
 * trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다.
 */
export interface PopoverProps {
  /** 팝오버를 여는 트리거 요소 (버튼 등 클릭 가능한 단일 엘리먼트) */
  trigger: ReactNode
  children: ReactNode
  /** 열린 콘텐츠의 접근 가능한 이름 */
  label?: string
}

export function Popover({ trigger, children, label = '추가 정보' }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerNodeRef = useRef<HTMLElement | null>(null)
  const contentId = useId()

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerNodeRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const triggerProps = isValidElement(trigger) ? (trigger.props as Record<string, unknown>) : undefined

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? contentId : undefined,
        ref: (el: HTMLElement | null) => {
          triggerNodeRef.current = el
        },
        onClick: (e: ReactMouseEvent) => {
          ;(triggerProps?.onClick as ((e: ReactMouseEvent) => void) | undefined)?.(e)
          setOpen(v => !v)
        },
      })
    : trigger

  return (
    <div ref={containerRef} className="relative inline-flex">
      {triggerElement}
      {open && (
        <div id={contentId} role="dialog" aria-label={label} className="absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded-card border border-border bg-surface p-ws-3 text-body text-foreground shadow-lg">
          {children}
        </div>
      )}
    </div>
  )
}
