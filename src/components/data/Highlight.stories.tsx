import type { Meta, StoryObj } from '@storybook/react'
import { Highlight, highlightMatches } from './Highlight'

const meta: Meta<typeof Highlight> = {
  title: 'Data/Highlight',
  component: Highlight,
  tags: ['autodocs'],
  args: { children: '냉동창고' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InSentence: Story = {
  render: () => (
    <p className="text-sm text-foreground">
      {highlightMatches('2026년 3분기 냉동창고 안전점검 결과 공유', '냉동창고')}
    </p>
  ),
}

export const NoMatch: Story = {
  render: () => (
    <p className="text-sm text-foreground">
      {highlightMatches('ERP 발주 승인 프로세스 변경 안내', '냉동창고')}
    </p>
  ),
}
