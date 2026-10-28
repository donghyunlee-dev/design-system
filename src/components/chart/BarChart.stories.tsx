import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './BarChart'

const DATA = [
  { month: '1월', 주문: 120 },
  { month: '2월', 주문: 180 },
  { month: '3월', 주문: 150 },
  { month: '4월', 주문: 210 },
  { month: '5월', 주문: 190 },
]

const meta: Meta<typeof BarChart> = {
  title: 'Chart/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    data: DATA,
    xKey: 'month',
    bars: [{ key: '주문', label: '주문 수' }],
    height: 300,
  },
  parameters: { docs: { description: { component: "범주별 수치를 막대로 비교합니다. 축과 라벨을 실제 데이터에 맞게 구성합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
