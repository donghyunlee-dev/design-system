import { render, screen } from '@testing-library/react'
import { SearchFilter } from './SearchFilter'

describe('SearchFilter', () => {
  it('renders the query, filters, query actions, and active filters in keyboard order', () => {
    render(
      <SearchFilter
        ariaLabel="사용자 목록 검색"
        search={<input aria-label="이름 또는 이메일 검색" />}
        filters={<button type="button">상태 필터</button>}
        actions={<button type="button">조회</button>}
        activeFilters={<button type="button">상태: 활성 해제</button>}
      />
    )

    const region = screen.getByRole('search', { name: '사용자 목록 검색' })
    const search = screen.getByRole('textbox', { name: '이름 또는 이메일 검색' })
    const filter = screen.getByRole('button', { name: '상태 필터' })
    const submit = screen.getByRole('button', { name: '조회' })
    const activeFilter = screen.getByRole('button', { name: '상태: 활성 해제' })

    expect(region).toContainElement(search)
    expect(search.compareDocumentPosition(filter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(filter.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(submit.compareDocumentPosition(activeFilter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(filter.parentElement).toHaveClass('sm:[&>*]:w-auto')
  })

  it('omits optional filter and action rows and allows the search to fill narrow containers', () => {
    render(<SearchFilter search={<input aria-label="검색어" />} />)

    const region = screen.getByRole('search', { name: '목록 검색 및 필터' })
    const search = screen.getByRole('textbox', { name: '검색어' })

    expect(region).toContainElement(search)
    expect(region.querySelectorAll('button')).toHaveLength(0)
    expect(search.parentElement).toHaveClass('w-full', 'min-w-0', 'sm:flex-1')
    expect(region.className).not.toContain('shadow')
  })

  it('supports filter-only pages without reserving an empty search column', () => {
    render(<SearchFilter filters={<button type="button">활성 상태</button>} />)

    const region = screen.getByRole('search', { name: '목록 검색 및 필터' })
    const filter = screen.getByRole('button', { name: '활성 상태' })

    expect(region).toContainElement(filter)
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(filter.parentElement).toHaveClass('w-full', 'min-w-0')
  })
})
