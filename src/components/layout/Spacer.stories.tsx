import type { Meta, StoryObj } from '@storybook/react'
import { Spacer } from './Spacer'

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <div className="bg-gray-100 p-2 text-sm rounded">위 요소</div>
      <Spacer size={4} />
      <div className="bg-gray-100 p-2 text-sm rounded">아래 요소</div>
    </div>
  ),
}
