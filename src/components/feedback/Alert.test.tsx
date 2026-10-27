import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('상태별 semantic surface와 foreground 토큰을 사용한다', () => {
    render(<Alert variant="warning" title="주의">확인하세요</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-warning-subtle', 'text-warning-foreground')
    expect(alert).toHaveTextContent('주의')
    expect(alert).toHaveTextContent('확인하세요')
  })
})
