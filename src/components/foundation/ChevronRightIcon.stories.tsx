import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon } from './ChevronRightIcon'

const meta: Meta<typeof ChevronRightIcon> = {
  title: 'Foundation/ChevronRightIcon',
  component: ChevronRightIcon,
  tags: ['autodocs'],
  args: { size: 'sm' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-muted">
      <ChevronRightIcon size="xs" />
      <ChevronRightIcon size="sm" />
      <ChevronRightIcon size="md" />
    </div>
  ),
}
