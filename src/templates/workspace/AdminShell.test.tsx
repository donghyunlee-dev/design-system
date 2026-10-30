import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdminShell } from './AdminShell'
import type { SidebarNestedItem } from '../../components/navigation/SidebarNested'

const items: SidebarNestedItem[] = [
  { key: 'overview', label: '대시보드', href: '/dashboard', active: true },
]

describe('AdminShell', () => {
  it('composes header, navigation, content, and optional footer slots', () => {
    render(
      <AdminShell logo={<span>WindSoft CI</span>} items={items} search={<div>검색 슬롯</div>} account={<div>계정 슬롯</div>} footer={<span>푸터</span>}>
        <h1>대시보드 콘텐츠</h1>
      </AdminShell>
    )

    expect(screen.getByText('WindSoft CI')).toBeInTheDocument()
    expect(screen.getByTestId('admin-shell-sidebar')).toHaveStyle({ width: '240px' })
    expect(screen.getByText('검색 슬롯')).toBeInTheDocument()
    expect(screen.getByText('계정 슬롯')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveClass('font-normal', 'before:inset-y-0', 'before:w-0.5', 'before:bg-brand', 'text-brand')
    expect(screen.getByRole('link', { name: '대시보드' })).not.toHaveClass('before:rounded-r-[4px]')
    expect(screen.getByRole('link', { name: '대시보드' })).not.toHaveClass('bg-brand-subtle')
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: '대시보드 콘텐츠' }))
    expect(screen.getByRole('main')).toHaveClass('overflow-y-auto')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('푸터')
    expect(screen.getByRole('contentinfo')).toHaveClass('mt-auto')
  })

  it('keeps the LNB toggle fixed at the left of the GNB while its state changes', async () => {
    const user = userEvent.setup()
    render(<AdminShell logo="CI" items={items}><div>내용</div></AdminShell>)

    const panel = screen.getByTestId('admin-shell-sidebar')
    const header = screen.getByRole('banner')
    const toggle = within(header).getByRole('button', { name: '메뉴 닫기' })
    expect(toggle).toBe(header.firstElementChild?.firstElementChild)
    expect(within(panel).queryByRole('button', { name: '메뉴 접기' })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(panel).toHaveAttribute('inert')
    expect(panel).toHaveStyle({ width: '0px' })

    expect(toggle).toHaveAccessibleName('메뉴 열기')
    await user.click(toggle)
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    expect(panel).not.toHaveAttribute('inert')
    expect(panel).toHaveStyle({ width: '240px' })
    expect(toggle).toHaveAccessibleName('메뉴 닫기')
  })

  it('resizes the LNB with pointer and keyboard controls within its bounds', () => {
    render(<AdminShell logo="CI" items={items} defaultSidebarWidth={240}><div>내용</div></AdminShell>)
    const handle = screen.getByRole('separator', { name: '메뉴 너비 조절' })
    const panel = screen.getByTestId('admin-shell-sidebar')

    fireEvent(handle, new MouseEvent('pointerdown', { bubbles: true, clientX: 240 }))
    fireEvent(handle, new MouseEvent('pointermove', { bubbles: true, clientX: 280 }))
    fireEvent(handle, new MouseEvent('pointerup', { bubbles: true }))
    expect(panel).toHaveStyle({ width: '280px' })

    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(panel).toHaveStyle({ width: '296px' })
    fireEvent.keyDown(handle, { key: 'Home' })
    expect(panel).toHaveStyle({ width: '240px' })
  })

  it('supports controlled collapse and router link rendering', async () => {
    const onSidebarCollapsedChange = vi.fn()
    const renderLink = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} data-router-link="true" {...props}>{children}</a>
    )
    render(
      <AdminShell logo="CI" items={items} sidebarCollapsed={false} onSidebarCollapsedChange={onSidebarCollapsedChange} renderLink={renderLink}>
        <div>내용</div>
      </AdminShell>
    )

    await userEvent.click(within(screen.getByRole('banner')).getByRole('button', { name: '메뉴 닫기' }))
    expect(onSidebarCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('data-router-link', 'true')
  })

  it('centers search in the header when no header menu is provided', () => {
    render(<AdminShell logo="CI" items={items} search={<div>전체 검색</div>}><div>내용</div></AdminShell>)

    expect(screen.getByTestId('admin-shell-search')).toHaveClass('justify-self-center')
  })

  it('keeps account actions in the right header column when search is omitted', () => {
    render(<AdminShell logo="CI" items={items} account={<span>계정 슬롯</span>}><div>내용</div></AdminShell>)

    expect(screen.getByText('계정 슬롯').parentElement).toHaveClass('col-start-3')
  })

  it('starts collapsed on compact screens and opens the LNB as an overlay', async () => {
    const user = userEvent.setup()
    const previousWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 })

    try {
      render(<AdminShell logo="CI" items={items}><div>내용</div></AdminShell>)
      const panel = screen.getByTestId('admin-shell-sidebar')
      expect(panel).toHaveAttribute('aria-hidden', 'true')

      await user.click(within(screen.getByRole('banner')).getByRole('button', { name: '메뉴 열기' }))
      expect(panel).toHaveAttribute('aria-hidden', 'false')
      expect(panel).toHaveClass('max-lg:absolute')
      expect(screen.getByRole('button', { name: '메뉴 배경 닫기' })).toBeInTheDocument()
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: previousWidth })
    }
  })
})
