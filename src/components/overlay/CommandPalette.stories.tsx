import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { CommandPalette, CommandGroup } from './CommandPalette'
import { Button } from '../foundation/Button'

const GROUPS: CommandGroup[] = [
  {
    key: 'nav',
    label: '빠른 이동',
    items: [
      { id: 'nav-orders', label: '주문 목록으로 이동', shortcut: 'G O', onSelect: () => {} },
      { id: 'nav-partners', label: '거래처 목록으로 이동', shortcut: 'G P', onSelect: () => {} },
      { id: 'nav-inventory', label: '재고 현황으로 이동', shortcut: 'G I', onSelect: () => {} },
    ],
  },
  {
    key: 'action',
    label: '명령 실행',
    items: [
      { id: 'action-new-order', label: '신규 주문 등록', description: 'OMS', onSelect: () => {} },
      { id: 'action-new-partner', label: '신규 거래처 등록', description: 'PRM', onSelect: () => {} },
    ],
  },
  {
    key: 'doc',
    label: '문서',
    items: [
      { id: 'doc-1', label: '2026년 7월 정산 보고서', description: '재무팀', onSelect: () => {} },
    ],
  },
]

const meta: Meta<typeof CommandPalette> = {
  title: 'Overlay/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { groups: GROUPS },
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>커맨드 팔레트 열기 (⌘K)</Button>
        <CommandPalette {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '커맨드 팔레트 열기 (⌘K)' }))
    await expect(canvas.getByText('빠른 이동')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByText('빠른 이동')).not.toBeInTheDocument()
  },
}

export const Searching: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true)
    return <CommandPalette {...args} open={open} onClose={() => setOpen(false)} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('검색 또는 명령 입력...')
    await userEvent.type(input, '거래처')
    await expect(canvas.getByText('거래처 목록으로 이동')).toBeInTheDocument()
    await expect(canvas.queryByText('주문 목록으로 이동')).not.toBeInTheDocument()
  },
}

export const NoResults: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true)
    return <CommandPalette {...args} open={open} onClose={() => setOpen(false)} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('검색 또는 명령 입력...')
    await userEvent.type(input, '존재하지않는검색어')
    await expect(canvas.getByText('일치하는 결과가 없습니다')).toBeInTheDocument()
  },
}
