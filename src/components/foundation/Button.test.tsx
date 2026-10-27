import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
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

  it.each([
    ['sm', 'h-8'],
    ['md', 'h-10'],
    ['lg', 'h-12'],
  ] as const)('size=%s는 정해진 높이와 본문 역할 스타일을 사용한다', (size, heightClass) => {
    render(<Button size={size}>저장</Button>)
    expect(screen.getByRole('button')).toHaveClass(heightClass, 'rounded-btn', 'focus-visible:ring-2', 'text-on-brand')
    expect(screen.getByRole('button')).toHaveClass(size === 'sm' ? 'text-caption' : size === 'md' ? 'text-label' : 'text-body')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('%s variant가 제공된다', (variant) => {
    render(<Button variant={variant}>동작</Button>)
    expect(screen.getByRole('button', { name: '동작' })).toBeInTheDocument()
  })

  it('ref가 실제 button DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>저장</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
