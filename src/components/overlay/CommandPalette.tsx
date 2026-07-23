import { cn } from '../../utils/cn'
import { ReactNode, useEffect, useMemo, useState } from 'react'

/**
 * 커맨드 팔레트의 개별 항목.
 */
export interface CommandItem {
  /** 항목 고유 ID */
  id: string
  /** 항목 표시 텍스트 */
  label: string
  /** 보조 설명 */
  description?: string
  /** 항목 앞에 표시할 아이콘 */
  icon?: ReactNode
  /** 우측에 표시할 단축키 표기 (예: "G I") */
  shortcut?: string
  /** 항목 선택 콜백 */
  onSelect: () => void
}

/**
 * 커맨드 팔레트 항목 그룹.
 */
export interface CommandGroup {
  /** 그룹 고유 키 */
  key: string
  /** 그룹 표시 레이블 (예: "빠른 이동") */
  label: string
  items: CommandItem[]
}

/**
 * 검색어와 일치하는 항목만 남기고, 빈 그룹은 제거합니다.
 */
function filterGroups(groups: CommandGroup[], query: string): CommandGroup[] {
  const q = query.trim().toLowerCase()
  if (!q) return groups
  return groups
    .map(group => ({
      ...group,
      items: group.items.filter(
        item =>
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      ),
    }))
    .filter(group => group.items.length > 0)
}

/**
 * Cmd/Ctrl+K 스타일 즉시검색·명령 실행 오버레이 컴포넌트.
 * Escape 키 및 배경 클릭으로 닫을 수 있으며, 방향키·Enter로 항목을 탐색·선택할 수 있습니다.
 */
export interface CommandPaletteProps {
  /** 팔레트 표시 여부 */
  open: boolean
  /** 닫기 콜백 (배경 클릭, Escape 키, 항목 선택 포함) */
  onClose: () => void
  /** 검색 입력 placeholder */
  placeholder?: string
  /** 검색 대상 그룹 목록 */
  groups: CommandGroup[]
  /** 검색어가 변경될 때 호출 (서버 검색 등 외부 제어용) */
  onQueryChange?: (query: string) => void
  /** 결과가 없을 때 표시할 메시지 */
  emptyMessage?: string
}

export function CommandPalette({
  open,
  onClose,
  placeholder = '검색 또는 명령 입력...',
  groups,
  onQueryChange,
  emptyMessage = '일치하는 결과가 없습니다',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = useMemo(() => filterGroups(groups, query), [groups, query])
  const flatItems = useMemo(() => filtered.flatMap(g => g.items), [filtered])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const item = flatItems[activeIndex]
        if (item) {
          item.onSelect()
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, flatItems, activeIndex])

  if (!open) return null

  let renderedIndex = -1

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface rounded-card shadow-lg w-full max-w-xl overflow-hidden">
        <div className="border-b border-border px-4">
          <input
            autoFocus
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              onQueryChange?.(e.target.value)
            }}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-placeholder focus:outline-none"
          />
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">{emptyMessage}</p>
          ) : (
            filtered.map(group => (
              <div key={group.key} className="mb-2 last:mb-0">
                <p className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
                  {group.label}
                </p>
                {group.items.map(item => {
                  renderedIndex += 1
                  const active = renderedIndex === activeIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(renderedIndex)}
                      onClick={() => {
                        item.onSelect()
                        onClose()
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 px-4 py-2 text-left text-sm',
                        active ? 'bg-brand-subtle text-brand' : 'text-foreground hover:bg-surface-raised'
                      )}
                    >
                      {item.icon}
                      <span className="flex-1 min-w-0 truncate">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-muted truncate">{item.description}</span>
                      )}
                      {item.shortcut && (
                        <kbd className="text-xs text-muted border border-border rounded px-1.5 py-0.5">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
