import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <p className="text-sm mb-2">위 섹션</p>
      <Divider />
      <p className="text-sm mt-2">아래 섹션</p>
    </div>
  ),
}
