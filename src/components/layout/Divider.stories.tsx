import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {},
  parameters: { docs: { description: { component: "콘텐츠 그룹 사이의 경계를 가볍게 표시합니다. 시각적 구분이 필요한 곳에 사용합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <p className="mb-ws-2 text-body">위 섹션</p>
      <Divider />
      <p className="mt-ws-2 text-body">아래 섹션</p>
    </div>
  ),
}
