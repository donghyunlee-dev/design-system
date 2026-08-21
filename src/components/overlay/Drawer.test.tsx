import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('role=dialog와 aria-modal을 렌더링한다', () => {
    render(<Drawer open onClose={vi.fn()} title="제목">내용</Drawer>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('Escape 키로 닫힌다', async () => {
    const onClose = vi.fn()
    render(<Drawer open onClose={onClose}>내용</Drawer>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<Drawer open onClose={vi.fn()}>내용</Drawer>)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('닫혀 있으면 aria-hidden이 true다', () => {
    render(<Drawer open={false} onClose={vi.fn()}>내용</Drawer>)
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
  })
})
