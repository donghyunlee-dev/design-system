import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Sidebar } from './Sidebar'

const SIDEBAR_ITEMS = [
  { label: '대시보드', href: '#', active: true },
  { label: '주문 관리', href: '#' },
  { label: '상품 관리', href: '#' },
  { label: '고객 관리', href: '#' },
  { label: '설정', href: '#' },
]

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: { items: SIDEBAR_ITEMS },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('navigation', { name: '메인 메뉴' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: '대시보드' })).toHaveAttribute('aria-current', 'page')
  },
}
