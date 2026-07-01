import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('status=active일 때 기본 레이블 "활성" 표시', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('활성')).toBeInTheDocument()
  })

  it('label prop이 있으면 기본 레이블 대신 표시', () => {
    render(<StatusBadge status="active" label="생산중" />)
    expect(screen.getByText('생산중')).toBeInTheDocument()
    expect(screen.queryByText('활성')).not.toBeInTheDocument()
  })

  it('status=error일 때 bg-danger 클래스 dot 렌더링', () => {
    const { container } = render(<StatusBadge status="error" />)
    const dot = container.querySelector('.bg-danger')
    expect(dot).toBeInTheDocument()
  })

  it('status=inactive일 때 기본 레이블 "비활성"', () => {
    render(<StatusBadge status="inactive" />)
    expect(screen.getByText('비활성')).toBeInTheDocument()
  })

  it('status=pending일 때 기본 레이블 "대기중"', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('대기중')).toBeInTheDocument()
  })

  it('status=success일 때 기본 레이블 "완료"', () => {
    render(<StatusBadge status="success" />)
    expect(screen.getByText('완료')).toBeInTheDocument()
  })

  it('status=warning일 때 기본 레이블 "경고"', () => {
    render(<StatusBadge status="warning" />)
    expect(screen.getByText('경고')).toBeInTheDocument()
  })

  it('className prop이 적용된다', () => {
    const { container } = render(<StatusBadge status="active" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
