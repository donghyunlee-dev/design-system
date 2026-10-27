import { render, screen } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('현재 페이지가 시맨틱 브랜드 전경색을 사용한다', () => {
    render(<Pagination page={1} total={30} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: '1' })).toHaveClass('text-on-brand')
  })
})
