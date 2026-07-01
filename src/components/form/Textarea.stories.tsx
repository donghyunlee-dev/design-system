import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
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

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')
    await userEvent.type(textarea, '여러 줄\n텍스트 입력')
    await expect(textarea).toHaveValue('여러 줄\n텍스트 입력')
  },
}

export const DisabledInput: Story = {
  args: { disabled: true, placeholder: '비활성 상태' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')
    await expect(textarea).toBeDisabled()
  },
}
