import type { Meta, StoryObj } from '@storybook/react'
import { VerifiedBadge } from './VerifiedBadge'
import { Avatar } from './Avatar'

const meta: Meta<typeof VerifiedBadge> = {
  title: 'Foundation/VerifiedBadge',
  component: VerifiedBadge,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAvatar: Story = {
  name: 'Avatar와 조합',
  render: () => (
    <span className="inline-flex items-center gap-1.5">
      <Avatar size="sm" initials="구" alt="구매팀" />
      <span className="text-sm text-foreground">구매팀</span>
      <VerifiedBadge />
    </span>
  ),
}
