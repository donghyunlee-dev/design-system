import { ReactNode } from 'react'
import { Input } from '../../../components/form/Input'
import { Spinner } from '../../../components/feedback/Spinner'
import { EmptyState } from '../../../components/feedback/EmptyState'
import { cn } from '../../../utils/cn'
import { FilterSection } from '../../types'

export interface ProductListProps<T = Record<string, unknown>> {
  items: T[]
  renderRow: (item: T, index: number) => ReactNode
  sideFilters?: FilterSection[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onSearch?: (query: string) => void
  loading?: boolean
  title?: string
  className?: string
}

export function ProductList<T = Record<string, unknown>>({
  items, renderRow, sideFilters = [], activeFilters = {},
  onFilterChange, onSearch, loading, title, className,
}: ProductListProps<T>) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {title && <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>}

        <div className="flex gap-6">
          {/* Side filters */}
          {sideFilters.length > 0 && (
            <aside className="w-52 flex-shrink-0">
              {sideFilters.map(section => (
                <div key={section.key} className="mb-6">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                    {section.title}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {section.options.map(opt => (
                      <li key={opt.value}>
                        <button
                          onClick={() => onFilterChange?.(section.key, opt.value)}
                          className={cn(
                            'w-full text-left text-sm px-2 py-1 rounded-btn transition-colors duration-default flex justify-between',
                            activeFilters[section.key] === opt.value
                              ? 'bg-brand/10 text-brand font-medium'
                              : 'text-muted hover:text-foreground hover:bg-surface-raised'
                          )}
                        >
                          <span>{opt.label}</span>
                          {opt.count !== undefined && (
                            <span className="text-xs opacity-60">{opt.count}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {onSearch && (
              <Input placeholder="검색..." className="mb-4" onChange={e => onSearch(e.target.value)} />
            )}
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : items.length === 0 ? (
              <EmptyState icon="📋" title="항목이 없습니다" />
            ) : (
              <div className="flex flex-col divide-y divide-border border border-border rounded-card overflow-hidden">
                {items.map((item, i) => renderRow(item, i))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
