import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('₩4.2M')).toHaveClass('text-page-title')
    expect(canvas.getByText(/12.5%/)).toHaveClass('text-success-foreground')
  },
}

export const TrendDown: Story = {
  args: { label: '취소율', value: '3.2%', change: { value: '1.1%', trend: 'down' } },
}
