import { render, screen } from '@testing-library/react'
import { ChipGroup } from './ChipGroup'

describe('ChipGroup', () => {
  it('선택된 항목이 시맨틱 브랜드 전경색을 사용한다', () => {
    render(<ChipGroup items={[{ id: 'all', label: '전체' }]} value="all" onChange={() => {}} />)

    expect(screen.getByRole('tab', { name: '전체' })).toHaveClass('text-on-brand')
  })
})
