import type { Meta, StoryObj } from '@storybook/react'
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
}
