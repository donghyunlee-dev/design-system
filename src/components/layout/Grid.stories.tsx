import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'

const ITEMS = Array.from({ length: 6 }, (_, i) => (
  <div key={i} className="bg-gray-100 rounded p-3 text-sm text-center">셀 {i + 1}</div>
))

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const ThreeColumns: Story = {
  render: () => <Grid cols={3} gap={4}>{ITEMS}</Grid>,
}

export const TwoColumns: Story = {
  render: () => <Grid cols={2} gap={4}>{ITEMS}</Grid>,
}

export const FourColumns: Story = {
  render: () => <Grid cols={4} gap={4}>{ITEMS}</Grid>,
}
