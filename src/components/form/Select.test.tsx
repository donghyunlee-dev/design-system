import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Select } from './Select'

describe('Select', () => {
  it('ref가 실제 select DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} options={[{ value: 'a', label: 'A' }]} />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('WindSoft 기본 높이, 테마형 focus, 오류 접근성 상태를 사용한다', () => {
    render(<Select aria-label="상태" error options={[{ value: 'active', label: '활성' }]} />)
    expect(screen.getByRole('combobox', { name: '상태' })).toHaveClass(
      'h-[var(--control-height-md)]', 'rounded-input', 'focus-visible:ring-2', 'focus-visible:ring-danger'
    )
    expect(screen.getByRole('combobox', { name: '상태' })).toHaveAttribute('aria-invalid', 'true')
  })
})
