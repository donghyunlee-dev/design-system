import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Breadcrumb } from '../../components/navigation/Breadcrumb'
import { Navbar } from '../../components/navigation/Navbar'
import { Sidebar } from '../../components/navigation/Sidebar'
import type { NavigationLinkProps } from '../../components/navigation/NavigationLink'

const renderAppLink = ({ href, children, className, 'aria-current': ariaCurrent }: NavigationLinkProps) => (
  <a href={href} className={className} aria-current={ariaCurrent} data-app-link="true">
    {children}
  </a>
)

const meta: Meta = {
  title: 'Navigation/Router Integration',
  parameters: { layout: 'fullscreen', docs: { codePanel: true } },
}
export default meta
type Story = StoryObj<typeof meta>

export const SharedLinkAdapter: Story = {
  name: 'Shared Link Adapter',
  render: () => (
    <div className="min-h-screen bg-background">
      <Navbar logo="WindSoft" items={[
        { label: '대시보드', href: '/dashboard', active: true },
        { label: '사용자', href: '/users' },
      ]} renderLink={renderAppLink} />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar items={[
          { label: '대시보드', href: '/dashboard', active: true },
          { label: '사용자', href: '/users' },
        ]} renderLink={renderAppLink} />
        <main className="p-ws-6">
          <Breadcrumb items={[
            { label: '사용자', href: '/users' },
            { label: '계정 상세' },
          ]} renderLink={renderAppLink} />
          <h1 className="mt-ws-4 text-page-title">라우터 링크 어댑터</h1>
          <p className="mt-ws-2 text-body text-secondary">앱이 전달한 링크 렌더러가 세 탐색 컴포넌트에 적용됩니다.</p>
        </main>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('link').every(link => link.getAttribute('data-app-link') === 'true')).toBe(true)
  },
}
