import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
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
  parameters: { docs: { description: { component: "정해진 선택지 중 하나를 선택하게 합니다. 옵션 라벨을 명확히 제공합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true } }

export const Selected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    const options = select.querySelectorAll('option')
    if (options.length > 1) {
      await userEvent.selectOptions(select, options[1].value)
      await expect(select).toHaveValue(options[1].value)
    }
  },
}

export const DisabledSelect: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    await expect(select).toBeDisabled()
  },
}
