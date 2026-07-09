import { ReactNode } from 'react'
import { Input } from '../../components/form/Input'
import { Table, Column } from '../../components/data/Table'
import { Pagination, PaginationProps } from '../../components/navigation/Pagination'
import { Spinner } from '../../components/feedback/Spinner'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'
import { FilterOption } from '../types'

export interface DataTablePageProps<T extends Record<string, unknown> = Record<string, unknown>> {
  title: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  actions?: ReactNode
  onSearch?: (query: string) => void
  filters?: FilterOption[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onRowClick?: (row: T) => void
  loading?: boolean
  pagination?: PaginationProps
  className?: string
}

export function DataTablePage<T extends Record<string, unknown> = Record<string, unknown>>({
  title, columns, data, rowKey, actions, onSearch,
  filters = [], activeFilters = {}, onFilterChange,
  onRowClick, loading, pagination, className,
}: DataTablePageProps<T>) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {onSearch && (
            <Input placeholder="검색..." className="sm:max-w-xs" onChange={e => onSearch(e.target.value)} />
          )}
          <div className="flex gap-2 flex-wrap">
            {filters.map(f =>
              f.options.map(opt => (
                <button
                  key={`${f.key}-${opt.value}`}
                  type="button"
                  onClick={() => onFilterChange?.(f.key, opt.value)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-badge border transition-colors duration-default',
                    activeFilters[f.key] === opt.value
                      ? 'bg-brand text-white border-brand'
                      : 'bg-surface border-border text-muted hover:border-brand hover:text-brand'
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : data.length === 0 ? (
          <EmptyState icon="📋" title="데이터가 없습니다" />
        ) : (
          <>
            <Table columns={columns} data={data} rowKey={rowKey} onRowClick={onRowClick} />
            {pagination && (
              <div className="mt-4 flex justify-end">
                <Pagination {...pagination} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
