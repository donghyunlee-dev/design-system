import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
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
})
