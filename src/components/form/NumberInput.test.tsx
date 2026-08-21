import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('unit 없을 때 ref가 input DOM을 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('unit 있을 때도 ref가 input DOM을 가리킨다', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} unit="kg" aria-label="무게" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('unit 텍스트를 표시한다', () => {
    render(<NumberInput unit="kg" aria-label="무게" />)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })
})
