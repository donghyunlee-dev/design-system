import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarNested } from './SidebarNested'
import type { SidebarNestedItem } from './SidebarNested'

const items: SidebarNestedItem[] = [
  {
    key: 'management',
    label: '관리',
    children: [
      { key: 'users', label: '사용자', href: '/users' },
      {
        key: 'catalog',
        label: '카탈로그',
        children: [{ key: 'products', label: '상품', href: '/products', active: true }],
      },
    ],
  },
  { key: 'dashboard', label: '대시보드', href: '/dashboard' },
]

const collapsedItems: SidebarNestedItem[] = [
  {
    key: 'management',
    label: '관리',
    children: [
      { key: 'users', label: '사용자', href: '/users' },
      { key: 'catalog', label: '카탈로그', children: [{ key: 'products', label: '상품', href: '/products' }] },
    ],
  },
  { key: 'dashboard', label: '대시보드', href: '/dashboard' },
]

describe('SidebarNested', () => {
  it('renders the nested navigation with collapsed child lists hidden', () => {
    render(<SidebarNested items={collapsedItems} label="관리 메뉴" />)

    const navigation = screen.getByRole('navigation', { name: '관리 메뉴' })
    expect(navigation).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '관리' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: '사용자' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '대시보드' })).toBeInTheDocument()
  })

  it('expands and collapses child links through the parent disclosure button', async () => {
    const user = userEvent.setup()
    render(<SidebarNested items={collapsedItems} />)

    const management = screen.getByRole('button', { name: '관리' })
    await user.click(management)
    expect(management).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: '사용자' })).toHaveAttribute('href', '/users')

    await user.click(management)
    expect(management).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: '사용자' })).not.toBeInTheDocument()
  })

  it('supports keyboard activation of disclosure buttons', async () => {
    const user = userEvent.setup()
    render(<SidebarNested items={collapsedItems} />)
    const management = screen.getByRole('button', { name: '관리' })

    management.focus()
    await user.keyboard('{Enter}')
    expect(management).toHaveAttribute('aria-expanded', 'true')
  })

  it('reveals active leaf ancestors and marks the leaf as the current page', () => {
    render(<SidebarNested items={items} />)

    expect(screen.getByRole('button', { name: '관리' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: '카탈로그' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: '상품' })).toHaveAttribute('aria-current', 'page')
  })

  it('reveals a newly active route when the items change', () => {
    const { rerender } = render(<SidebarNested items={[{ key: 'sales', label: '판매', children: [{ key: 'orders', label: '주문', href: '/orders' }] }]} />)
    expect(screen.queryByRole('link', { name: '주문' })).not.toBeInTheDocument()

    rerender(<SidebarNested items={[{ key: 'sales', label: '판매', children: [{ key: 'orders', label: '주문', href: '/orders', active: true }] }]} />)
    expect(screen.getByRole('link', { name: '주문' })).toHaveAttribute('aria-current', 'page')
  })

  it('reopens a collapsed ancestor when the active leaf changes within the same branch', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <SidebarNested items={[{ key: 'sales', label: '판매', children: [
        { key: 'orders', label: '주문', href: '/orders', active: true },
        { key: 'settlements', label: '정산', href: '/settlements' },
      ] }]} />
    )
    const sales = screen.getByRole('button', { name: '판매' })
    await user.click(sales)
    expect(sales).toHaveAttribute('aria-expanded', 'false')

    rerender(
      <SidebarNested items={[{ key: 'sales', label: '판매', children: [
        { key: 'orders', label: '주문', href: '/orders' },
        { key: 'settlements', label: '정산', href: '/settlements', active: true },
      ] }]} />
    )
    expect(screen.getByRole('button', { name: '판매' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: '정산' })).toHaveAttribute('aria-current', 'page')
  })

  it('uses the shared router adapter for leaf links and preserves WindSoft hover and active styles', async () => {
    const renderLink = vi.fn(({ href, children, className, 'aria-current': ariaCurrent }) => (
      <a data-router-link href={href} className={className} aria-current={ariaCurrent}>{children}</a>
    ))
    render(<SidebarNested items={items} renderLink={renderLink} />)

    const usersLink = screen.getByRole('link', { name: '사용자' })
    expect(usersLink).toHaveAttribute('data-router-link')
    expect(usersLink).toHaveAttribute('href', '/users')
    expect(usersLink).toHaveClass('hover:bg-surface-raised')

    const catalog = screen.getByRole('button', { name: '카탈로그' })
    expect(catalog).toHaveAttribute('aria-controls')
    const productsLink = screen.getByRole('link', { name: '상품' })
    expect(productsLink).toHaveClass('bg-brand-subtle', 'text-brand')
    expect(within(screen.getByRole('navigation')).getByRole('link', { name: '상품' })).toBe(productsLink)
    expect(renderLink).toHaveBeenCalledWith(expect.objectContaining({ href: '/products', 'aria-current': 'page' }))
  })

  it('opens requested groups by default', () => {
    render(<SidebarNested items={items} defaultExpandedKeys={['management']} />)
    expect(screen.getByRole('button', { name: '관리' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: '사용자' })).toBeInTheDocument()
  })

  it('renders an empty-children item as a link, not an empty disclosure button', () => {
    render(<SidebarNested items={[{ key: 'reports', label: '보고서', href: '/reports', children: [] }]} />)
    expect(screen.getByRole('link', { name: '보고서' })).toHaveAttribute('href', '/reports')
    expect(screen.queryByRole('button', { name: '보고서' })).not.toBeInTheDocument()
  })

  it('uses safe disclosure ids and truncates long labels at deeper levels', () => {
    render(<SidebarNested items={[{
      key: 'special key/1',
      label: '매우 긴 첫 번째 그룹 이름',
      children: [{
        key: 'second',
        label: '매우 긴 두 번째 그룹 이름',
        children: [{ key: 'leaf', label: '매우 긴 최종 메뉴 이름', href: '/deep', active: true }],
      }],
    }]} />)

    const firstGroup = screen.getByRole('button', { name: '매우 긴 첫 번째 그룹 이름' })
    const firstPanelId = firstGroup.getAttribute('aria-controls')
    expect(firstPanelId).toBeTruthy()
    expect(firstPanelId).not.toContain('special key/1')
    expect(document.getElementById(firstPanelId!)).toHaveAttribute('id', firstPanelId)
    expect(firstGroup.querySelector('span')).toHaveClass('truncate')
    expect(screen.getByRole('button', { name: '매우 긴 두 번째 그룹 이름' }).querySelector('span')).toHaveClass('truncate')
    expect(screen.getByRole('link', { name: '매우 긴 최종 메뉴 이름' }).querySelector('span')).toHaveClass('truncate')
  })
})
