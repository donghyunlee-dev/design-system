import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('ref가 실제 textarea DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('다중 행 입력은 기본 컨트롤 높이보다 넉넉한 토큰 최소 높이를 사용한다', () => {
    render(<Textarea aria-label="설명" />)
    expect(screen.getByRole('textbox', { name: '설명' })).toHaveClass(
      'min-h-[var(--textarea-min-height)]', 'rounded-input', 'focus-visible:ring-2'
    )
  })
})
