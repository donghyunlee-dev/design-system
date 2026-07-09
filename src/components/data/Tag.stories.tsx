import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Data/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'React' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Removable: Story = { args: { onRemove: () => {} } }
