import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Radio } from './Radio'

describe('Radio', () => {
  it('ref가 실제 radio input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Radio ref={ref} label="선택 1" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('기본 라디오 크기와 WindSoft focus-visible 색을 사용한다', () => {
    render(<Radio label="옵션 A" />)
    expect(screen.getByRole('radio', { name: '옵션 A' })).toHaveClass(
      'size-4', 'accent-brand', 'focus-visible:ring-2', 'focus-visible:ring-brand'
    )
  })
})
