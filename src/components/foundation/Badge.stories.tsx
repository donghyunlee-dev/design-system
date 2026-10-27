import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Foundation/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: '배지', variant: 'default' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Success: Story = { args: { variant: 'success', children: '완료' } }
export const Warning: Story = { args: { variant: 'warning', children: '주의' } }
export const Danger: Story = { args: { variant: 'danger', children: '오류' } }
export const Info: Story = { args: { variant: 'info', children: '안내' } }
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-ws-2">
      <Badge>기본</Badge>
      <Badge variant="success">완료</Badge>
      <Badge variant="warning">확인 필요</Badge>
      <Badge variant="danger">오류</Badge>
      <Badge variant="info">안내</Badge>
    </div>
  ),
}
