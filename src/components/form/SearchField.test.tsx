import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SearchField } from './SearchField'

describe('SearchField', () => {
  it('renders a labeled search input and forwards native props and ref', () => {
    const ref = createRef<HTMLInputElement>()

    render(<SearchField aria-label="사이트 검색" placeholder="검색어" name="query" ref={ref} />)

    const input = screen.getByRole('searchbox', { name: '사이트 검색' })
    expect(input).toHaveAttribute('placeholder', '검색어')
    expect(input).toHaveAttribute('name', 'query')
    expect(ref.current).toBe(input)
  })
})
