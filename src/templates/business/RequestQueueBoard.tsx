import { ReactNode, useState } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Input } from '../../components/form/Input'
import { Checkbox } from '../../components/form/Checkbox'
import { Avatar } from '../../components/foundation/Avatar'
import { Icon } from '../../components/foundation/Icon'
import { Tag } from '../../components/data/Tag'
import { EmptyState } from '../../components/feedback/EmptyState'
import { Pagination } from '../../components/navigation/Pagination'
import { cn } from '../../utils/cn'

export type RequestQueueStatus = 'pending' | 'done'

export interface RequestQueueItem {
  id: string
  /** 요청/전표 번호 (예: "#241") */
  no: string
  title: string
  status: RequestQueueStatus
  /** 관련 시스템/구분 라벨 (예: "ERP", "긴급") */
  labels?: string[]
  /** "홍길동님이 3일 전 신청" 형태의 메타 문구 */
  meta: string
  commentCount?: number
  assignee?: { name: string; initials?: string }
}

export interface RequestQueueBoardProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  items: RequestQueueItem[]
  pendingCount: number
  doneCount: number
  activeTab: RequestQueueStatus
  onTabChange?: (tab: RequestQueueStatus) => void
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  /** 검색창 우측에 표시할 필터 (Select 등) */
  filters?: ReactNode
  /** 체크박스로 선택된 항목 id 목록 (제어형) */
  selectedIds?: string[]
  onSelectedIdsChange?: (ids: string[]) => void
  /** 1건 이상 선택 시 검색 바 대신 표시할 일괄 처리 액션 (승인/반려 등) */
  bulkActions?: ReactNode
  /** 하단 페이지네이션 표시용 — 생략 시 페이지네이션을 표시하지 않음 */
  page?: number
  pageSize?: number
  totalCount?: number
  onPageChange?: (page: number) => void
  onItemClick?: (item: RequestQueueItem) => void
  actions?: ReactNode
  className?: string
}

export function RequestQueueBoard({
  title,
  breadcrumb,
  items,
  pendingCount,
  doneCount,
  activeTab,
  onTabChange,
  searchPlaceholder = '요청 검색',
  onSearch,
  filters,
  selectedIds = [],
  onSelectedIdsChange,
  bulkActions,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onItemClick,
  actions,
  className,
}: RequestQueueBoardProps) {
  const [search, setSearch] = useState('')

  const handleSearch = (val: string) => {
    setSearch(val)
    onSearch?.(val)
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length
  const toggleAll = () => {
    onSelectedIdsChange?.(allSelected ? [] : items.map(item => item.id))
  }
  const toggleOne = (id: string) => {
    onSelectedIdsChange?.(
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
            { key: 'pending' as const, label: '대기중', count: pendingCount },
            { key: 'done' as const, label: '처리완료', count: doneCount },
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
                  tab.key === 'pending' ? 'bg-warning' : 'bg-muted'
                )}
                aria-hidden="true"
              />
              {tab.label}
              <span className="text-xs text-muted">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* 검색·필터 바 (선택 시 일괄 처리 바로 전환) */}
        {selectedIds.length > 0 ? (
          <div className="flex flex-wrap gap-3 items-center mb-4 px-4 py-2.5 bg-surface-raised border border-border rounded-card">
            <Checkbox checked={allSelected} onChange={toggleAll} />
            <span className="text-sm font-medium text-foreground">{selectedIds.length}건 선택됨</span>
            {bulkActions && <div className="flex gap-2 flex-wrap items-center ml-auto">{bulkActions}</div>}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 items-center mb-4">
            {items.length > 0 && (
              <Checkbox checked={allSelected} onChange={toggleAll} aria-label="전체 선택" />
            )}
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
        )}

        {/* 요청 목록 */}
        <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
          {items.map(item => (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3',
                onItemClick && 'hover:bg-surface-raised'
              )}
            >
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleOne(item.id)}
                onClick={e => e.stopPropagation()}
                aria-label={`${item.title} 선택`}
              />
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0',
                  item.status === 'pending' ? 'bg-warning' : 'bg-muted'
                )}
                aria-hidden="true"
              />
              <div
                onClick={() => onItemClick?.(item)}
                className={cn('flex-1 min-w-0', onItemClick && 'cursor-pointer')}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  {item.labels?.map(label => <Tag key={label}>{label}</Tag>)}
                </div>
                <p className="text-xs text-muted mt-1">
                  {item.no} · {item.meta}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.commentCount !== undefined && item.commentCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Icon name="comment" size="xs" />
                    {item.commentCount}
                  </span>
                )}
                {item.assignee && (
                  <Avatar size="sm" initials={item.assignee.initials} alt={item.assignee.name} />
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <EmptyState title="요청이 없습니다" description="조건에 맞는 요청이 없습니다." />
          )}
        </div>

        {page !== undefined && totalCount !== undefined && onPageChange && (
          <div className="flex justify-center mt-4">
            <Pagination page={page} total={totalCount} pageSize={pageSize} onChange={onPageChange} />
          </div>
        )}
      </div>
    </div>
  )
}
