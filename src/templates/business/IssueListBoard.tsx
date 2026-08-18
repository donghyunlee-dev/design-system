import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Input } from '../../components/form/Input'
import { Checkbox } from '../../components/form/Checkbox'
import { Avatar } from '../../components/foundation/Avatar'
import { Icon } from '../../components/foundation/Icon'
import { Tag } from '../../components/data/Tag'
import { EmptyState } from '../../components/feedback/EmptyState'
import { Pagination, PaginationProps } from '../../components/navigation/Pagination'
import { cn } from '../../utils/cn'

export type IssueStatus = 'open' | 'closed'

export interface IssueListItem {
  id: string
  /** 이슈 번호 (예: "#128") */
  no: string
  title: string
  status: IssueStatus
  /** 관련 시스템/라벨 (예: "ERP", "긴급") */
  labels?: string[]
  /** "홍길동님이 3일 전 등록" 형태의 메타 문구 */
  meta: string
  commentCount?: number
  assignee?: { name: string; initials?: string }
}

export interface IssueListBoardProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  issues: IssueListItem[]
  openCount: number
  closedCount: number
  activeTab: IssueStatus
  onTabChange?: (tab: IssueStatus) => void
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  /** 검색창 우측에 표시할 필터 (Select 등) */
  filters?: ReactNode
  onItemClick?: (issue: IssueListItem) => void
  actions?: ReactNode
  className?: string
  /** true면 행마다 일괄 선택용 체크박스를 표시 */
  selectable?: boolean
  /** 선택된 이슈 id 목록 (selectable일 때 사용) */
  selectedIds?: string[]
  onSelectedIdsChange?: (ids: string[]) => void
  /** 목록 하단 페이지네이션 (지정 시 표시) */
  pagination?: PaginationProps
}

export function IssueListBoard({
  title,
  breadcrumb,
  issues,
  openCount,
  closedCount,
  activeTab,
  onTabChange,
  searchPlaceholder = '이슈 검색',
  onSearch,
  filters,
  onItemClick,
  actions,
  className,
  selectable = false,
  selectedIds = [],
  onSelectedIdsChange,
  pagination,
}: IssueListBoardProps) {
  const [search, setSearch] = useState('')

  const allSelected = selectable && issues.length > 0 && issues.every(issue => selectedIds.includes(issue.id))

  const toggleAll = () => {
    if (!onSelectedIdsChange) return
    onSelectedIdsChange(allSelected ? [] : issues.map(issue => issue.id))
  }

  const toggleOne = (id: string) => {
    if (!onSelectedIdsChange) return
    onSelectedIdsChange(
      selectedIds.includes(id) ? selectedIds.filter(existing => existing !== id) : [...selectedIds, id]
    )
  }

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
        <div className="flex flex-wrap gap-3 items-center mb-4">
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
          {filters && <div className="flex gap-2 flex-wrap items-center">{filters}</div>}
        </div>

        {selectable && selectedIds.length > 0 && (
          <div className="flex items-center gap-2 mb-2 text-sm text-foreground">
            <span>{selectedIds.length}개 선택됨</span>
          </div>
        )}

        {/* 이슈 목록 */}
        <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
          {selectable && issues.length > 0 && (
            <div className="flex items-center px-4 py-2 bg-surface-raised">
              <Checkbox checked={allSelected} onChange={toggleAll} label="전체 선택" />
            </div>
          )}
          {issues.map(issue => (
            <div
              key={issue.id}
              onClick={() => onItemClick?.(issue)}
              className={cn(
                'flex items-start gap-3 px-4 py-3',
                onItemClick && 'cursor-pointer hover:bg-surface-raised'
              )}
            >
              {selectable && (
                <span onClick={e => e.stopPropagation()} className="mt-0.5 flex-shrink-0">
                  <Checkbox checked={selectedIds.includes(issue.id)} onChange={() => toggleOne(issue.id)} />
                </span>
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

        {pagination && issues.length > 0 && (
          <div className="flex justify-end mt-4">
            <Pagination {...pagination} />
          </div>
        )}
      </div>
    </div>
  )
}
