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
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
