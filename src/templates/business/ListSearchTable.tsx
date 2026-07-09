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
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 검색·필터 바 */}
        <div className="bg-surface border border-border rounded-card p-4 mb-4 flex flex-wrap gap-3 items-end shadow-card">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          {filters && <div className="flex gap-2 flex-wrap items-end">{filters}</div>}
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
