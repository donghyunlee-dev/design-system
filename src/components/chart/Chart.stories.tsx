import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'
import { BarChart } from './BarChart'
import { PieChart } from './PieChart'

const meta: Meta = { title: 'Chart/LineChart' }
export default meta

const monthlyData = [
  { month: '1월', 주문: 120, 매출: 240 },
  { month: '2월', 주문: 180, 매출: 380 },
  { month: '3월', 주문: 150, 매출: 290 },
  { month: '4월', 주문: 220, 매출: 450 },
]

export const Line: StoryObj = {
  render: () => (
    <LineChart
      data={monthlyData}
      xKey="month"
      lines={[
        { key: '주문', label: '주문 수' },
        { key: '매출', label: '매출', color: 'var(--color-success)' },
      ]}
    />
  ),
}

export const Bar: StoryObj = {
  render: () => (
    <BarChart data={monthlyData} xKey="month" bars={[{ key: '주문', label: '주문 수' }]} />
  ),
}

export const Pie: StoryObj = {
  render: () => (
    <PieChart data={[{ name: '완료', value: 400 }, { name: '처리중', value: 200 }, { name: '취소', value: 50 }]} />
  ),
}
