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
  parameters: { docs: { description: { component: "현재 페이지까지의 상위 경로를 표시하고 상위 위치로 이동하게 합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Short: Story = {
  args: { items: [{ label: '홈', href: '/' }, { label: '주문' }] },
}
