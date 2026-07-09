import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { children: '알림 메시지 내용입니다.', variant: 'info' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {}

export const Success: Story = {
  args: { variant: 'success', title: '저장 완료', children: '변경 사항이 저장되었습니다.' },
}

export const Warning: Story = {
  args: { variant: 'warning', title: '주의', children: '이 작업은 되돌릴 수 없습니다.' },
}

export const Danger: Story = {
  args: { variant: 'danger', title: '오류', children: '요청을 처리할 수 없습니다.' },
}
