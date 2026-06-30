import type { Meta, StoryObj } from '@storybook/react'
import { Popover } from './Popover'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {},
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Popover
      {...args}
      trigger={<Button variant="secondary">클릭</Button>}
    >
      <p className="text-sm">팝오버 내용입니다.</p>
    </Popover>
  ),
}
