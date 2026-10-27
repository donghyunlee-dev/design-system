import { ReactNode, useState } from 'react'
import { DataTable, DataColumn, DataTablePagination } from '../../components/data/DataTable'
import { Input } from '../../components/form/Input'
import { Button } from '../../components/foundation/Button'
import { cn } from '../../utils/cn'

export interface ListSearchTableProps<T extends Record<string, unknown>> {
  title: string
  columns: DataColumn<T>[]
  data: T[]
  rowKey: keyof T
  /** 우측 상단 액션 버튼 영역 */
  actions?: ReactNode
  searchPlaceholder?: string
  /** 검색어 변경 시 호출 */
  onSearch?: (value: string) => void
  /** 검색창 우측에 표시할 필터 (Select, DateTimePicker 등) */
  filters?: ReactNode
  pagination?: DataTablePagination
  onRowClick?: (row: T) => void
  className?: string
}

export function ListSearchTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  rowKey,
  actions,
  searchPlaceholder = '검색어를 입력하세요',
  onSearch,
  filters,
  pagination,
  onRowClick,
  className,
}: ListSearchTableProps<T>) {
  const [search, setSearch] = useState('')

  const handleSearch = (val: string) => {
    setSearch(val)
    onSearch?.(val)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-7xl px-[var(--windsoft-page-gutter)] py-ws-6">
        {/* 헤더 */}
        <div className="mb-ws-6 flex flex-wrap items-center justify-between gap-ws-3">
          <h1 className="text-page-title text-foreground">{title}</h1>
          {actions && <div className="flex flex-wrap gap-ws-2">{actions}</div>}
        </div>

        {/* 검색·필터 바 */}
        <div className="mb-ws-4 flex flex-wrap items-end gap-ws-3 rounded-card border border-border bg-surface p-ws-4 shadow-card">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          {filters && <div className="flex flex-wrap items-end gap-ws-2">{filters}</div>}
          <Button variant="primary" onClick={() => onSearch?.(search)}>조회</Button>
        </div>

        {/* 데이터 테이블 */}
        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            rowKey={rowKey}
            showRowNumbers
            pagination={pagination}
            onRowClick={onRowClick}
          />
        </div>
      </div>
    </div>
  )
}
