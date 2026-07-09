import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Tabs } from './Tabs'

const TAB_ITEMS = [
  { key: 'overview', label: '개요', content: <p className="text-sm pt-2">개요 내용입니다.</p> },
  { key: 'settings', label: '설정', content: <p className="text-sm pt-2">설정 내용입니다.</p> },
  { key: 'logs', label: '로그', content: <p className="text-sm pt-2">로그 내용입니다.</p> },
]

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {},
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <Tabs {...args} items={TAB_ITEMS} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Click the second tab by name
    const settingsTab = canvas.getByRole('button', { name: '설정' })
    await userEvent.click(settingsTab)
    await expect(settingsTab).toHaveClass('border-brand')
  },
}
