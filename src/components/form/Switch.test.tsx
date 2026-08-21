import { render } from '@testing-library/react'
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
})
