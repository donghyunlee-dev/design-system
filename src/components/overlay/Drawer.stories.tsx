import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Drawer } from './Drawer'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Drawer> = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: '메뉴' },
  parameters: { layout: 'fullscreen', docs: { description: { component: "화면 가장자리에서 보조 패널을 엽니다. 작은 화면에서도 내용이 잘리지 않게 구성합니다." } }},
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
    await userEvent.click(canvas.getByRole('button', { name: '닫기' }))
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

export const OpenPreview: Story = {
  name: 'Open Preview',
  render: args => (
    <Drawer {...args} open onClose={() => {}} title="사용자 상세 정보" side="right">
      <div className="space-y-ws-5">
        <div>
          <p className="text-caption text-secondary">계정 정보</p>
          <p className="mt-ws-1 text-section-title font-semibold text-foreground">김민수</p>
          <p className="mt-ws-1 text-body text-secondary">minsu@windsoft.example</p>
        </div>
        <div className="border-t border-border pt-ws-4">
          <p className="text-caption text-secondary">권한</p>
          <p className="mt-ws-1 text-body text-foreground">시스템 관리자</p>
        </div>
        <div className="border-t border-border pt-ws-4">
          <p className="text-caption text-secondary">상태</p>
          <p className="mt-ws-1 text-body text-foreground">사용 중</p>
        </div>
      </div>
    </Drawer>
  ),
}
