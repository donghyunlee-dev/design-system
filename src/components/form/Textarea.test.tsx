import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('ref가 실제 textarea DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })
})
