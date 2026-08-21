import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover } from './Popover'

describe('Popover', () => {
  it('트리거 엘리먼트에 aria-haspopup과 aria-expanded를 주입한다', () => {
    render(<Popover trigger={<button>정보</button>}>내용</Popover>)
    const trigger = screen.getByRole('button', { name: '정보' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('키보드(Enter)로 열 수 있고 콘텐츠는 role=dialog다', async () => {
    render(<Popover trigger={<button>정보</button>}>상세 내용</Popover>)
    const trigger = screen.getByRole('button', { name: '정보' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('dialog')).toHaveTextContent('상세 내용')
  })

  it('Escape로 닫히고 포커스가 트리거로 돌아온다', async () => {
    render(<Popover trigger={<button>정보</button>}>상세 내용</Popover>)
    const trigger = screen.getByRole('button', { name: '정보' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
