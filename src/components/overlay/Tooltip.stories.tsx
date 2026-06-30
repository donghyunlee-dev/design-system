import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: '툴팁 내용', side: 'top' },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Top: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">마우스를 올려보세요</Button>
    </Tooltip>
  ),
}

export const Bottom: Story = {
  render: (args) => (
    <Tooltip {...args} side="bottom">
      <Button variant="secondary">Bottom</Button>
    </Tooltip>
  ),
}

export const Left: Story = {
  render: (args) => (
    <Tooltip {...args} side="left">
      <Button variant="secondary">Left</Button>
    </Tooltip>
  ),
}

export const Right: Story = {
  render: (args) => (
    <Tooltip {...args} side="right">
      <Button variant="secondary">Right</Button>
    </Tooltip>
  ),
}
