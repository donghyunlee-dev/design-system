import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: '홈', href: '/' },
      { label: '설정', href: '/settings' },
      { label: '프로필' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Short: Story = {
  args: { items: [{ label: '홈', href: '/' }, { label: '주문' }] },
}
