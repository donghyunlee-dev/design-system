import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: '내용을 입력하세요' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true, value: '비활성 텍스트' } }
