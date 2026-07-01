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
    const tabs = canvas.getAllByRole('button')
    // Click the second tab
    await userEvent.click(tabs[1])
    await expect(tabs[1]).toHaveClass('border-brand')
  },
}
