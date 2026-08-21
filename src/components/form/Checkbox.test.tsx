import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('ref가 실제 checkbox input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="동의" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
