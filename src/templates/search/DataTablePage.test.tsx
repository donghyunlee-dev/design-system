import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTablePage } from './DataTablePage'

type Row = { id: number; name: string }

describe('DataTablePage search area', () => {
  it('keeps immediate query updates and filter selection inside the shared search region', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const onFilterChange = vi.fn()

    render(
      <DataTablePage<Row>
        title="사용자 목록"
        columns={[{ key: 'name', header: '이름' }]}
        data={[]}
        rowKey="id"
        onSearch={onSearch}
        filters={[{ key: 'status', label: '상태', options: [{ value: 'active', label: '활성' }] }]}
        onFilterChange={onFilterChange}
      />
    )

    const region = screen.getByRole('search', { name: '사용자 목록 검색 및 필터' })
    const input = screen.getByRole('searchbox', { name: '사용자 목록 검색' })
    expect(region).toContainElement(input)
    expect(region.closest('[style]')).toHaveStyle('--control-height-md: var(--admin-form-control-height)')

    await user.type(input, '운영')
    expect(onSearch).toHaveBeenLastCalledWith('운영')
    await user.click(screen.getByRole('button', { name: '활성' }))
    expect(onFilterChange).toHaveBeenCalledWith('status', 'active')
  })

  it('renders only filters when text search is not configured', () => {
    render(
      <DataTablePage<Row>
        title="사용자 목록"
        columns={[{ key: 'name', header: '이름' }]}
        data={[]}
        rowKey="id"
        filters={[{ key: 'status', label: '상태', options: [{ value: 'active', label: '활성' }] }]}
      />
    )

    expect(screen.getByRole('search', { name: '사용자 목록 검색 및 필터' })).toContainElement(
      screen.getByRole('button', { name: '활성' })
    )
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })
})
