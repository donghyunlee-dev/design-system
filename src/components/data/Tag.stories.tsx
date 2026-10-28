import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Data/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'React' },
  parameters: { docs: { description: { component: "항목의 분류나 키워드를 짧은 라벨로 표시합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Removable: Story = { args: { onRemove: () => {} } }
