import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Avatar } from '../../components/foundation/Avatar'
import { Badge } from '../../components/foundation/Badge'
import { cn } from '../../utils/cn'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  tags?: string[]
  assignee?: { name: string; initials?: string }
  dueDate?: string
  /** 카드 좌측 강조 색상 */
  priority?: 'low' | 'medium' | 'high'
}

export interface KanbanColumn {
  id: string
  label: string
  cards: KanbanCard[]
}

export interface KanbanBoardProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  columns: KanbanColumn[]
  actions?: ReactNode
  onCardClick?: (card: KanbanCard, columnId: string) => void
  className?: string
}

const PRIORITY_BORDER: Record<NonNullable<KanbanCard['priority']>, string> = {
  low: 'border-l-muted',
  medium: 'border-l-warning',
  high: 'border-l-danger',
}

export function KanbanBoard({
  title,
  breadcrumb,
  columns,
  actions,
  onCardClick,
  className,
}: KanbanBoardProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-7xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {columns.map(col => (
            <div key={col.id} className="w-72 flex-shrink-0 bg-surface-subtle rounded-card p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                <span className="text-xs text-muted bg-surface border border-border rounded-full px-2 py-0.5">
                  {col.cards.length}
                </span>
              </div>
              <div className="space-y-2">
                {col.cards.map(card => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => onCardClick?.(card, col.id)}
                    className={cn(
                      'w-full text-left bg-surface border border-border border-l-4 rounded-card shadow-sm p-3 hover:shadow-card transition-shadow',
                      PRIORITY_BORDER[card.priority ?? 'low']
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{card.title}</p>
                    {card.description && (
                      <p className="text-xs text-muted mt-1 line-clamp-2">{card.description}</p>
                    )}
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.tags.map((tag, i) => (
                          <Badge key={i}>{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {card.dueDate ? (
                        <span className="text-xs text-muted">{card.dueDate}</span>
                      ) : <span />}
                      {card.assignee && (
                        <Avatar size="sm" initials={card.assignee.initials} alt={card.assignee.name} />
                      )}
                    </div>
                  </button>
                ))}
                {col.cards.length === 0 && (
                  <p className="text-xs text-muted text-center py-6">카드가 없습니다.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
