import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Radio } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { label: '옵션 선택', name: 'example' },
  parameters: { docs: { description: { component: "서로 배타적인 선택지 중 하나를 고르게 합니다. 관련 옵션을 같은 그룹으로 제공합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }

export const Selected: Story = {
  args: { label: '선택 항목', name: 'group' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).not.toBeChecked()
    await userEvent.click(radio)
    await expect(radio).toBeChecked()
  },
}
