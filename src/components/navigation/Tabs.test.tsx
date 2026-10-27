import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from './Tabs'

const items = [
  { key: 'overview', label: '개요', content: <p>요약 패널</p> },
  { key: 'settings', label: '설정', content: <p>설정 패널</p> },
  { key: 'logs', label: '로그', content: <p>로그 패널</p> },
]

describe('Tabs', () => {
  it('tablist, selected tab, and labelled tabpanel are connected', () => {
    render(<Tabs items={items} label="작업 상세" />)
    expect(screen.getByRole('tablist', { name: '작업 상세' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '개요' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: '설정' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: '개요' })).toHaveTextContent('요약 패널')
  })

  it('Arrow, Home, and End move focus and selection together', async () => {
    render(<Tabs items={items} />)
    const overview = screen.getByRole('tab', { name: '개요' })
    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: '설정' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: '설정' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('tab', { name: '로그' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(overview).toHaveFocus()
    expect(overview).toHaveAttribute('aria-selected', 'true')
  })
})
