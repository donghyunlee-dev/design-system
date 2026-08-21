import { render } from '@testing-library/react'
import { createRef } from 'react'
import { DateTimePicker } from './DateTimePicker'

describe('DateTimePicker', () => {
  it('ref가 실제 input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateTimePicker ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('mode=datetime일 때 type=datetime-local로 렌더링된다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateTimePicker ref={ref} mode="datetime" />)
    expect(ref.current).toHaveAttribute('type', 'datetime-local')
  })
})
