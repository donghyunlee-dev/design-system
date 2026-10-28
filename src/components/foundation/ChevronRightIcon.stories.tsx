import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon } from './ChevronRightIcon'

const meta: Meta<typeof ChevronRightIcon> = {
  title: 'Foundation/ChevronRightIcon',
  component: ChevronRightIcon,
  tags: ['autodocs'],
  args: { size: 'sm' },
  parameters: { docs: { description: { component: "다음 방향을 나타내는 보조 아이콘입니다. 경로나 이동 표시 가까이에 배치합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-muted">
      <ChevronRightIcon size="xs" />
      <ChevronRightIcon size="sm" />
      <ChevronRightIcon size="md" />
    </div>
  ),
}
