import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginSimple } from './account/LoginSimple'
import { ReportLayout } from './analytics/ReportLayout'
import { MonitoringBoard } from './analytics/MonitoringBoard'
import { ApprovalView } from './workflows/ApprovalView'
import { InboxCenter } from './workflows/InboxCenter'

describe('theme-aware template colors', () => {
  it('uses semantic surfaces and text in reports', () => {
    const { container } = render(<ReportLayout title="월간 보고서" date="2026-10-30" />)

    expect(container.firstElementChild).toHaveClass('bg-background', 'text-foreground')
    expect(screen.getByRole('heading', { name: '월간 보고서' })).toHaveClass('text-foreground')
  })

  it('uses semantic surfaces and status colors in monitoring boards', () => {
    const { container } = render(
      <MonitoringBoard
        title="설비 모니터링"
        timestamp="09:00"
        kpis={[{ label: '가동률', value: 98, status: 'normal' }]}
        stations={[{ id: 'station-1', name: '설비 1', status: 'running' }]}
      />
    )

    expect(container.firstElementChild).toHaveClass('bg-background', 'text-foreground')
    expect(screen.getByText('가동률').parentElement).toHaveClass('bg-surface', 'border-border')
    expect(screen.getByText('가동중')).toHaveClass('text-success-foreground')
  })

  it('uses semantic status colors for login errors', () => {
    render(<LoginSimple onLogin={() => {}} error="로그인 실패" />)

    expect(screen.getByRole('alert')).toHaveClass('bg-danger-subtle', 'text-danger-foreground')
  })

  it('uses semantic status colors for approval badges', () => {
    render(<ApprovalView title="휴가 신청" status="approved" fields={[]} steps={[]} />)

    expect(screen.getByText('승인완료')).toHaveClass('bg-success-subtle', 'text-success-foreground')
  })

  it('uses semantic status colors for unread counts', () => {
    render(<InboxCenter items={[{ id: '1', source: 'ERP', title: '승인 요청', time: '09:00', read: false }]} />)

    expect(screen.getByText('1')).toHaveClass('bg-danger-subtle', 'text-danger-foreground')
  })
})
