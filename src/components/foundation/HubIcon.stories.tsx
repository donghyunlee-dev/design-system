import type { Meta, StoryObj } from '@storybook/react'
import { HubIcon } from './HubIcon'

const meta: Meta<typeof HubIcon> = {
  title: 'Foundation/HubIcon',
  component: HubIcon,
  tags: ['autodocs'],
  args: { name: 'account', size: 'md' },
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
