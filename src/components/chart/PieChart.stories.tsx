import type { Meta, StoryObj } from '@storybook/react'
import { PieChart } from './PieChart'

const DATA = [
  { name: '완료', value: 400 },
  { name: '처리중', value: 200 },
  { name: '취소', value: 50 },
]

const meta: Meta<typeof PieChart> = {
  title: 'Chart/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  args: { data: DATA, height: 300 },
  parameters: { docs: { description: { component: "전체에서 범주별 비율을 원형 차트로 비교합니다. 범주 수와 범례 가독성을 확인합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomColors: Story = {
  name: 'Caller-provided colors',
  args: {
    data: [
      { name: '완료', value: 400, color: '#166534' },
      { name: '처리중', value: 200, color: '#92400e' },
      { name: '취소', value: 50, color: '#991b1b' },
    ],
  },
}
