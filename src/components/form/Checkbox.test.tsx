import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('ref가 실제 checkbox input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="동의" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('기본 체크박스 크기와 WindSoft focus-visible 색을 사용한다', () => {
    render(<Checkbox label="알림 수신" />)
    expect(screen.getByRole('checkbox', { name: '알림 수신' })).toHaveClass(
      'size-4', 'accent-brand', 'focus-visible:ring-2', 'focus-visible:ring-brand'
    )
  })
})
