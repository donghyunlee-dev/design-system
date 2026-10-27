import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it.each([
    ['default', 'bg-surface-overlay', 'text-secondary'],
    ['success', 'bg-success-subtle', 'text-success-foreground'],
    ['warning', 'bg-warning-subtle', 'text-warning-foreground'],
    ['danger', 'bg-danger-subtle', 'text-danger-foreground'],
    ['info', 'bg-info-subtle', 'text-info-foreground'],
  ] as const)('%s variant는 테마 의미 토큰과 통일된 배지 형태를 사용한다', (variant, background, foreground) => {
    render(<Badge variant={variant}>상태</Badge>)
    expect(screen.getByText('상태')).toHaveClass(background, foreground, 'rounded-badge')
  })
})
