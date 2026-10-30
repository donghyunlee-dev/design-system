import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardFull } from './analytics/DashboardFull'
import { EntitySearchExplorer } from './search/EntitySearchExplorer'
import { GlobalSearchResults } from './search/GlobalSearchResults'
import { RolesPermissionsMatrix } from './settings/RolesPermissionsMatrix'

describe('consolidated templates', () => {
  it('uses the full chart width when a dashboard has one chart', () => {
    render(<DashboardFull title="Metrics" stats={[]} mainChart={<span>Primary chart</span>} />)

    expect(screen.getByText('Primary chart').parentElement).not.toHaveClass('lg:col-span-2')
  })

  it('renders an optional leading slot in global search results', () => {
    render(
      <GlobalSearchResults
        keyword="partner"
        groups={[{
          key: 'partners',
          label: 'Partners',
          items: [{ id: 'p1', title: 'Acme', leading: <span>Partner icon</span> }],
        }]}
      />
    )

    expect(screen.getByText('Partner icon')).toBeInTheDocument()
  })

  it('highlights the current keyword in entity results', () => {
    render(
      <EntitySearchExplorer
        keyword="acme"
        tabs={[{ key: 'partners', label: 'Partners', count: 1 }]}
        activeTab="partners"
        items={[{ id: 'p1', title: 'Acme Foods', description: 'Acme supplier' }]}
      />
    )

    expect(screen.getAllByText('Acme')).toHaveLength(2)
    expect(document.querySelectorAll('mark')).toHaveLength(2)
  })

  it('retains breadcrumb and role metadata in the canonical permission matrix', () => {
    render(
      <RolesPermissionsMatrix
        breadcrumb={[{ label: 'Settings', href: '/settings' }, { label: 'Permissions' }]}
        roles={[{ key: 'admin', label: 'Admin', meta: '3 members' }]}
        rows={[{ key: 'orders', label: 'View orders', group: 'OMS' }]}
        granted={{ 'orders:admin': true }}
      />
    )

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
    expect(screen.getByText('3 members')).toBeInTheDocument()
  })
})
