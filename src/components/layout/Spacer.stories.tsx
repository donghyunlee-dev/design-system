import type { Meta, StoryObj } from '@storybook/react'
import { Spacer } from './Spacer'

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  args: {},
  parameters: { docs: { description: { component: "레이아웃 안에서 일정한 간격을 확보합니다. 인접 요소의 마진과 중복되지 않도록 합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <div className="rounded-card bg-surface-raised p-ws-2 text-body">위 요소</div>
      <Spacer size={4} />
      <div className="rounded-card bg-surface-raised p-ws-2 text-body">아래 요소</div>
    </div>
  ),
}
