import { render, screen } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('현재 페이지가 시맨틱 브랜드 전경색을 사용한다', () => {
    render(<Pagination page={1} total={30} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveClass('text-on-brand')
    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('navigation', { name: '페이지 탐색' })).toBeInTheDocument()
  })

  it('이전/다음 버튼이 명확한 이름과 비활성 경계를 제공한다', () => {
    render(<Pagination page={1} total={30} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '다음 페이지' })).not.toBeDisabled()
  })

  it.each([
    ['sm', 'size-8'],
    ['md', 'size-10'],
    ['lg', 'size-12'],
  ] as const)('%s 크기가 페이지 버튼과 이동 버튼에 적용된다', (size, dimensionClass) => {
    render(<Pagination page={2} total={30} size={size} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: '페이지 2' })).toHaveClass(dimensionClass)
    expect(screen.getByRole('button', { name: '이전 페이지' })).toHaveClass(dimensionClass)
  })
})
