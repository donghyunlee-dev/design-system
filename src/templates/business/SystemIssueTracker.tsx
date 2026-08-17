import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Checkbox } from '../../components/form/Checkbox'
import { Avatar } from '../../components/foundation/Avatar'
import { Icon } from '../../components/foundation/Icon'
import { Button } from '../../components/foundation/Button'
import { Tag } from '../../components/data/Tag'
import { DropdownMenu, DropdownItem } from '../../components/overlay/DropdownMenu'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export type SystemIssueStatus = 'open' | 'closed'

export interface SystemIssueItem {
  id: string
  /** 이슈 번호 (예: "#128") */
  no: string
  title: string
  status: SystemIssueStatus
  /** 관련 시스템/라벨 (예: "ERP", "긴급") */
  labels?: string[]
  /** "홍길동님이 3일 전 등록" 형태의 메타 문구 */
  meta: string
  commentCount?: number
  assignee?: { name: string; initials?: string }
}

export interface SystemIssueFilterMenu {
  /** 필터 드롭다운 트리거 라벨 (예: "담당 시스템", "라벨") */
  label: string
  items: DropdownItem[]
}

export interface SystemIssueTrackerProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  issues: SystemIssueItem[]
  openCount: number
  closedCount: number
  activeTab: SystemIssueStatus
  onTabChange?: (tab: SystemIssueStatus) => void
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  /** 검색창 옆에 표시할 필터 드롭다운 (담당 시스템/라벨/담당자 등) */
  filterMenus?: SystemIssueFilterMenu[]
  sortOptions?: { value: string; label: string }[]
  sortValue?: string
  onSortChange?: (value: string) => void
  /** 선택된 이슈 id 목록. 전달 시 행 체크박스와 일괄 처리 바가 활성화됩니다. */
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  /** 1건 이상 선택 시 표시할 일괄 처리 액션 */
  bulkActions?: DropdownItem[]
  onItemClick?: (issue: SystemIssueItem) => void
  actions?: ReactNode
  className?: string
}

export function SystemIssueTracker({
  title,
  breadcrumb,
  issues,
  openCount,
  closedCount,
  activeTab,
  onTabChange,
  searchPlaceholder = '이슈 검색',
  onSearch,
  filterMenus,
  sortOptions,
  sortValue,
  onSortChange,
  selectedIds,
  onSelectionChange,
  bulkActions,
  onItemClick,
  actions,
  className,
}: SystemIssueTrackerProps) {
  const [search, setSearch] = useState('')
  const selectable = selectedIds !== undefined
  const selectedCount = selectedIds?.length ?? 0
  const allSelected = selectable && issues.length > 0 && selectedCount === issues.length

  const handleSearch = (val: string) => {
    setSearch(val)
    onSearch?.(val)
  }

  const toggleAll = () => {
    if (!onSelectionChange) return
    onSelectionChange(allSelected ? [] : issues.map(i => i.id))
  }

  const toggleOne = (id: string) => {
    if (!onSelectionChange || !selectedIds) return
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter(v => v !== id) : [...selectedIds, id]
    )
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

        {/* 검색·필터·일괄처리 바 */}
        <div className="flex flex-wrap gap-3 items-center mb-4">
          {selectable && selectedCount > 0 ? (
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              <Checkbox checked={allSelected} onChange={toggleAll} />
              <span className="text-sm text-foreground">{selectedCount}건 선택됨</span>
              {bulkActions && bulkActions.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {bulkActions.map((action, i) => (
                    <Button key={i} variant="secondary" size="sm" onClick={action.onClick}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {selectable && <Checkbox checked={false} onChange={toggleAll} />}
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
            </>
          )}
        </div>

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
              {selectable && (
                <Checkbox
                  checked={selectedIds?.includes(issue.id) ?? false}
                  onChange={() => toggleOne(issue.id)}
                  onClick={e => e.stopPropagation()}
                  className="mt-1"
                />
              )}
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
                  {issue.labels?.map(label => <Tag key={label}>{label}</Tag>)}
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
      </div>
    </div>
  )
}
