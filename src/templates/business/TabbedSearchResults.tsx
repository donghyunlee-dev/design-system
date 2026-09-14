import { ReactNode, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Tag } from '../../components/data/Tag'
import { EmptyState } from '../../components/feedback/EmptyState'
import { FilterSection } from '../types'
import { FacetedSearchResultItem } from './FacetedSearchResults'
import { cn } from '../../utils/cn'

export interface TabbedSearchResultScope {
  /** 검색 범위 식별자 (예: board, document, partner) */
  key: string
  /** 탭 레이블 (예: "게시판") */
  label: string
  /** 탭에 표시할 건수 */
  count: number
  /** 이 범위의 좌측 패싯 필터 섹션 */
  facets?: FilterSection[]
  /** 선택된 패싯 값 (key -> value[]) */
  selectedFacets?: Record<string, string[]>
  /** 정렬 옵션 (예: 관련도순, 최신순) */
  sortOptions?: { value: string; label: string }[]
  sortValue?: string
  items: FacetedSearchResultItem[]
}

export interface TabbedSearchResultsProps {
  title?: string
  keyword: string
  onSearch?: (keyword: string) => void
  searchPlaceholder?: string
  scopes: TabbedSearchResultScope[]
  activeScope: string
  onScopeChange?: (scopeKey: string) => void
  onFacetChange?: (scopeKey: string, sectionKey: string, value: string) => void
  onSortChange?: (scopeKey: string, value: string) => void
  onItemClick?: (scope: TabbedSearchResultScope, item: FacetedSearchResultItem) => void
  actions?: ReactNode
  className?: string
}

export function TabbedSearchResults({
  title = '통합 검색 결과',
  keyword,
  onSearch,
  searchPlaceholder = '검색어를 입력하세요',
  scopes,
  activeScope,
  onScopeChange,
  onFacetChange,
  onSortChange,
  onItemClick,
  actions,
  className,
}: TabbedSearchResultsProps) {
  const [search, setSearch] = useState(keyword)
  const current = scopes.find(s => s.key === activeScope) ?? scopes[0]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="mb-4 max-w-xl">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSearch?.(search) }}
          />
        </div>

        {/* 검색 범위 탭 */}
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          {scopes.map(scope => (
            <button
              key={scope.key}
              type="button"
              onClick={() => onScopeChange?.(scope.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
                scope.key === current?.key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              <span>{scope.label}</span>
              <span
                className={cn(
                  'text-xs rounded-full px-1.5 py-0.5',
                  scope.key === current?.key ? 'bg-brand-subtle text-brand' : 'bg-surface-subtle text-muted'
                )}
              >
                {scope.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        {!current ? (
          <div className="bg-surface border border-border rounded-card shadow-card">
            <EmptyState title="검색 결과가 없습니다" description="다른 검색어나 필터로 다시 시도해 보세요." />
          </div>
        ) : (
          <div className="flex gap-6">
            {/* 좌측 패싯 필터 */}
            {current.facets && current.facets.length > 0 && (
              <aside className="w-56 flex-shrink-0">
                <div className="bg-surface border border-border rounded-card shadow-card p-4">
                  {current.facets.map((section, si) => (
                    <div key={section.key} className={si > 0 ? 'mt-5' : ''}>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        {section.title}
                      </p>
                      <ul className="space-y-1">
                        {section.options.map(opt => {
                          const active = current.selectedFacets?.[section.key]?.includes(opt.value) ?? false
                          return (
                            <li key={opt.value}>
                              <button
                                type="button"
                                onClick={() => onFacetChange?.(current.key, section.key, opt.value)}
                                className={cn(
                                  'w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-left transition-colors',
                                  active ? 'bg-brand-subtle text-brand font-medium' : 'text-foreground hover:bg-surface-subtle'
                                )}
                              >
                                <span>{opt.label}</span>
                                {opt.count !== undefined && (
                                  <span className="text-xs text-muted">{opt.count}</span>
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </aside>
            )}

            {/* 우측 결과 목록 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-foreground">{current.label}</span> {current.count.toLocaleString()}건
                </p>
                {current.sortOptions && current.sortOptions.length > 0 && (
                  <div className="w-40">
                    <Select
                      options={current.sortOptions}
                      value={current.sortValue}
                      onChange={e => onSortChange?.(current.key, e.target.value)}
                    />
                  </div>
                )}
              </div>

              {current.items.length === 0 ? (
                <div className="bg-surface border border-border rounded-card shadow-card">
                  <EmptyState title="검색 결과가 없습니다" description="다른 검색어나 필터로 다시 시도해 보세요." />
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
                  {current.items.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(current, item)}
                      className={cn('px-4 py-3.5', onItemClick && 'cursor-pointer hover:bg-surface-raised')}
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        {item.badge && <Tag>{item.badge}</Tag>}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted mt-1">{item.description}</p>
                      )}
                      {item.stats && item.stats.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted flex-wrap">
                          {item.stats.map((stat, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                              {i > 0 && <span aria-hidden="true">·</span>}
                              {stat}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
