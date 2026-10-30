import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { AdminDataTabbedLayout } from './AdminDataTabbedLayout'
import type { AdminDataTabPage } from './AdminDataTabbedLayout'
import type { SidebarNestedItem } from '../../components/navigation/SidebarNested'

interface UserRow {
  id: number
  name: string
}

const items: SidebarNestedItem[] = [
  { key: 'dashboard', label: '대시보드', href: '/dashboard' },
  { key: 'users', label: '사용자 관리', href: '/users' },
]

function TestLayout() {
  const [activePath, setActivePath] = useState('/dashboard')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pages: AdminDataTabPage<UserRow>[] = [{
    href: '/users',
    detail: {
      breadcrumb: [{ label: '사용자 목록' }],
      title: '사용자 목록',
      searchValue: search,
      onSearchChange: setSearch,
      columns: [{ key: 'name', header: '이름' }],
      data: [{ id: 1, name: '김민수' }],
      rowKey: 'id',
      pagination: { page, total: 20, onChange: setPage },
    },
  }]

  return (
    <AdminDataTabbedLayout
      logo="관리자"
      items={items}
      pages={pages}
      homeHref="/dashboard"
      homeContent={<h1>대시보드</h1>}
      activePath={activePath}
      onNavigate={setActivePath}
      renderLink={({ href, children, ...props }) => <a href={href} {...props}>{children}</a>}
    />
  )
}

describe('AdminDataTabbedLayout', () => {
  it('combines the admin shell tabs with breadcrumb, toolbar, search, grid, and pagination detail pages', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))

    expect(screen.getByRole('tab', { name: '사용자 관리' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('navigation', { name: '경로' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '사용자 목록' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: '검색' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '김민수' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '페이지 탐색' })).toBeInTheDocument()
  })
})
