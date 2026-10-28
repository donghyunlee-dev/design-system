import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { size: 'md' },
  parameters: { docs: { description: { component: "완료 시점을 알 수 없는 작업의 진행 상태를 표시합니다. 대기 이유는 주변 문구로 안내합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }
