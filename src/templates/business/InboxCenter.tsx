import { ReactNode, useMemo, useState } from 'react'
import { Tag } from '../../components/data/Tag'
import { Avatar } from '../../components/foundation/Avatar'
import { EmptyState } from '../../components/feedback/EmptyState'
import { cn } from '../../utils/cn'

export interface InboxItem {
  id: string
  /** 발신 시스템/구분 (예: ERP 승인, 그룹웨어, 팀즈) */
  source: string
  title: string
  preview?: string
  time: string
  read: boolean
  actor?: { name: string; initials?: string }
  tags?: string[]
}

export interface InboxCenterProps {
  title?: string
  items: InboxItem[]
  onItemClick?: (item: InboxItem) => void
  onMarkAllRead?: () => void
  actions?: ReactNode
  className?: string
}

export function InboxCenter({
  title = '알림함',
  items,
  onItemClick,
  onMarkAllRead,
  actions,
  className,
}: InboxCenterProps) {
  const [tab, setTab] = useState<'all' | 'unread'>('all')

  const unreadCount = items.filter(item => !item.read).length
  const visible = useMemo(
    () => (tab === 'unread' ? items.filter(item => !item.read) : items),
    [items, tab]
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-3xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-danger text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onMarkAllRead && unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-sm text-brand hover:underline"
              >
                모두 읽음으로 표시
              </button>
            )}
            {actions}
          </div>
        </div>

        <div className="flex gap-1 mb-4 border-b border-border">
          {(['all', 'unread'] as const).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {key === 'all' ? '전체' : '안읽음'}
            </button>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card divide-y divide-border overflow-hidden">
          {visible.map(item => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'flex items-start gap-3 px-4 py-3',
                onItemClick && 'cursor-pointer hover:bg-surface-raised',
                !item.read && 'bg-brand-subtle/40'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                  item.read ? 'bg-transparent' : 'bg-brand'
                )}
                aria-hidden="true"
              />
              {item.actor && (
                <Avatar size="sm" initials={item.actor.initials} alt={item.actor.name} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag>{item.source}</Tag>
                  <p className={cn('text-sm truncate', item.read ? 'text-foreground' : 'font-semibold text-foreground')}>
                    {item.title}
                  </p>
                </div>
                {item.preview && (
                  <p className="text-xs text-muted mt-1 truncate">{item.preview}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted flex-shrink-0 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
          {visible.length === 0 && (
            <EmptyState title="알림이 없습니다" description="새로운 알림이 도착하면 이곳에 표시됩니다." />
          )}
        </div>
      </div>
    </div>
  )
}
