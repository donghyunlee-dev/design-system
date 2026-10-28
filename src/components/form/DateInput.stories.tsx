import type { Meta, StoryObj } from '@storybook/react'
import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'Form/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  args: {},
  parameters: { docs: { description: { component: "날짜를 입력받습니다. 표시 형식과 허용 범위를 설정합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true } }
