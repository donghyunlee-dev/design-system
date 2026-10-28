import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {},
  parameters: { docs: { description: { component: "콘텐츠 폭과 좌우 여백을 제한해 페이지 읽기 폭을 유지합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Container>
      <div className="rounded-card bg-surface-raised p-ws-4 text-body">최대 너비 제한 컨텐츠</div>
    </Container>
  ),
}
