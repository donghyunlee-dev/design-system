import type { Meta, StoryObj } from '@storybook/react'
import { NumberInput } from './NumberInput'
import { FormField } from './FormField'

const meta: Meta<typeof NumberInput> = {
  title: 'Form/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: { placeholder: '0' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithUnit: Story = {
  args: { unit: '개' },
}

export const WithRange: Story = {
  args: { min: 0, max: 100, unit: '%', placeholder: '0~100' },
}

export const WithError: Story = {
  args: { error: true, unit: 'kg', placeholder: '0' },
}

export const Disabled: Story = {
  args: { disabled: true, unit: '℃', placeholder: '0' },
}

export const WithValidation: Story = {
  render: () => (
    <FormField
      label="생산 수량"
      rules={{
        required: '필수 입력입니다',
        min: { value: 1, message: '1 이상이어야 합니다' },
        max: { value: 9999, message: '9,999 이하로 입력하세요' },
      }}
    >
      <NumberInput unit="개" min={1} max={9999} placeholder="수량 입력" />
    </FormField>
  ),
}
