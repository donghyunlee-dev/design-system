import type { Meta, StoryObj } from '@storybook/react'
import { Spacer } from './Spacer'

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <div className="rounded-card bg-surface-raised p-ws-2 text-body">위 요소</div>
      <Spacer size={4} />
      <div className="rounded-card bg-surface-raised p-ws-2 text-body">아래 요소</div>
    </div>
  ),
}
