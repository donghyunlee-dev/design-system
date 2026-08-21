import type { Meta, StoryObj } from '@storybook/react'
import { MediaCardHoverActions } from './MediaCardHoverActions'
import { MediaCard } from './MediaCard'
import { Button } from '../foundation/Button'

const meta: Meta<typeof MediaCardHoverActions> = {
  title: 'Data/MediaCardHoverActions',
  component: MediaCardHoverActions,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '호버 시 복제 액션 노출',
  render: () => (
    <MediaCardHoverActions
      className="max-w-xs"
      actions={<Button size="sm">복제하기</Button>}
    >
      <MediaCard
        title="표준 발주서"
        description="거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다."
        fallback={<span className="text-2xl">🧾</span>}
      />
    </MediaCardHoverActions>
  ),
}
