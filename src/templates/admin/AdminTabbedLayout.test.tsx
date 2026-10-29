import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { AdminTabbedLayout } from './AdminTabbedLayout'
import type { AdminTabPage } from './AdminTabbedLayout'
import type { SidebarNestedItem } from '../../components/navigation/SidebarNested'

const items: SidebarNestedItem[] = [
  { key: 'dashboard', label: '대시보드', href: '/dashboard' },
  { key: 'users', label: '사용자 관리', href: '/users' },
  { key: 'roles', label: '권한 관리', href: '/roles' },
]

const pages: AdminTabPage[] = [
  { href: '/users', content: <input aria-label="사용자 검색 상태" defaultValue="검색 전" /> },
  { href: '/roles', content: <p>권한 페이지 내용</p> },
]

function TestLayout({ maxTabs = 8, onTabLimitReached = vi.fn() }: {
  maxTabs?: number
  onTabLimitReached?: (href: string, maxTabs: number) => void
}) {
  const [activePath, setActivePath] = useState('/dashboard')
  return (
    <AdminTabbedLayout
      logo="CI"
      items={items}
      pages={pages}
      homeHref="/dashboard"
      homeContent={<h1>관리자 대시보드</h1>}
      activePath={activePath}
      onNavigate={setActivePath}
      maxTabs={maxTabs}
      onTabLimitReached={onTabLimitReached}
      renderLink={({ href, children, ...props }) => <a href={href} {...props}>{children}</a>}
    />
  )
}

describe('AdminTabbedLayout', () => {
  it('keeps a fixed home tab first and navigates to the configured home path', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)

    const home = screen.getByRole('tab', { name: '홈' })
    expect(home).toHaveAttribute('aria-selected', 'true')
    expect(within(screen.getByRole('tablist')).getAllByRole('tab')[0]).toBe(home)
    expect(screen.getByRole('heading', { name: '관리자 대시보드' })).toBeInTheDocument()

    await user.click(home)
    expect(home).toHaveAttribute('aria-selected', 'true')
  })

  it('opens menu routes as deduplicated tabs and retains inactive page state', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    const usersTab = screen.getByRole('tab', { name: '사용자 관리' })
    expect(usersTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('link', { name: '사용자 관리' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('tabpanel', { name: '사용자 관리' })).toBeInTheDocument()

    const searchInput = screen.getByRole('textbox', { name: '사용자 검색 상태' })
    await user.clear(searchInput)
    await user.type(searchInput, '보존된 값')
    await user.click(screen.getByRole('link', { name: '권한 관리' }))
    expect(screen.getByText('권한 페이지 내용')).toBeVisible()
    await user.click(usersTab)
    expect(searchInput).toHaveValue('보존된 값')

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    expect(screen.getAllByRole('tab', { name: '사용자 관리' })).toHaveLength(1)
  })

  it('blocks navigation beyond maxTabs and reports the requested path', async () => {
    const user = userEvent.setup()
    const onTabLimitReached = vi.fn()
    render(<TestLayout maxTabs={1} onTabLimitReached={onTabLimitReached} />)

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    const rolesLink = screen.getByRole('link', { name: '권한 관리' })
    fireEvent.click(rolesLink)

    expect(onTabLimitReached).toHaveBeenCalledWith('/roles', 1)
    expect(screen.queryByRole('tab', { name: '권한 관리' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '사용자 관리' })).toHaveAttribute('aria-selected', 'true')
  })

  it('closes the selected tab and activates the tab on its left', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    await user.click(screen.getByRole('link', { name: '권한 관리' }))
    await user.click(screen.getByRole('button', { name: '권한 관리 탭 닫기' }))

    expect(screen.queryByRole('tab', { name: '권한 관리' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '사용자 관리' })).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '사용자 관리' }))
  })

  it('uses the right-clicked tab as the target for close-other and close-all actions', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    await user.click(screen.getByRole('link', { name: '권한 관리' }))
    fireEvent.contextMenu(screen.getByRole('tab', { name: '사용자 관리' }), { clientX: 90, clientY: 140 })
    await user.click(screen.getByRole('menuitem', { name: '선택한 탭 외 닫기' }))

    expect(screen.getByRole('tab', { name: '사용자 관리' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('tab', { name: '권한 관리' })).not.toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '사용자 관리' }))

    await user.click(screen.getByRole('link', { name: '권한 관리' }))
    fireEvent.contextMenu(screen.getByRole('tab', { name: '권한 관리' }), { clientX: 90, clientY: 140 })
    await user.click(screen.getByRole('menuitem', { name: '선택한 탭 닫기' }))
    expect(screen.queryByRole('tab', { name: '권한 관리' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '사용자 관리' })).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '사용자 관리' }))

    fireEvent.contextMenu(screen.getByRole('tab', { name: '사용자 관리' }), { clientX: 90, clientY: 140 })
    await user.click(screen.getByRole('menuitem', { name: '전체 탭 닫기' }))
    expect(screen.getByRole('tab', { name: '홈' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('tab', { name: '사용자 관리' })).not.toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '홈' }))
  })

  it('returns focus to the active tab when a background tab is closed', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)

    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    await user.click(screen.getByRole('link', { name: '권한 관리' }))
    const usersTab = screen.getByRole('tab', { name: '사용자 관리' })
    await user.click(usersTab)
    await user.click(screen.getByRole('button', { name: '권한 관리 탭 닫기' }))

    expect(document.activeElement).toBe(usersTab)
  })

  it('reorders tabs with the keyboard while keeping the home tab fixed first', async () => {
    const user = userEvent.setup()
    render(<TestLayout />)
    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    await user.click(screen.getByRole('link', { name: '권한 관리' }))

    const usersTab = screen.getByRole('tab', { name: '사용자 관리' })
    fireEvent.keyDown(usersTab, { key: 'ArrowRight', altKey: true, shiftKey: true })

    const tabs = within(screen.getByRole('tablist')).getAllByRole('tab')
    expect(tabs.map(tab => tab.getAttribute('aria-label'))).toEqual(['홈', '권한 관리', '사용자 관리'])
  })
})
