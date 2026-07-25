import { ReactNode, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Tag } from '../../components/data/Tag'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { EmptyState } from '../../components/feedback/EmptyState'
import { FilterSection } from '../types'
import { cn } from '../../utils/cn'
import type { SearchResultItem } from './GlobalSearchResults'

/**
 * `GlobalSearchResults`의 결과 항목을 확장해 좌측 아이콘/썸네일 슬롯을 지원하는 변형.
 *
 * `src/components/data/List.tsx`의 `leading?: ReactNode` 슬롯 패턴을 그대로 따릅니다.
 * 결과 항목 하나에 Avatar(아바타/썸네일)나 Icon(아이콘) 등 기존 foundation 컴포넌트를
 * 조합해 넣을 수 있도록 `leading` 필드만 추가하며, 그 외 필드/레이아웃/토큰은
 * `GlobalSearchResults`와 동일하게 유지합니다.
 *
 * 원본 `GlobalSearchResults.tsx`는 정책상 수정하지 않고, 신규 파일로 갭을 채웁니다.
 */
export interface SearchResultItemWithMedia extends SearchResultItem {
  /** 결과 행 좌측 아이콘/아바타/썸네일 슬롯 (예: <Avatar .../>, <Icon .../>) */
  leading?: ReactNode
}

export interface SearchResultGroupWithMedia {
  /** 엔티티 종류 키 (예: order, partner, document) */
  key: string
  /** 그룹 표시 레이블 (예: "주문") */
  label: string
  items: SearchResultItemWithMedia[]
}

export interface GlobalSearchResultsMediaProps {
  title?: string
  keyword: string
  onSearch?: (keyword: string) => void
  /** 좌측 패싯 필터 섹션 */
  facets?: FilterSection[]
  /** 선택된 패싯 값 (key -> value[]) */
  selectedFacets?: Record<string, string[]>
  onFacetChange?: (sectionKey: string, value: string) => void
  groups: SearchResultGroupWithMedia[]
  onItemClick?: (group: SearchResultGroupWithMedia, item: SearchResultItemWithMedia) => void
  actions?: ReactNode
  className?: string
}

export function GlobalSearchResultsMedia({
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
}: GlobalSearchResultsMediaProps) {
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
                          className={cn('flex items-start gap-3 px-4 py-3', onItemClick && 'cursor-pointer hover:bg-surface-raised')}
                        >
                          {item.leading && <span className="flex-shrink-0 mt-0.5">{item.leading}</span>}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-muted mt-1 truncate">{item.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {item.meta && <span className="text-xs text-muted">{item.meta}</span>}
                              {item.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                            </div>
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
