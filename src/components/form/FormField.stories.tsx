import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { FormField } from './FormField'
import { Input } from './Input'

const meta: Meta<typeof FormField> = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: '이메일' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
export const Required: Story = {
  render: (args) => (
    <FormField {...args} required>
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
export const WithHint: Story = {
  render: (args) => (
    <FormField {...args} hint="회사 이메일을 입력하세요">
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
export const WithError: Story = {
  render: (args) => (
    <FormField {...args} error="올바른 이메일 형식이 아닙니다">
      <Input placeholder="example@email.com" error />
    </FormField>
  ),
}

export const ErrorMessage: Story = {
  render: (args) => (
    <FormField {...args} label="이메일" error="올바른 이메일 형식이 아닙니다.">
      <Input placeholder="example@email.com" error />
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument()
  },
}
