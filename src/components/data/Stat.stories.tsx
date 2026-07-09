import type { Meta, StoryObj } from '@storybook/react'
import { Stat } from './Stat'

const meta: Meta<typeof Stat> = {
  title: 'Data/Stat',
  component: Stat,
  tags: ['autodocs'],
  args: { label: '총 주문', value: '1,234' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TrendUp: Story = {
  args: { label: '매출', value: '₩4.2M', change: { value: '12.5%', trend: 'up' } },
}

export const TrendDown: Story = {
  args: { label: '취소율', value: '3.2%', change: { value: '1.1%', trend: 'down' } },
}
