import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'search', size: 'sm' },
  parameters: { docs: { description: { component: "아이콘 이름과 크기, 색상을 전달해 기능을 식별합니다. 단독 아이콘 버튼에는 접근 가능한 이름을 제공합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Search: Story = {}
export const Comment: Story = { args: { name: 'comment' } }
export const AdminActions: Story = {
  render: () => (
    <div className="flex items-center gap-ws-4 text-secondary">
      <Icon name="settings" />
      <Icon name="sort" />
      <Icon name="filter" />
      <Icon name="grip" />
      <Icon name="close" />
      <Icon name="chevron-down" />
      <Icon name="chevron-right" />
      <Icon name="sidebar-close" size="md" />
      <Icon name="sidebar-open" size="md" />
    </div>
  ),
}
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-foreground">
      <Icon name="comment" size="xs" />
      <Icon name="comment" size="sm" />
      <Icon name="comment" size="md" />
    </div>
  ),
}
