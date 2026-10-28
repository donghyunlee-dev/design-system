import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders parent links through an injected router adapter', () => {
    render(
      <Breadcrumb
        items={[{ label: '사용자', href: '/users' }, { label: '상세' }]}
        renderLink={props => <a data-router-link href={props.href} className={props.className} aria-current={props['aria-current']}>{props.children}</a>}
      />
    )

    const link = screen.getByRole('link', { name: '사용자' })
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', '/users')
    expect(screen.getByText('>')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByText('/')).not.toBeInTheDocument()
    expect(screen.getByText('상세')).toHaveAttribute('aria-current', 'page')
  })
})
