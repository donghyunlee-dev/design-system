import { render, screen } from '@testing-library/react'
import { CommandPalette } from './CommandPalette'

const groups = [{ key: 'g1', label: '빠른 이동', items: [{ id: 'i1', label: '설정으로 이동', onSelect: vi.fn() }] }]

describe('CommandPalette', () => {
  it('role=dialog와 aria-modal을 렌더링한다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('검색 입력에 포커스가 이동한다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('결과 목록이 listbox/option 역할을 갖는다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /설정으로 이동/ })).toBeInTheDocument()
  })

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<CommandPalette open onClose={vi.fn()} groups={groups} />)
    expect(document.body.style.overflow).toBe('hidden')
  })
})
