import { ReactNode } from 'react'
import { Input } from '../../../components/form/Input'
import { Spinner } from '../../../components/feedback/Spinner'
import { EmptyState } from '../../../components/feedback/EmptyState'
import { cn } from '../../../utils/cn'
import { FilterOption } from '../../types'

export interface ProductGridProps<T = Record<string, unknown>> {
  items: T[]
  renderCard: (item: T, index: number) => ReactNode
  filters?: FilterOption[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  loading?: boolean
  emptyState?: ReactNode
  title?: string
  className?: string
}

export function ProductGrid<T = Record<string, unknown>>({
  items, renderCard, filters = [], activeFilters = {},
  onFilterChange, onSearch, searchPlaceholder = '검색...',
  loading, emptyState, title, className,
}: ProductGridProps<T>) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {title && <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>}

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {onSearch && (
            <Input
              placeholder={searchPlaceholder}
              className="sm:max-w-xs"
              onChange={e => onSearch(e.target.value)}
            />
          )}
          <div className="flex gap-2 flex-wrap">
            {filters.map(f =>
              f.options.map(opt => (
                <button
                  key={`${f.key}-${opt.value}`}
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

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : items.length === 0 ? (
          emptyState ?? <EmptyState icon="📦" title="항목이 없습니다" description="조건을 변경해 보세요" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => renderCard(item, i))}
          </div>
        )}
      </div>
    </div>
  )
}
