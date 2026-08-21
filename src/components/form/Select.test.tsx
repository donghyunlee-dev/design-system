import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Select } from './Select'

describe('Select', () => {
  it('ref가 실제 select DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} options={[{ value: 'a', label: 'A' }]} />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })
})
