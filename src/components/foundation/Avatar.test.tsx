import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it.each([
    ['sm', 'size-8', 'text-caption'],
    ['md', 'size-10', 'text-label'],
    ['lg', 'size-12', 'text-body'],
  ] as const)('%s 크기는 WindSoft 아바타 스케일을 따른다', (size, dimensions, typography) => {
    render(<Avatar size={size} initials="WS" />)
    expect(screen.getByText('WS')).toHaveClass(dimensions, typography, 'rounded-full')
  })
})
