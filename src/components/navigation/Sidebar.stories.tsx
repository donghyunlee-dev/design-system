import type { Meta, StoryObj } from '@storybook/react'
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

export const Default: Story = {}
