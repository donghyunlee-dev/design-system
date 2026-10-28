import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { total: 100, pageSize: 10 },
  parameters: { docs: { description: { component: "긴 목록을 페이지 단위로 이동합니다. 현재 페이지와 전체 범위를 전달합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(1)
    return <Pagination {...args} page={page} onChange={setPage} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: '이전 페이지' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: '페이지 1' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(canvas.getByRole('button', { name: '다음 페이지' }))
    await expect(canvas.getByRole('button', { name: '이전 페이지' })).not.toBeDisabled()
    await expect(canvas.getByRole('button', { name: '페이지 2' })).toHaveAttribute('aria-current', 'page')
  },
}

export const ManyPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(5)
    return <Pagination {...args} total={500} page={page} onChange={setPage} />
  },
}

export const SizeScale: Story = {
  name: '32 / 40 / 48 px',
  render: () => (
    <div className="flex flex-col items-start gap-ws-4">
      <Pagination page={2} total={100} size="sm" onChange={() => {}} />
      <Pagination page={2} total={100} size="md" onChange={() => {}} />
      <Pagination page={2} total={100} size="lg" onChange={() => {}} />
    </div>
  ),
}
