import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { DropdownMenu } from './DropdownMenu'
import { Button } from '../foundation/Button'

const ITEMS = [
  { label: '편집', onClick: () => {} },
  { label: '복사', onClick: () => {} },
  { label: '삭제', onClick: () => {}, danger: true },
]

const meta: Meta<typeof DropdownMenu> = {
  title: 'Overlay/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: { items: ITEMS },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args} trigger={<Button variant="secondary">메뉴 ▾</Button>} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '메뉴 ▾' }))
    await expect(canvas.getByText('편집')).toBeInTheDocument()
    await userEvent.click(canvas.getByText('편집'))
    await expect(canvas.queryByText('편집')).not.toBeInTheDocument()
  },
}
