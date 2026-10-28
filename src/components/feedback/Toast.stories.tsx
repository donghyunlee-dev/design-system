import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { ToastProvider, useToast } from './Toast'
import { Button } from '../foundation/Button'

function ToastDemo({ variant }: { variant?: 'info' | 'success' | 'warning' | 'danger' }) {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast('알림 메시지입니다.', variant)}>
      Toast 표시
    </Button>
  )
}

const meta: Meta = {
  title: 'Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
  parameters: { docs: { description: { component: "작업 결과를 화면을 막지 않는 일시 알림으로 전달합니다. 상위에 ToastProvider를 두고 상태와 메시지를 호출합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  render: () => <ToastDemo variant="info" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Toast 표시' }))
    await expect(canvas.getByText('알림 메시지입니다.')).toBeInTheDocument()
  },
}
export const Success: Story = { render: () => <ToastDemo variant="success" /> }
export const Warning: Story = { render: () => <ToastDemo variant="warning" /> }
export const Danger: Story = { render: () => <ToastDemo variant="danger" /> }
