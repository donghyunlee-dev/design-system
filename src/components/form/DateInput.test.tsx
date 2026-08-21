import { render } from '@testing-library/react'
import { createRef } from 'react'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  it('ref가 실제 input DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('type=date로 렌더링된다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DateInput ref={ref} />)
    expect(ref.current).toHaveAttribute('type', 'date')
  })
})
