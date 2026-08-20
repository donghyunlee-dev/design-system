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
  tags: ['autodocs'],
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
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
