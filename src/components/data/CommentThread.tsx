import { FormEvent, useState } from 'react'
import { Avatar } from '../foundation/Avatar'
import { Button } from '../foundation/Button'
import { Textarea } from '../form/Textarea'
import { cn } from '../../utils/cn'

/**
 * 댓글/토론 스레드에 표시되는 개별 댓글 항목.
 * replies를 지정하면 한 단계 depth로 대댓글을 표시합니다.
 */
export interface Comment {
  id: string
  author: { name: string; initials?: string; avatarUrl?: string }
  /** "2026-08-22 10:32" 등 표시용 시각 */
  time: string
  body: string
  replies?: Comment[]
}

export interface CommentThreadProps {
  comments: Comment[]
  /** 새 댓글 작성 입력창을 노출할지 여부 (기본 true) */
  showComposer?: boolean
  composerPlaceholder?: string
  /** 댓글 등록 버튼 라벨 */
  submitLabel?: string
  /** 새 댓글 제출 콜백. 지정하지 않으면 입력창을 숨깁니다. */
  onSubmit?: (body: string) => void
  /** 각 댓글의 답글 버튼 클릭 콜백. 지정하지 않으면 답글 버튼을 숨깁니다. */
  onReply?: (commentId: string, body: string) => void
  emptyMessage?: string
  className?: string
}

function CommentItem({
  comment,
  depth,
  onReply,
}: {
  comment: Comment
  depth: number
  onReply?: (commentId: string, body: string) => void
}) {
  const [replying, setReplying] = useState(false)
  const [replyBody, setReplyBody] = useState('')

  const handleReplySubmit = () => {
    if (!replyBody.trim()) return
    onReply?.(comment.id, replyBody.trim())
    setReplyBody('')
    setReplying(false)
  }

  return (
    <div className={cn(depth > 0 && 'ml-10 mt-4')}>
      <div className="flex gap-3">
        <Avatar size="sm" src={comment.author.avatarUrl} initials={comment.author.initials} alt={comment.author.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
            <span className="text-xs text-muted">{comment.time}</span>
          </div>
          <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{comment.body}</p>
          {onReply && (
            <button
              type="button"
              onClick={() => setReplying(v => !v)}
              className="text-xs text-muted hover:text-brand transition-colors mt-1.5"
            >
              답글
            </button>
          )}
          {replying && (
            <div className="mt-2 space-y-2">
              <Textarea
                rows={2}
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                placeholder="답글을 입력하세요"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setReplying(false); setReplyBody('') }}>취소</Button>
                <Button variant="secondary" size="sm" onClick={handleReplySubmit}>답글 등록</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 사용자 댓글 및 대댓글 토론 스레드 컴포넌트.
 * 문서/게시글 하단에 배치해 단순 도움됨 여부를 넘어선 자유 형식 피드백을 수집할 때 사용합니다.
 */
export function CommentThread({
  comments,
  showComposer = true,
  composerPlaceholder = '댓글을 입력하세요',
  submitLabel = '댓글 등록',
  onSubmit,
  onReply,
  emptyMessage = '아직 댓글이 없습니다.',
  className,
}: CommentThreadProps) {
  const [body, setBody] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    onSubmit?.(body.trim())
    setBody('')
  }

  return (
    <div className={cn('space-y-5', className)}>
      {showComposer && onSubmit && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            rows={3}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={composerPlaceholder}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm">{submitLabel}</Button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted text-center py-6">{emptyMessage}</p>
      ) : (
        <div className="space-y-5">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} depth={0} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  )
}
