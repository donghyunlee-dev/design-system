import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Radio } from './Radio'

describe('Radio', () => {
  it('ref가 실제 radio input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Radio ref={ref} label="선택 1" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
