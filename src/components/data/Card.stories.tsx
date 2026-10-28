import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Card } from './Card'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Card> = {
  title: 'Data/Card',
  component: Card,
  tags: ['autodocs'],
  args: { title: '카드 제목' },
  parameters: { docs: { description: { component: "같은 맥락의 정보와 작업을 하나의 그룹으로 묶습니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <p className="text-body">카드 내용이 여기에 표시됩니다.</p>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByText('카드 제목')
    expect(title).toHaveClass('text-section-title')
    expect(title.closest('.rounded-card')).toHaveClass('bg-surface', 'border-border')
    expect(canvas.getByText('카드 내용이 여기에 표시됩니다.').parentElement).toHaveClass('p-ws-4')
  },
}

export const WithDescription: Story = {
  render: (args) => (
    <Card {...args} description="부제목 텍스트">
      <p className="text-body">카드 내용입니다.</p>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <Card
      {...args}
      footer={
        <div className="flex justify-end gap-ws-2">
          <Button variant="secondary" size="sm">취소</Button>
          <Button size="sm">저장</Button>
        </div>
      }
    >
      <p className="text-body">카드 내용입니다.</p>
    </Card>
  ),
}
