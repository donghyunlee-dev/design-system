import { render, screen } from '@testing-library/react'
import { Card } from './Card'
import { ColorTag } from './ColorTag'
import { CommentThread } from './CommentThread'
import { Highlight } from './Highlight'
import { List } from './List'
import { MediaCard } from './MediaCard'
import { MediaCardHoverActions } from './MediaCardHoverActions'
import { Stat } from './Stat'
import { Tag } from './Tag'
import { UptimeHistoryStrip } from './UptimeHistoryStrip'

describe('Data component WindSoft tokens', () => {
  it('Card uses semantic padding and typography roles', () => {
    const { container } = render(<Card title="주문 개요" description="이번 달 주문 현황">내용</Card>)
    const card = container.firstElementChild
    expect(card).toHaveClass('rounded-card', 'bg-surface', 'border-border')
    expect(screen.getByText('주문 개요')).toHaveClass('text-section-title')
    expect(screen.getByText('이번 달 주문 현황')).toHaveClass('text-caption', 'text-secondary')
    expect(container.querySelector('[class~="p-ws-4"]')).toBeInTheDocument()
  })

  it('status tags use theme-aware subtle backgrounds and foregrounds', () => {
    render(<><ColorTag variant="success">완료</ColorTag><Tag>중립</Tag></>)
    expect(screen.getByText('완료')).toHaveClass('bg-success-subtle', 'text-success-foreground')
    expect(screen.getByText('중립')).toHaveClass('bg-surface-subtle', 'text-secondary', 'text-caption')
  })

  it('List uses semantic type and spacing while preserving long values', () => {
    const longLabel = 'WindSoft-very-long-resource-identifier-2026'
    render(<List items={[{ id: '1', primary: longLabel, secondary: '매우 긴 보조 설명' }]} />)
    expect(screen.getByText(longLabel)).toHaveClass('text-label', 'break-words')
    expect(screen.getByText('매우 긴 보조 설명')).toHaveClass('text-caption', 'break-words')
    expect(screen.getByRole('listitem')).toHaveClass('gap-ws-3', 'px-ws-4', 'py-ws-3')
  })

  it('Stat uses semantic hierarchy and status foreground roles', () => {
    render(<Stat label="월간 매출" value="₩42,000,000" change={{ value: '12%', trend: 'up' }} />)
    expect(screen.getByText('월간 매출')).toHaveClass('text-caption', 'text-secondary')
    expect(screen.getByText('₩42,000,000')).toHaveClass('text-page-title')
    expect(screen.getByText(/12%/)).toHaveClass('text-success-foreground')
  })

  it('MediaCard retains the image area and uses semantic content padding', () => {
    const { container } = render(<MediaCard title="리포트" description="요약" fallback={<span>미리보기</span>}>본문</MediaCard>)
    expect(screen.getByText('미리보기').parentElement).toHaveClass('h-[var(--spacing-2xl)]', 'bg-surface-overlay')
    expect(container.querySelector('[class~="p-ws-4"]')).toBeInTheDocument()
  })

  it('thread, highlight, uptime, and media action states use shared roles', () => {
    const { container } = render(
      <>
        <CommentThread comments={[]} emptyMessage="댓글이 없습니다" />
        <Highlight>검색어</Highlight>
        <UptimeHistoryStrip label="ERP" days={[{ date: '2026-10-01', status: 'outage' }]} />
        <MediaCardHoverActions actions={<button>복제</button>}><div>카드</div></MediaCardHoverActions>
      </>
    )
    expect(screen.getByRole('status')).toHaveClass('text-body', 'text-secondary')
    expect(screen.getByText('검색어').closest('mark')).toHaveClass('bg-warning-subtle', 'text-warning-foreground')
    expect(container.querySelector('[class~="h-ws-6"]')).toHaveClass('bg-danger')
    expect(container.querySelector('[class~="bg-inverse-surface/70"]')).toBeInTheDocument()
  })
})
