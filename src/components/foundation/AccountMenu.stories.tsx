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
  parameters: { layout: 'centered', docs: { description: { component: "현재 계정을 표시하고 관련 작업 메뉴를 엽니다. 아바타를 눌러 메뉴를 확인합니다." } }},
}

export default meta
type Story = StoryObj<typeof meta>

export const AvatarOnly: Story = { args: { mode: 'avatar' } }
export const IdentityOnly: Story = { args: { mode: 'identity' } }
