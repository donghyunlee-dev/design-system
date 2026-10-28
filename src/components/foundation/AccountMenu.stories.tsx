import type { Meta, StoryObj } from '@storybook/react'
import { AccountMenu } from './AccountMenu'

const meta: Meta<typeof AccountMenu> = {
  title: 'Foundation/AccountMenu',
  component: AccountMenu,
  tags: ['autodocs'],
  args: {
    name: '김민수',
    email: 'minsu@example.com',
    initials: '김',
    items: [
      { label: '계정 설정', onClick: () => {} },
      { label: '로그아웃', onClick: () => {}, divider: true },
    ],
  },
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof meta>

export const AvatarOnly: Story = { args: { mode: 'avatar' } }
export const IdentityOnly: Story = { args: { mode: 'identity' } }
