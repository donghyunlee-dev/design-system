import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
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
export const Disabled: Story = { args: { disabled: true, placeholder: '비활성 입력' } }
export const Password: Story = { args: { type: 'password', placeholder: '비밀번호' } }

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, '테스트 입력값')
    await expect(input).toHaveValue('테스트 입력값')
  },
}

export const ErrorState: Story = {
  args: { error: true, placeholder: '오류 상태' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await expect(input).toHaveClass('border-danger')
  },
}
