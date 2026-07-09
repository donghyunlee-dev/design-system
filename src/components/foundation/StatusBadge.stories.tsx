import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from './StatusBadge'
import { Stack } from '../layout/Stack'

const meta: Meta<typeof StatusBadge> = {
  title: 'Foundation/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { status: 'active' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = { args: { status: 'active' } }
export const Inactive: Story = { args: { status: 'inactive' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Warning: Story = { args: { status: 'warning' } }
export const Error: Story = { args: { status: 'error' } }
export const Success: Story = { args: { status: 'success' } }

export const CustomLabel: Story = {
  args: { status: 'active', label: '생산중' },
}

export const AllVariants: Story = {
  render: () => (
    <Stack direction="col" gap={2}>
      <StatusBadge status="active" label="생산중" />
      <StatusBadge status="inactive" label="비활성" />
      <StatusBadge status="pending" label="대기중" />
      <StatusBadge status="warning" label="경고" />
      <StatusBadge status="error" label="오류" />
      <StatusBadge status="success" label="완료" />
    </Stack>
  ),
}
