import type { Meta, StoryObj } from '@storybook/react'
import { Popover } from './Popover'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {},
  parameters: { layout: 'centered', docs: { description: { component: "트리거와 연관된 보조 콘텐츠나 입력 UI를 표시합니다. 바깥 클릭과 Escape 동작을 확인합니다." } }},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Popover
      {...args}
      trigger={<Button variant="secondary">클릭</Button>}
    >
      <p className="text-sm">팝오버 내용입니다.</p>
    </Popover>
  ),
}
