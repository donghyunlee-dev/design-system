import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'search', size: 'sm' },
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
