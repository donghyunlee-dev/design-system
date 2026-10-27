import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from './Input'

describe('Input', () => {
  it('ref가 실제 input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('error일 때 danger 테두리 클래스를 적용한다', () => {
    render(<Input error placeholder="이름" />)
    expect(screen.getByPlaceholderText('이름')).toHaveClass('border-danger', 'focus-visible:ring-danger')
    expect(screen.getByPlaceholderText('이름')).toHaveAttribute('aria-invalid', 'true')
  })

  it('WindSoft 기본 높이, focus-visible, disabled surface를 사용한다', () => {
    render(<Input disabled aria-label="이름" />)
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveClass(
      'h-[var(--control-height-md)]', 'rounded-input', 'focus-visible:ring-2', 'disabled:bg-surface-subtle'
    )
  })
})
