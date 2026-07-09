import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'
import { Button } from '../foundation/Button'

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: { title: '데이터가 없습니다', description: '새 항목을 추가해보세요.' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcon: Story = {
  args: { icon: '📦' },
}

export const WithAction: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      icon="📋"
      title="주문이 없습니다"
      description="첫 번째 주문을 등록해보세요."
      action={<Button variant="primary">주문 추가</Button>}
    />
  ),
}
