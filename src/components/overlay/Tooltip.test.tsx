import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('기존 aria-describedby를 툴팁 ID와 함께 유지한다', async () => {
    render(<Tooltip content="도움말"><button aria-describedby="help-description">정보</button></Tooltip>)
    await userEvent.hover(screen.getByRole('button', { name: '정보' }))
    const trigger = screen.getByRole('button', { name: '정보' })
    const ids = trigger.getAttribute('aria-describedby')?.split(' ')
    expect(ids).toContain('help-description')
    expect(ids).toContain(screen.getByRole('tooltip').id)
  })
  it('포커스 시 role=tooltip 콘텐츠를 표시한다', async () => {
    render(<Tooltip content="도움말"><button>대상</button></Tooltip>)
    await userEvent.tab()
    expect(screen.getByRole('tooltip')).toHaveTextContent('도움말')
  })

  it('포커스가 빠지면 사라진다', async () => {
    render(<Tooltip content="도움말"><button>대상</button></Tooltip>)
    await userEvent.tab()
    await userEvent.tab()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('포커스된 대상 엘리먼트 자체에 aria-describedby가 설정된다', async () => {
    const user = userEvent.setup()
    render(<Tooltip content="도움말"><button>대상</button></Tooltip>)
    await user.tab()
    const target = screen.getByRole('button', { name: '대상' })
    const tooltip = screen.getByRole('tooltip')
    expect(target).toHaveAttribute('aria-describedby', tooltip.id)
  })
})
