import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CommentThread, type Comment } from './CommentThread'

const meta: Meta<typeof CommentThread> = {
  title: 'Data/CommentThread',
  component: CommentThread,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: "댓글과 답글을 계층적으로 표시하고 새 댓글 작성 흐름을 제공합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

const initialComments: Comment[] = [
  {
    id: 'c1',
    author: { name: '김철수', initials: '김' },
    time: '2026-08-21 14:02',
    body: '결재 상신 전에는 품목 수정이 가능한가요? 화면에서는 잠긴 것처럼 보여요.',
    replies: [
      {
        id: 'c1-r1',
        author: { name: 'IT팀', initials: 'IT' },
        time: '2026-08-21 15:10',
        body: '네, 결재 시작 전(기안 상태)에는 자유롭게 수정하실 수 있습니다. 결재선이 생성된 이후에는 반려 요청이 필요합니다.',
      },
    ],
  },
  {
    id: 'c2',
    author: { name: '이영희', initials: '이' },
    time: '2026-08-22 09:15',
    body: '설명 감사합니다. 스크린샷도 함께 있으면 더 이해하기 쉬울 것 같아요.',
  },
]

export const Default: Story = {
  render: () => <div className="min-h-[400px] bg-background p-ws-4 text-foreground"><CommentThread comments={initialComments} /></div>,
}

export const Interactive: Story = {
  name: '작성 및 답글 (Interactive)',
  render: () => {
    const [comments, setComments] = useState<Comment[]>(initialComments)

    const handleSubmit = (body: string) => {
      setComments(prev => [
        ...prev,
        { id: `c-${Date.now()}`, author: { name: '이동현', initials: '이' }, time: '방금 전', body },
      ])
    }

    const handleReply = (commentId: string, body: string) => {
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? {
                ...c,
                replies: [
                  ...(c.replies ?? []),
                  { id: `${commentId}-r-${Date.now()}`, author: { name: '이동현', initials: '이' }, time: '방금 전', body },
                ],
              }
            : c
        )
      )
    }

    return <div className="min-h-[400px] bg-background p-ws-4 text-foreground"><CommentThread comments={comments} onSubmit={handleSubmit} onReply={handleReply} /></div>
  },
}

export const Empty: Story = {
  name: '댓글 없음',
  render: () => <div className="min-h-[400px] bg-background p-ws-4 text-foreground"><CommentThread comments={[]} onSubmit={() => {}} /></div>,
}
