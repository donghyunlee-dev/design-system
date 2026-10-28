import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 60, max: 100 },
  parameters: { docs: { description: { component: "작업의 완료 정도를 진행률로 표시합니다. 실제 진행 범위와 값에 맞춰 사용합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { value: 0 } }
export const Full: Story = { args: { value: 100 } }
export const Quarter: Story = { args: { value: 25 } }
