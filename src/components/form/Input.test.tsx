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
    expect(screen.getByPlaceholderText('이름')).toHaveClass('border-danger')
  })
})
