import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Modal } from './Modal'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { title: '확인', children: '계속 진행하시겠습니까?' },
  parameters: { layout: 'centered', docs: { description: { component: "집중이 필요한 콘텐츠나 입력을 화면 위에 표시합니다. 명확한 트리거와 닫기 동작을 제공합니다." } }},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }))
    await expect(canvas.getByRole('heading', { name: '확인' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: '닫기' }))
    await expect(canvas.queryByRole('heading', { name: '확인' })).not.toBeInTheDocument()
  },
}

export const EscapeClose: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }))
    await expect(canvas.getByRole('heading', { name: '확인' })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('heading', { name: '확인' })).not.toBeInTheDocument()
  },
}

export const WithFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>삭제</Button>
            </>
          }
        />
      </>
    )
  },
}

export const Large: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>큰 모달 열기</Button>
        <Modal {...args} size="lg" open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
}
