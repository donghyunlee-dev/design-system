import type { Meta, StoryObj } from '@storybook/react'
import { HubIcon } from './HubIcon'

const meta: Meta<typeof HubIcon> = {
  title: 'Foundation/HubIcon',
  component: HubIcon,
  tags: ['autodocs'],
  args: { name: 'account', size: 'md' },
  parameters: { docs: { description: { component: "WindSoft 제품 또는 서비스 허브를 식별하는 아이콘입니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Account: Story = {}
export const AllIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <HubIcon name="account" size="md" />
      <HubIcon name="device" size="md" />
      <HubIcon name="document" size="md" />
      <HubIcon name="folder" size="md" />
      <HubIcon name="lock" size="md" />
      <HubIcon name="box" size="md" />
    </div>
  ),
}
