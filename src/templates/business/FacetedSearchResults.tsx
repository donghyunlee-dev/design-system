import { ReactNode, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Tag } from '../../components/data/Tag'
import { EmptyState } from '../../components/feedback/EmptyState'
import { FilterSection } from '../types'
import { cn } from '../../utils/cn'

export interface FacetedSearchResultItem {
  id: string
  title: string
  description?: string
  /** 항목 유형/등급 등 단일 강조 배지 (예: "우수협력사", "신선냉장") */
  badge?: string
  /** 하단 메타 정보 목록 (예: "사업자번호 123-45-67890", "최근 계약 2026-06-01") */
  stats?: string[]
  tags?: string[]
}

export interface FacetedSearchResultsProps {
  title?: string
  keyword: string
  onSearch?: (keyword: string) => void
  searchPlaceholder?: string
  /** 좌측 패싯 필터 섹션 */
  facets?: FilterSection[]
  /** 선택된 패싯 값 (key -> value[]) */
  selectedFacets?: Record<string, string[]>
  onFacetChange?: (sectionKey: string, value: string) => void
  /** 정렬 옵션 (예: 최신순, 평점순) */
  sortOptions?: { value: string; label: string }[]
  sortValue?: string
  onSortChange?: (value: string) => void
  items: FacetedSearchResultItem[]
  onItemClick?: (item: FacetedSearchResultItem) => void
  actions?: ReactNode
  className?: string
}

export function FacetedSearchResults({
  title = '검색 결과',
  keyword,
  onSearch,
  searchPlaceholder = '검색어를 입력하세요',
  facets,
  selectedFacets,
  onFacetChange,
  sortOptions,
  sortValue,
  onSortChange,
  items,
  onItemClick,
  actions,
  className,
}: FacetedSearchResultsProps) {
  const [search, setSearch] = useState(keyword)

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

        <div className="flex gap-6">
          {/* 좌측 패싯 필터 */}
          {facets && facets.length > 0 && (
            <aside className="w-56 flex-shrink-0">
              <div className="bg-surface border border-border rounded-card shadow-card p-4">
                {facets.map((section, si) => (
                  <div key={section.key} className={si > 0 ? 'mt-5' : ''}>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      {section.title}
                    </p>
                    <ul className="space-y-1">
                      {section.options.map(opt => {
                        const active = selectedFacets?.[section.key]?.includes(opt.value) ?? false
                        return (
                          <li key={opt.value}>
                            <button
                              type="button"
                              onClick={() => onFacetChange?.(section.key, opt.value)}
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
                전체 <span className="font-semibold text-foreground">{items.length}</span>건
              </p>
              {sortOptions && sortOptions.length > 0 && (
                <div className="w-40">
                  <Select
                    options={sortOptions}
                    value={sortValue}
                    onChange={e => onSortChange?.(e.target.value)}
                  />
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div className="bg-surface border border-border rounded-card shadow-card">
                <EmptyState title="검색 결과가 없습니다" description="다른 검색어나 필터로 다시 시도해 보세요." />
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick?.(item)}
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
      </div>
    </div>
  )
}
