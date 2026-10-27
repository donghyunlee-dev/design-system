import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownMenu } from './DropdownMenu'

describe('DropdownMenu', () => {
  const items = [{ label: '수정', onClick: vi.fn() }]

  it('트리거 엘리먼트에 aria-haspopup과 aria-expanded를 주입한다', () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: '메뉴' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('키보드(Enter)로 열 수 있다', async () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: '메뉴' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('Escape로 닫히고 포커스가 트리거로 돌아온다', async () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: '메뉴' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('메뉴 열 때 첫 항목에 포커스하고 방향키로 항목을 이동한다', async () => {
    render(<DropdownMenu trigger={<button>메뉴</button>} items={[{ label: '수정', onClick: vi.fn() }, { label: '복제', onClick: vi.fn() }]} />)
    await userEvent.click(screen.getByRole('button', { name: '메뉴' }))
    const edit = screen.getByRole('menuitem', { name: '수정' })
    const duplicate = screen.getByRole('menuitem', { name: '복제' })
    expect(edit).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(duplicate).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(edit).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(duplicate).toHaveFocus()
  })
})
