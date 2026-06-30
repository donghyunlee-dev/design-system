import type { Meta, StoryObj } from '@storybook/react'
import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'Form/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true } }
