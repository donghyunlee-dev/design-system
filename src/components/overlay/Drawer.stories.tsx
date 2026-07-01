import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, userEvent, within } from '@storybook/test'
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

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>드로어 열기</Button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p className="text-sm">드로어 콘텐츠입니다.</p>
        </Drawer>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open drawer
    await userEvent.click(canvas.getByRole('button', { name: '드로어 열기' }))
    // Verify heading is in DOM
    const heading = canvas.getByRole('heading', { name: '메뉴' })
    await expect(heading).toBeInTheDocument()
    // Close drawer
    await userEvent.click(canvas.getByRole('button', { name: '✕' }))
    // Drawer panel stays in DOM — verify it is translated off-screen (right side default)
    const panel = canvasElement.querySelector('div.fixed.top-0') as HTMLElement
    await expect(panel).toHaveClass('translate-x-full')
  },
}

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
