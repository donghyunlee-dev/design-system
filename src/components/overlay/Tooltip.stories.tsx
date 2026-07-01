import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
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

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args} content="툴팁 텍스트입니다.">
      <Button variant="secondary">hover me</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('button', { name: 'hover me' }))
    await expect(canvas.getByText('툴팁 텍스트입니다.')).toBeInTheDocument()
    await userEvent.unhover(canvas.getByRole('button', { name: 'hover me' }))
    await expect(canvas.queryByText('툴팁 텍스트입니다.')).not.toBeInTheDocument()
  },
}

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
