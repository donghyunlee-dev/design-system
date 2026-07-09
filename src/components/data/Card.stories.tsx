import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Button } from '../foundation/Button'

const meta: Meta<typeof Card> = {
  title: 'Data/Card',
  component: Card,
  tags: ['autodocs'],
  args: { title: '카드 제목' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <p className="text-sm">카드 내용이 여기에 표시됩니다.</p>
    </Card>
  ),
}

export const WithDescription: Story = {
  render: (args) => (
    <Card {...args} description="부제목 텍스트">
      <p className="text-sm">카드 내용입니다.</p>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <Card
      {...args}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm">취소</Button>
          <Button size="sm">저장</Button>
        </div>
      }
    >
      <p className="text-sm">카드 내용입니다.</p>
    </Card>
  ),
}
