import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './Navbar'
import { Button } from '../foundation/Button'

const NAV_ITEMS = [
  { label: '대시보드', href: '#', active: true },
  { label: '주문', href: '#' },
  { label: '상품', href: '#' },
  { label: '설정', href: '#' },
]

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: { logo: 'SFOOD', items: NAV_ITEMS },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithActions: Story = {
  render: (args) => <Navbar {...args} actions={<Button size="sm">로그아웃</Button>} />,
}
