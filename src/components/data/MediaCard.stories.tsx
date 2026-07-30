import type { Meta, StoryObj } from '@storybook/react'
import { MediaCard } from './MediaCard'
import { Button } from '../foundation/Button'

const meta: Meta<typeof MediaCard> = {
  title: 'Data/MediaCard',
  component: MediaCard,
  tags: ['autodocs'],
  args: { title: '표준 발주서', description: '거래처·품목·수량·납기를 입력해 신규 발주를 생성하는 기본 양식입니다.' },
}
export default meta
type Story = StoryObj<typeof meta>

export const WithIconFallback: Story = {
  name: '이미지 없음 (아이콘 대체)',
  render: (args) => (
    <MediaCard {...args} coverFallback={<span className="text-2xl">🧾</span>} className="max-w-xs" />
  ),
}

// 데모용 인라인 SVG (외부 네트워크 요청 없이 실제 <img> 썸네일 렌더링을 보여주기 위한 예시이며,
// 기존 토큰 원시값(--gray-200, --brand-500)만 사용합니다.
const DEMO_THUMBNAIL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270">' +
      '<rect width="480" height="270" fill="#e5e7eb"/>' +
      '<rect x="24" y="24" width="120" height="16" rx="4" fill="#d85b5b"/>' +
      '<rect x="24" y="56" width="200" height="12" rx="4" fill="#d1d5db"/>' +
      '</svg>'
  )

export const WithThumbnail: Story = {
  name: '썸네일 이미지',
  render: (args) => (
    <MediaCard {...args} coverSrc={DEMO_THUMBNAIL} coverAlt={args.title} className="max-w-xs" />
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <MediaCard
      {...args}
      coverFallback={<span className="text-2xl">🧾</span>}
      className="max-w-xs"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm">취소</Button>
          <Button size="sm">이 템플릿 사용</Button>
        </div>
      }
    />
  ),
}
