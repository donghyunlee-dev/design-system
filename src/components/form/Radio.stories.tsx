import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { label: '옵션 선택', name: 'example' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
