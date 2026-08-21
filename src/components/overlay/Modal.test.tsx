import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('role=dialog와 aria-modal을 렌더링한다', () => {
    render(<Modal open onClose={vi.fn()} title="제목">내용</Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('열리면 내부 첫 포커스 가능 요소로 포커스가 이동한다', () => {
    render(<Modal open onClose={vi.fn()}><button>확인</button></Modal>)
    expect(screen.getByRole('button', { name: '확인' })).toHaveFocus()
  })

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<Modal open onClose={vi.fn()}>내용</Modal>)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('Escape 키로 닫힌다', async () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}>내용</Modal>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('닫기 버튼에 접근성 레이블이 있다', () => {
    render(<Modal open onClose={vi.fn()} title="제목">내용</Modal>)
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument()
  })
})
