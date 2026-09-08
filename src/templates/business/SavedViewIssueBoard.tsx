import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { ChipGroup, ChipGroupItem } from '../../components/navigation/ChipGroup'
import { Pagination, PaginationProps } from '../../components/navigation/Pagination'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Avatar } from '../../components/foundation/Avatar'
import { Icon } from '../../components/foundation/Icon'
import { Button } from '../../components/foundation/Button'
import { Tag } from '../../components/data/Tag'
import { ColorTag, ColorTagVariant } from '../../components/data/ColorTag'
import { DropdownMenu, DropdownItem } from '../../components/overlay/DropdownMenu'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export type SavedViewIssueStatus = 'open' | 'closed'

/** 라벨 하나. 문자열만 주면 중립 회색으로, 색상을 구분하려면 { text, variant }로 지정합니다. */
export type SavedViewIssueLabel = string | { text: string; variant?: ColorTagVariant }

export interface SavedViewIssueItem {
  id: string
  /** 이슈 번호 (예: "#128") */
  no: string
  title: string
  status: SavedViewIssueStatus
  /** 관련 시스템/라벨 (예: "ERP", "긴급"). GitHub 라벨처럼 색상 구분이 필요하면 { text, variant } 형태로 지정하세요. */
  labels?: SavedViewIssueLabel[]
  /** "홍길동님이 3일 전 등록" 형태의 메타 문구 */
  meta: string
  commentCount?: number
  assignee?: { name: string; initials?: string }
}

/** 검색·필터 조건을 저장해 둔 보기 (예: "내가 등록한", "나에게 할당된") */
export interface SavedIssueView extends ChipGroupItem {}

/** 현재 적용된 필터 하나를 나타내는 칩 (예: "라벨: ERP") */
export interface AppliedIssueFilter {
  id: string
  label: string
}

export interface SavedViewIssueBoardProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  /** 저장된 보기 목록 (전체 보기, 내가 등록한, 나에게 할당된 등) */
  views: SavedIssueView[]
  activeViewId: string
  onViewChange?: (id: string) => void
  issues: SavedViewIssueItem[]
  openCount: number
  closedCount: number
  activeTab: SavedViewIssueStatus
  onTabChange?: (tab: SavedViewIssueStatus) => void
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  /** 검색창 옆에 표시할 필터 드롭다운 (담당 시스템/라벨/담당자 등) */
  filterMenus?: { label: string; items: DropdownItem[] }[]
  /** 현재 적용된 필터 칩 목록. 제공 시 검색 바 아래에 표시됩니다. */
  appliedFilters?: AppliedIssueFilter[]
  onRemoveFilter?: (id: string) => void
  onClearFilters?: () => void
  sortOptions?: { value: string; label: string }[]
  sortValue?: string
  onSortChange?: (value: string) => void
  pagination?: PaginationProps
  onItemClick?: (issue: SavedViewIssueItem) => void
  actions?: ReactNode
  className?: string
}

export function SavedViewIssueBoard({
  title,
  breadcrumb,
  views,
  activeViewId,
  onViewChange,
  issues,
  openCount,
  closedCount,
  activeTab,
  onTabChange,
  searchPlaceholder = '이슈 검색',
  onSearch,
  filterMenus,
  appliedFilters,
  onRemoveFilter,
  onClearFilters,
  sortOptions,
  sortValue,
  onSortChange,
  pagination,
  onItemClick,
  actions,
  className,
}: SavedViewIssueBoardProps) {
  const [search, setSearch] = useState('')

  const handleSearch = (val: string) => {
    setSearch(val)
    onSearch?.(val)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 저장된 보기 */}
        {views.length > 0 && (
          <div className="mb-4">
            <ChipGroup items={views} value={activeViewId} onChange={id => onViewChange?.(id)} />
          </div>
        )}

        {/* 상태 탭 */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {([
            { key: 'open' as const, label: '열림', count: openCount },
            { key: 'closed' as const, label: '닫힘', count: closedCount },
          ]).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange?.(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  tab.key === 'open' ? 'bg-success' : 'bg-muted'
                )}
                aria-hidden="true"
              />
              {tab.label}
              <span className="text-xs text-muted">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* 검색·필터 바 */}
        <div className="flex flex-wrap gap-3 items-center mb-3">
          <div className="flex-1 min-w-[200px] relative">
            <Icon
              name="search"
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filterMenus && filterMenus.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              {filterMenus.map(menu => (
                <DropdownMenu
                  key={menu.label}
                  trigger={<Button variant="secondary" size="sm">{menu.label}</Button>}
                  items={menu.items}
                />
              ))}
            </div>
          )}
          {sortOptions && sortOptions.length > 0 && (
            <div className="w-36">
              <Select
                options={sortOptions}
                value={sortValue}
                onChange={e => onSortChange?.(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 적용된 필터 칩 */}
        {appliedFilters && appliedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="text-xs text-muted">적용된 필터</span>
            {appliedFilters.map(filter => (
              <Tag key={filter.id} onRemove={onRemoveFilter ? () => onRemoveFilter(filter.id) : undefined}>
                {filter.label}
              </Tag>
            ))}
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs text-brand hover:underline"
              >
                모두 지우기
              </button>
            )}
          </div>
        )}

        {/* 이슈 목록 */}
        <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
          {issues.map(issue => (
            <div
              key={issue.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3',
                onItemClick && 'cursor-pointer hover:bg-surface-raised'
              )}
              onClick={() => onItemClick?.(issue)}
            >
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0',
                  issue.status === 'open' ? 'bg-success' : 'bg-muted'
                )}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{issue.title}</p>
                  {issue.labels?.map(label => {
                    const text = typeof label === 'string' ? label : label.text
                    const variant = typeof label === 'string' ? undefined : label.variant
                    return <ColorTag key={text} variant={variant}>{text}</ColorTag>
                  })}
                </div>
                <p className="text-xs text-muted mt-1">
                  {issue.no} · {issue.meta}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {issue.commentCount !== undefined && issue.commentCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Icon name="comment" size="xs" />
                    {issue.commentCount}
                  </span>
                )}
                {issue.assignee && (
                  <Avatar size="sm" initials={issue.assignee.initials} alt={issue.assignee.name} />
                )}
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <EmptyState title="이슈가 없습니다" description="조건에 맞는 이슈가 없습니다." />
          )}
        </div>

        {pagination && (
          <div className="flex justify-center mt-4">
            <Pagination {...pagination} />
          </div>
        )}
      </div>
    </div>
  )
}
