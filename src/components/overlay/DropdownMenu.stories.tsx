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
  parameters: { layout: 'centered', docs: { description: { component: "트리거에서 관련 작업 목록을 엽니다. 각 항목을 실제 동작과 연결합니다." } }},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args} trigger={<Button variant="secondary">메뉴 ▾</Button>} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: '메뉴 ▾' })
    await userEvent.click(trigger)
    await expect(canvas.getByRole('menuitem', { name: '편집' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('menuitem', { name: '복사' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await expect(canvas.getByText('편집')).toBeInTheDocument()
    await userEvent.click(canvas.getByText('편집'))
    await expect(canvas.queryByText('편집')).not.toBeInTheDocument()
  },
}
