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

export const WithRulesRequired: Story = {
  name: 'Validation / Required',
  render: (args) => (
    <FormField
      {...args}
      label="제품명"
      rules={{ required: '필수 입력입니다', notBlank: '공백만 입력할 수 없습니다' }}
    >
      <Input placeholder="제품명을 입력하세요" />
    </FormField>
  ),
}

export const WithRulesMinMax: Story = {
  name: 'Validation / Min·Max',
  render: (args) => (
    <FormField
      {...args}
      label="수량"
      rules={{
        required: '필수',
        min: { value: 1, message: '1 이상' },
        max: { value: 100, message: '100 이하' },
      }}
    >
      <Input type="number" placeholder="1~100" />
    </FormField>
  ),
}

export const WithRulesPattern: Story = {
  name: 'Validation / Pattern',
  render: (args) => (
    <FormField
      {...args}
      label="이메일"
      rules={{
        required: '필수',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '이메일 형식이 올바르지 않습니다',
        },
      }}
    >
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
