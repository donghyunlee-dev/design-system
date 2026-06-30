import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './Stack'

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: () => (
    <Stack direction="col" gap={4}>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 1</div>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 2</div>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 3</div>
    </Stack>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Stack direction="row" gap={4}>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 1</div>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 2</div>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 3</div>
    </Stack>
  ),
}

export const Center: Story = {
  render: () => (
    <Stack direction="row" align="center" justify="center" gap={4} style={{ minHeight: '120px', border: '1px dashed #ccc' }}>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 1</div>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 2</div>
      <div className="bg-gray-100 rounded p-2 text-sm text-center">항목 3</div>
    </Stack>
  ),
}
