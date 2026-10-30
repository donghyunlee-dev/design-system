import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminDetailPage } from './AdminDetailPage'

interface Order {
  id: number
  name: string
}

const columns = [{ key: 'name', header: '주문명' }]
const data: Order[] = [{ id: 1, name: '주문 #001' }]
const pagination = { page: 1, total: 30, pageSize: 10, onChange: vi.fn() }

describe('AdminDetailPage', () => {
  it('renders the path, title toolbar, search, grid, and pagination in order', () => {
    const { container } = render(
      <AdminDetailPage
        breadcrumb={[{ label: '주문 관리', href: '/orders' }, { label: '주문 상세' }]}
        renderLink={({ href, ...props }) => <a href={href} {...props} />}
        title="주문 상세"
        actions={<button type="button">주문 취소</button>}
        searchValue=""
        onSearchChange={() => {}}
        columns={columns}
        data={data}
        rowKey="id"
        pagination={pagination}
      />
    )

    expect(screen.getByRole('navigation', { name: '경로' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '주문 관리' })).toHaveAttribute('href', '/orders')
    expect(screen.getByRole('heading', { name: '주문 상세' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '주문 취소' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: '검색' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '주문 #001' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '페이지 탐색' })).toBeInTheDocument()

    const regions = [
      screen.getByRole('navigation', { name: '경로' }),
      screen.getByRole('heading', { name: '주문 상세' }),
      screen.getByRole('searchbox', { name: '검색' }),
      screen.getByRole('table'),
      screen.getByRole('navigation', { name: '페이지 탐색' }),
    ]
    expect(regions.every((element, index) => index === 0 || Boolean(regions[index - 1].compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true)
    expect(container.firstElementChild).toHaveClass('w-full', 'min-w-0')
  })

  it('forwards search and page changes to the caller', () => {
    const onSearchChange = vi.fn()
    const onPageChange = vi.fn()

    render(
      <AdminDetailPage
        breadcrumb={[{ label: '주문 상세' }]}
        title="주문 상세"
        searchValue=""
        onSearchChange={onSearchChange}
        columns={columns}
        data={data}
        rowKey="id"
        pagination={{ page: 1, total: 30, pageSize: 10, onChange: onPageChange }}
      />
    )

    fireEvent.change(screen.getByRole('searchbox', { name: '검색' }), { target: { value: '001' } })
    fireEvent.click(screen.getByRole('button', { name: '페이지 2' }))

    expect(onSearchChange).toHaveBeenCalledWith('001')
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('renders the table empty state and keeps pagination available when there are no rows', () => {
    render(
      <AdminDetailPage
        breadcrumb={[{ label: '주문 상세' }]}
        title="주문 상세"
        searchValue=""
        onSearchChange={() => {}}
        columns={columns}
        data={[]}
        rowKey="id"
        pagination={{ page: 1, total: 0, onChange: () => {} }}
      />
    )

    expect(screen.getByText('표시할 항목이 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '페이지 탐색' })).toBeInTheDocument()
  })
})
