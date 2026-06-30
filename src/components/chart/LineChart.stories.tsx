import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'

const DATA = [
  { month: '1월', 주문: 120, 매출: 240 },
  { month: '2월', 주문: 180, 매출: 380 },
  { month: '3월', 주문: 150, 매출: 290 },
  { month: '4월', 주문: 210, 매출: 450 },
  { month: '5월', 주문: 190, 매출: 400 },
]

const meta: Meta<typeof LineChart> = {
  title: 'Chart/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  args: {
    data: DATA,
    xKey: 'month',
    lines: [
      { key: '주문', label: '주문 수' },
      { key: '매출', label: '매출액', color: '#10b981' },
    ],
    height: 300,
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleLine: Story = {
  args: { lines: [{ key: '주문', label: '주문 수' }] },
}
