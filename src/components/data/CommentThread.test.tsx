import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { CommentThread, type Comment } from './CommentThread'

const comments: Comment[] = [
  { id: 'c1', author: { name: '김철수', initials: '김' }, time: '2026-08-22 09:00', body: '질문 있습니다.' },
]

describe('CommentThread', () => {
  it('댓글 목록을 렌더링한다', () => {
    render(<CommentThread comments={comments} />)
    expect(screen.getByText('김철수')).toBeInTheDocument()
    expect(screen.getByText('질문 있습니다.')).toBeInTheDocument()
  })

  it('댓글이 없으면 빈 상태 메시지를 표시한다', () => {
    render(<CommentThread comments={[]} />)
    expect(screen.getByText('아직 댓글이 없습니다.')).toBeInTheDocument()
  })

  it('새 댓글을 제출하면 onSubmit이 호출된다', () => {
    const onSubmit = vi.fn()
    render(<CommentThread comments={[]} onSubmit={onSubmit} />)
    fireEvent.change(screen.getByPlaceholderText('댓글을 입력하세요'), { target: { value: '새 댓글' } })
    fireEvent.click(screen.getByRole('button', { name: '댓글 등록' }))
    expect(onSubmit).toHaveBeenCalledWith('새 댓글')
  })

  it('답글 버튼을 누르면 답글 입력창이 나타나고 onReply가 호출된다', () => {
    const onReply = vi.fn()
    render(<CommentThread comments={comments} onReply={onReply} />)
    fireEvent.click(screen.getByRole('button', { name: '답글' }))
    fireEvent.change(screen.getByPlaceholderText('답글을 입력하세요'), { target: { value: '답글 내용' } })
    fireEvent.click(screen.getByRole('button', { name: '답글 등록' }))
    expect(onReply).toHaveBeenCalledWith('c1', '답글 내용')
  })
})
