import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: '텍스트를 입력하세요' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true, placeholder: '오류 상태' } }
export const Disabled: Story = { args: { disabled: true, value: '비활성 입력' } }
export const Password: Story = { args: { type: 'password', placeholder: '비밀번호' } }
