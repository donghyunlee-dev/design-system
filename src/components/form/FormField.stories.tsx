import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './FormField'
import { Input } from './Input'

const meta: Meta<typeof FormField> = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: '이메일', children: <Input placeholder="example@email.com" /> },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Required: Story = { args: { required: true } }
export const WithHint: Story = { args: { hint: '회사 이메일을 입력하세요' } }
export const WithError: Story = {
  args: {
    error: '올바른 이메일 형식이 아닙니다',
    children: <Input placeholder="example@email.com" error />,
  },
}
