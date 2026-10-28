import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Foundation/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { initials: 'DL', size: 'md' },
  parameters: { docs: { description: { component: "사용자나 조직의 이미지를 보여주고, 이미지가 없을 때 대체 표시를 제공합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/96', alt: '프로필 이미지', initials: undefined },
}
