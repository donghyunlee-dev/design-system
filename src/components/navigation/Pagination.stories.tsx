import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
}

export const ManyPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(5)
    return <Pagination {...args} total={500} page={page} onChange={setPage} />
  },
}
