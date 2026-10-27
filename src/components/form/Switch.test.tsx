import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('ref가 실제 button DOM 엘리먼트를 가리킨다', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch ref={ref} checked={false} onChange={() => {}} label="알림" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('id 등 추가 HTML 속성을 전달할 수 있다', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch ref={ref} checked={false} onChange={() => {}} id="notif-switch" label="알림" />)
    expect(ref.current).toHaveAttribute('id', 'notif-switch')
  })

  it('컴팩트 크기를 유지하며 keyboard focus-visible을 보여준다', () => {
    render(<Switch checked={false} onChange={() => {}} label="알림" />)
    expect(screen.getByRole('switch', { name: '알림' })).toHaveClass(
      'h-5', 'w-9', 'focus-visible:ring-2', 'focus-visible:ring-brand'
    )
  })
})
