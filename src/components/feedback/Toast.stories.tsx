import type { Meta, StoryObj } from '@storybook/react'
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
  tags: ['autodocs'],
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = { render: () => <ToastDemo variant="info" /> }
export const Success: Story = { render: () => <ToastDemo variant="success" /> }
export const Warning: Story = { render: () => <ToastDemo variant="warning" /> }
export const Danger: Story = { render: () => <ToastDemo variant="danger" /> }
