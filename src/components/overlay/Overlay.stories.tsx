import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Drawer } from './Drawer'
import { Tooltip } from './Tooltip'
import { DropdownMenu } from './DropdownMenu'
import { Button } from '../foundation/Button'

const meta: Meta = { title: 'Overlay/Modal' }
export default meta

export const ModalStory: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="확인" footer={<Button onClick={() => setOpen(false)}>닫기</Button>}>
          모달 내용입니다.
        </Modal>
      </>
    )
  },
}

export const DrawerStory: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>드로어 열기</Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="설정">드로어 내용입니다.</Drawer>
      </>
    )
  },
}

export const TooltipStory: StoryObj = {
  render: () => (
    <Tooltip content="도움말 텍스트"><Button variant="secondary">호버하세요</Button></Tooltip>
  ),
}

export const DropdownStory: StoryObj = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">메뉴 ▾</Button>}
      items={[
        { label: '편집', onClick: () => {} },
        { label: '복사', onClick: () => {} },
        { label: '삭제', onClick: () => {}, danger: true, divider: true },
      ]}
    />
  ),
}
