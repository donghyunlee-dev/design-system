import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, userEvent, within } from '@storybook/test'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { total: 100, pageSize: 10 },
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
    await expect(canvas.getByRole('button', { name: '이전' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: '다음' }))
    await expect(canvas.getByRole('button', { name: '이전' })).not.toBeDisabled()
  },
}

export const ManyPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(5)
    return <Pagination {...args} total={500} page={page} onChange={setPage} />
  },
}
