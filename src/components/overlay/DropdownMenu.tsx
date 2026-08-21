import { cn } from '../../utils/cn'
import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  cloneElement,
  isValidElement,
  MouseEvent as ReactMouseEvent,
} from 'react'

/**
 * 드롭다운 메뉴의 개별 항목 정의.
 */
export interface DropdownItem {
  /** 메뉴 항목 표시 텍스트 */
  label: string
  /** 항목 클릭 콜백 */
  onClick: () => void
  /** 항목 앞에 표시할 아이콘 */
  icon?: ReactNode
  /** 삭제 등 위험 액션 여부 — danger 색상 적용 */
  danger?: boolean
  /** 이 항목 앞에 구분선 추가 여부 */
  divider?: boolean
}

/**
 * 트리거 클릭 시 메뉴 항목 목록을 표시하는 드롭다운 컴포넌트.
 * trigger는 버튼 등 클릭 가능한 단일 엘리먼트여야 합니다 — 내부적으로 aria 속성과 클릭 핸들러를 주입합니다.
 */
export interface DropdownMenuProps {
  /** 드롭다운을 여는 트리거 요소 (버튼 등 클릭 가능한 단일 엘리먼트) */
  trigger: ReactNode
  /** 메뉴 항목 목록 */
  items: DropdownItem[]
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerNodeRef = useRef<HTMLElement | null>(null)

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
        'aria-haspopup': 'menu',
        'aria-expanded': open,
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
        <div role="menu" className="absolute top-full right-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg py-1 min-w-[160px]">
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="border-t border-border my-1" />}
              <button
                type="button"
                role="menuitem"
                className={cn('w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-surface-raised', item.danger && 'text-danger')}
                onClick={() => { item.onClick(); setOpen(false) }}
              >
                {item.icon}{item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
