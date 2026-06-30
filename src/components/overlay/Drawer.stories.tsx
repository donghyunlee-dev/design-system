import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Drawer> = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: '메뉴' },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Right: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>오른쪽 드로어</Button>
        <Drawer {...args} side="right" open={open} onClose={() => setOpen(false)}>
          <p className="text-sm">드로어 내용입니다.</p>
        </Drawer>
      </div>
    )
  },
}

export const Left: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>왼쪽 드로어</Button>
        <Drawer {...args} side="left" open={open} onClose={() => setOpen(false)}>
          <p className="text-sm">드로어 내용입니다.</p>
        </Drawer>
      </div>
    )
  },
}
