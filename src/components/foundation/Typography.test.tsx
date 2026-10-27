import { render, screen } from '@testing-library/react'
import { Typography } from './Typography'

describe('Typography', () => {
  it.each([
    ['h1', 1, 'text-page-title'],
    ['h2', 2, 'text-section-title'],
    ['h3', 3, 'text-body'],
    ['h4', 4, 'text-label'],
  ] as const)('%s variant는 올바른 heading 구조와 역할 스타일을 제공한다', (variant, level, roleClass) => {
    render(<Typography variant={variant}>업무 현황</Typography>)
    expect(screen.getByRole('heading', { level, name: '업무 현황' })).toHaveClass(roleClass)
  })

  it('본문, 보조 본문, 캡션을 의미 역할로 렌더링한다', () => {
    const { rerender } = render(<Typography variant="body">본문</Typography>)
    expect(screen.getByText('본문')).toHaveClass('text-body', 'text-foreground')

    rerender(<Typography variant="body-sm">보조 본문</Typography>)
    expect(screen.getByText('보조 본문')).toHaveClass('text-body', 'text-secondary')

    rerender(<Typography variant="caption">캡션</Typography>)
    expect(screen.getByText('캡션')).toHaveClass('text-caption', 'text-secondary')
  })
})
