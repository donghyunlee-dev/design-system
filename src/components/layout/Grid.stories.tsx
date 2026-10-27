import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Grid } from './Grid'

const ITEMS = Array.from({ length: 6 }, (_, i) => (
  <div key={i} className="rounded-card bg-surface-raised p-ws-3 text-center text-body">셀 {i + 1}</div>
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
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.grid')).toHaveClass('gap-ws-4')
  },
}

export const TwoColumns: Story = {
  render: () => <Grid cols={2} gap={4}>{ITEMS}</Grid>,
}

export const FourColumns: Story = {
  render: () => <Grid cols={4} gap={4}>{ITEMS}</Grid>,
}
