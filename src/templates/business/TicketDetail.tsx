import { ReactNode, useState } from 'react'
import { Avatar } from '../../components/foundation/Avatar'
import { Button } from '../../components/foundation/Button'
import { StatusBadge, StatusVariant } from '../../components/foundation/StatusBadge'
import { Tag } from '../../components/data/Tag'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { Textarea } from '../../components/form/Textarea'
import { cn } from '../../utils/cn'

export interface TicketMessage {
  id: string
  author: { name: string; initials?: string }
  /** 상담원 등 내부 담당자가 남긴 메시지인지 여부 (강조 스타일 구분용) */
  isAgent?: boolean
  time: string
  content: string
}

export interface TicketDetailProps {
  ticketNo: string
  title: string
  status: StatusVariant
  statusLabel?: string
  requester: { name: string; initials?: string; meta?: string }
  assignee?: { name: string; initials?: string }
  /** SLA 등 부가 메타 태그 (예: "P1", "SLA 4시간 남음") */
  tags?: string[]
  messages: TicketMessage[]
  onSendReply?: (content: string) => void
  onStatusChange?: (status: string) => void
  statusActions?: { key: string; label: string }[]
  className?: string
  sidebarExtra?: ReactNode
}

export function TicketDetail({
  ticketNo,
  title,
  status,
  statusLabel,
  requester,
  assignee,
  tags,
  messages,
  onSendReply,
  onStatusChange,
  statusActions,
  className,
  sidebarExtra,
}: TicketDetailProps) {
  const [reply, setReply] = useState('')

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-5xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted mb-1">{ticketNo}</p>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          </div>
          <StatusBadge status={status} label={statusLabel} />
        </div>

        <div className="flex gap-6">
          {/* 대화 스레드 */}
          <div className="flex-1 min-w-0">
            <div className="bg-surface border border-border rounded-card shadow-card p-5">
              <Stack gap={4}>
                {messages.map((msg, i) => (
                  <div key={msg.id}>
                    <div className="flex items-start gap-3">
                      <Avatar size="sm" initials={msg.author.initials} alt={msg.author.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{msg.author.name}</p>
                          {msg.isAgent && <Tag>담당자</Tag>}
                          <span className="text-xs text-muted">{msg.time}</span>
                        </div>
                        <div
                          className={cn(
                            'mt-2 rounded-card px-3 py-2 text-sm text-foreground whitespace-pre-wrap',
                            msg.isAgent ? 'bg-brand-subtle' : 'bg-surface-subtle'
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                    {i < messages.length - 1 && <Divider className="mt-4" />}
                  </div>
                ))}
              </Stack>
            </div>

            {onSendReply && (
              <div className="bg-surface border border-border rounded-card shadow-card p-4 mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">답변 작성</h3>
                <Textarea
                  placeholder="답변 내용을 입력하세요"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    variant="primary"
                    onClick={() => { onSendReply(reply); setReply('') }}
                  >
                    답변 등록
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 사이드 정보 */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-surface border border-border rounded-card shadow-card p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">요청자</h3>
              <div className="flex items-center gap-2 mb-4">
                <Avatar size="sm" initials={requester.initials} alt={requester.name} />
                <div>
                  <p className="text-sm font-medium text-foreground">{requester.name}</p>
                  {requester.meta && <p className="text-xs text-muted">{requester.meta}</p>}
                </div>
              </div>

              {assignee && (
                <>
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">담당자</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar size="sm" initials={assignee.initials} alt={assignee.name} />
                    <p className="text-sm font-medium text-foreground">{assignee.name}</p>
                  </div>
                </>
              )}

              {tags && tags.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">태그</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                </>
              )}

              {statusActions && statusActions.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">상태 변경</h3>
                  <div className="flex flex-col gap-2">
                    {statusActions.map(action => (
                      <Button
                        key={action.key}
                        variant="secondary"
                        size="sm"
                        onClick={() => onStatusChange?.(action.key)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {sidebarExtra}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
