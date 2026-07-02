import { ReactNode, useState } from 'react'
import { Input } from '../../components/form/Input'
import { cn } from '../../utils/cn'

export interface MasterDetailProps<T extends Record<string, unknown>> {
  title: string
  listData: T[]
  listRowKey: keyof T
  /** 목록 행 렌더러 */
  renderListItem: (row: T, selected: boolean) => ReactNode
  /** 선택된 항목의 상세 렌더러 */
  renderDetail?: (row: T) => ReactNode
  /** 미선택 시 안내 */
  emptyDetail?: ReactNode
  onSelect?: (row: T) => void
  listActions?: ReactNode
  searchPlaceholder?: string
  /** 검색 필터 함수 */
  filterFn?: (row: T, search: string) => boolean
  className?: string
}

export function MasterDetail<T extends Record<string, unknown>>({
  title,
  listData,
  listRowKey,
  renderListItem,
  renderDetail,
  emptyDetail,
  onSelect,
  listActions,
  searchPlaceholder = '검색',
  filterFn,
  className,
}: MasterDetailProps<T>) {
  const [search, setSearch] = useState('')
  const [selectedKey, setSelectedKey] = useState<unknown>(null)

  const filtered = filterFn && search
    ? listData.filter(r => filterFn(r, search))
    : listData

  const selected = listData.find(r => r[listRowKey] === selectedKey) ?? null

  const handleSelect = (row: T) => {
    setSelectedKey(row[listRowKey])
    onSelect?.(row)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {listActions}
        </div>
        <div className="flex gap-4" style={{ height: 'calc(100vh - 160px)' }}>
          {/* 좌측 목록 */}
          <div className="w-80 flex-shrink-0 bg-surface border border-border rounded-card shadow-card flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-border-subtle">
              {filtered.map(row => (
                <li
                  key={String(row[listRowKey])}
                  onClick={() => handleSelect(row)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    selectedKey === row[listRowKey]
                      ? 'bg-brand-subtle'
                      : 'hover:bg-surface-subtle'
                  )}
                >
                  {renderListItem(row, selectedKey === row[listRowKey])}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="flex items-center justify-center h-20 text-sm text-muted">
                  검색 결과가 없습니다.
                </li>
              )}
            </ul>
          </div>

          {/* 우측 상세 */}
          <div className="flex-1 bg-surface border border-border rounded-card shadow-card overflow-y-auto">
            {selected ? (
              renderDetail?.(selected) ?? null
            ) : (
              emptyDetail ?? (
                <div className="flex items-center justify-center h-full text-sm text-muted">
                  목록에서 항목을 선택하세요.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
