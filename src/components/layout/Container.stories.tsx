import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Container>
      <div className="bg-gray-100 rounded p-4 text-sm">최대 너비 제한 컨텐츠</div>
    </Container>
  ),
}
