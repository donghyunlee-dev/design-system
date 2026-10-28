import type { Meta, StoryObj } from '@storybook/react'
import { DateTimePicker } from './DateTimePicker'
import { FormField } from './FormField'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Form/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  args: { mode: 'date' },
  parameters: { docs: { description: { component: "날짜와 시간을 함께 입력받습니다. 유효 범위와 표시 단위를 설정합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const DateOnly: Story = {
  args: { mode: 'date' },
}

export const TimeOnly: Story = {
  args: { mode: 'time' },
}

export const DateTime: Story = {
  args: { mode: 'datetime' },
}

export const WithError: Story = {
  args: { mode: 'date', error: true },
}

export const Disabled: Story = {
  args: { mode: 'date', disabled: true },
}

export const WithValidation: Story = {
  render: () => (
    <FormField label="작업 시작일" rules={{ required: '날짜를 선택하세요' }}>
      <DateTimePicker mode="datetime" />
    </FormField>
  ),
}
