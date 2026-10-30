import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdminTabbedWorkspace } from './AdminTabbedWorkspace'
import type { SidebarNestedItem } from '../../components/navigation/SidebarNested'

const menuItems: SidebarNestedItem[] = [
  { key: 'orders', label: '주문 관리', href: '/orders', active: true },
]

describe('AdminTabbedWorkspace', () => {
  it('renders AdminDetailPage data for the selected tab inside AdminShell', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const renderLink = ({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={href} {...props} />
    )

    render(
      <AdminTabbedWorkspace
        logo="WindSoft Admin"
        items={menuItems}
        account={<span>관리자 계정</span>}
        renderLink={renderLink}
        onValueChange={onValueChange}
        tabs={[
          {
            key: 'active',
            label: '진행 중',
            detailPage: {
              breadcrumb: [{ label: '주문', href: '/orders' }, { label: '진행 중' }],
              title: '진행 중 주문',
              searchValue: '',
              onSearchChange: () => {},
              columns: [{ key: 'name', header: '주문명' }],
              data: [{ id: 'order-1', name: '정기 구독' }],
              rowKey: 'id',
              pagination: { page: 1, total: 1, onChange: () => {} },
            },
          },
          {
            key: 'completed',
            label: '완료',
            detailPage: {
              breadcrumb: [{ label: '주문', href: '/orders' }, { label: '완료' }],
              title: '완료 주문',
              searchValue: '',
              onSearchChange: () => {},
              columns: [{ key: 'name', header: '주문명' }],
              data: [{ id: 'order-2', name: '추가 좌석 구매' }],
              rowKey: 'id',
              pagination: { page: 1, total: 1, onChange: () => {} },
            },
          },
        ]}
      />
    )

    expect(screen.getByText('WindSoft Admin')).toBeInTheDocument()
    expect(screen.getByText('관리자 계정')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '주문' })).toHaveAttribute('href', '/orders')
    expect(screen.getByRole('heading', { name: '진행 중 주문' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '정기 구독' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '완료 주문' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '완료' }))

    expect(onValueChange).toHaveBeenCalledWith('completed')
    expect(screen.getByRole('heading', { name: '완료 주문' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '추가 좌석 구매' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '진행 중 주문' })).not.toBeInTheDocument()
  })
})
