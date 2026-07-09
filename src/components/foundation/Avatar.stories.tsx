import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Foundation/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { initials: 'DL', size: 'md' },
}
export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/96', alt: '프로필 이미지', initials: undefined },
}
