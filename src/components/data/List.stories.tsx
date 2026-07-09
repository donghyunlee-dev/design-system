import type { Meta, StoryObj } from '@storybook/react'
import { List } from './List'
import { Badge } from '../foundation/Badge'

const meta: Meta<typeof List> = {
  title: 'Data/List',
  component: List,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <List
      {...args}
      items={[
        { id: 1, primary: '이동현', secondary: 'dhlee@sfood.com', trailing: <Badge>관리자</Badge> },
        { id: 2, primary: '김철수', secondary: 'kim@sfood.com', trailing: <Badge variant="info">멤버</Badge> },
        { id: 3, primary: '이영희', secondary: 'lee@sfood.com', trailing: <Badge variant="info">멤버</Badge> },
      ]}
    />
  ),
}
