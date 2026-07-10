import { ReactNode, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Tag } from '../../components/data/Tag'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { EmptyState } from '../../components/feedback/EmptyState'
import { FilterSection } from '../types'
import { cn } from '../../utils/cn'

export interface SearchResultItem {
  id: string
  title: string
  description?: string
  /** 부가 메타 정보 (예: "OMS · 2026-07-10") */
  meta?: string
  tags?: string[]
}

export interface SearchResultGroup {
  /** 엔티티 종류 키 (예: order, partner, document) */
  key: string
  /** 그룹 표시 레이블 (예: "주문") */
  label: string
  items: SearchResultItem[]
}

export interface GlobalSearchResultsProps {
  title?: string
  keyword: string
  onSearch?: (keyword: string) => void
  /** 좌측 패싯 필터 섹션 */
  facets?: FilterSection[]
  /** 선택된 패싯 값 (key -> value[]) */
  selectedFacets?: Record<string, string[]>
  onFacetChange?: (sectionKey: string, value: string) => void
  groups: SearchResultGroup[]
  onItemClick?: (group: SearchResultGroup, item: SearchResultItem) => void
  actions?: ReactNode
  className?: string
}

export function GlobalSearchResults({
  title = '통합 검색 결과',
  keyword,
  onSearch,
  facets,
  selectedFacets,
  onFacetChange,
  groups,
  onItemClick,
  actions,
  className,
}: GlobalSearchResultsProps) {
  const [search, setSearch] = useState(keyword)

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="mb-4 max-w-xl">
          <Input
            placeholder="주문, 파트너, 문서 등을 검색하세요"
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
            <p className="text-sm text-muted mb-3">
              전체 <span className="font-semibold text-foreground">{totalCount}</span>건
            </p>

            {groups.length === 0 || totalCount === 0 ? (
              <div className="bg-surface border border-border rounded-card shadow-card">
                <EmptyState title="검색 결과가 없습니다" description="다른 검색어나 필터로 다시 시도해 보세요." />
              </div>
            ) : (
              <Stack gap={6}>
                {groups.filter(g => g.items.length > 0).map((group, gi, filtered) => (
                  <div key={group.key}>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-sm font-semibold text-foreground">{group.label}</h2>
                      <span className="text-xs text-muted">{group.items.length}건</span>
                    </div>
                    <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
                      {group.items.map(item => (
                        <div
                          key={item.id}
                          onClick={() => onItemClick?.(group, item)}
                          className={cn('px-4 py-3', onItemClick && 'cursor-pointer hover:bg-surface-raised')}
                        >
                          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted mt-1 truncate">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {item.meta && <span className="text-xs text-muted">{item.meta}</span>}
                            {item.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                          </div>
                        </div>
                      ))}
                    </div>
                    {gi < filtered.length - 1 && <Divider className="mt-4" />}
                  </div>
                ))}
              </Stack>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
