import { cn } from '../../utils/cn'
import { useState, useRef, useEffect, useId, useMemo } from 'react'
import { Checkbox } from './Checkbox'

export interface MultiSelectOption {
  value: string
  label: string
}

/**
 * 검색 + 체크박스로 여러 항목을 선택하는 콤보박스.
 * 라벨/담당자처럼 항목 수가 많고 다중 선택이 필요한 필터에 Select 대신 사용합니다.
 */
export interface MultiSelectProps {
  /** 선택 항목 목록 */
  options: MultiSelectOption[]
  /** 선택된 값 목록 */
  value: string[]
  onChange: (value: string[]) => void
  /** 미선택 상태 안내 문구 */
  placeholder?: string
  /** 목록 상단 검색창 placeholder */
  searchPlaceholder?: string
  /** 검색창 표시 여부. 기본값 true */
  searchable?: boolean
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = '선택',
  searchPlaceholder = '검색',
  searchable = true,
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filtered = useMemo(
    () => (query ? options.filter(opt => opt.label.toLowerCase().includes(query.toLowerCase())) : options),
    [options, query]
  )

  const toggle = (optValue: string) => {
    onChange(value.includes(optValue) ? value.filter(v => v !== optValue) : [...value, optValue])
  }

  const selectedLabels = options.filter(opt => value.includes(opt.value)).map(opt => opt.label)
  const summary =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels[0]} 외 ${selectedLabels.length - 1}건`

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm bg-surface border border-border rounded-input',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
          'disabled:opacity-50',
          value.length === 0 ? 'text-muted' : 'text-foreground'
        )}
      >
        <span className="truncate max-w-[160px]">{summary}</span>
        {value.length > 0 && (
          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-medium bg-brand text-on-brand rounded-badge">
            {value.length}
          </span>
        )}
        <span className="text-muted" aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-card shadow-lg py-2 min-w-[220px] max-h-72 overflow-auto"
        >
          {searchable && (
            <div className="px-2 pb-2">
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  'w-full px-3 py-1.5 text-sm bg-surface border border-border rounded-input text-foreground placeholder:text-placeholder',
                  'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand'
                )}
              />
            </div>
          )}
          <div className="flex flex-col">
            {filtered.map(opt => (
              <div key={opt.value} role="option" aria-selected={value.includes(opt.value)} className="px-3 py-1 hover:bg-surface-raised">
                <Checkbox checked={value.includes(opt.value)} onChange={() => toggle(opt.value)} label={opt.label} />
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted">검색 결과가 없습니다</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
