import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const OPTIONS = [
  { value: 'food', label: '식품' },
  { value: 'drink', label: '음료' },
  { value: 'snack', label: '스낵' },
]

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options: OPTIONS, placeholder: '선택하세요' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true } }
