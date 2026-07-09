import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('텍스트를 렌더링한다', () => {
    render(<Button>저장</Button>)
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()
  })

  it('onClick이 호출된다', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>클릭</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled일 때 클릭이 막힌다', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>비활성</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('variant=danger 클래스가 적용된다', () => {
    render(<Button variant="danger">삭제</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-danger')
  })
})
