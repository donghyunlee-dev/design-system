import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders navbar items through an injected router adapter', () => {
    render(
      <Navbar
        items={[{ label: '사용자', href: '/users', active: true }]}
        renderLink={props => <a data-router-link href={props.href} className={props.className} aria-current={props['aria-current']}>{props.children}</a>}
      />
    )

    const link = screen.getByRole('link', { name: '사용자' })
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', '/users')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveClass('bg-brand-subtle')
  })
})
