import { render, screen } from '@testing-library/react'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('provides a named navigation landmark and marks the current destination', () => {
    render(<Sidebar label="관리 메뉴" items={[{ label: '대시보드', href: '/dashboard', active: true }, { label: '사용자', href: '/users' }]} />)
    const navigation = screen.getByRole('navigation', { name: '관리 메뉴' })
    expect(navigation).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '사용자' })).not.toHaveAttribute('aria-current')
  })

  it('renders links through an injected router adapter with navigation semantics intact', () => {
    render(
      <Sidebar
        items={[{ label: '대시보드', href: '/dashboard', active: true }]}
        renderLink={props => <a data-router-link href={props.href} className={props.className} aria-current={props['aria-current']}>{props.children}</a>}
      />
    )

    const link = screen.getByRole('link', { name: '대시보드' })
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', '/dashboard')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveClass('bg-brand-subtle')
  })
})
