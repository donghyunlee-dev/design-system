import type { Meta, StoryObj } from '@storybook/react'
import { CardMedia } from './CardMedia'

const meta: Meta<typeof CardMedia> = {
  title: 'Data/CardMedia',
  component: CardMedia,
  tags: ['autodocs'],
  args: { title: '카드 제목', description: '카드 부제목' },
}
export default meta
type Story = StoryObj<typeof meta>

// 샘플 썸네일 (data URI) — 스토리 예시용 자산이며 외부 네트워크 호출이 없다.
const sampleThumbnail =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240">' +
      '<rect width="480" height="240" fill="#cbd5e1"/>' +
      '<rect width="480" height="240" fill="#94a3b8" opacity="0.5"/>' +
      '</svg>'
  )

export const WithCoverColor: Story = {
  render: (args) => <CardMedia {...args} cover="brand" />,
}

export const WithImage: Story = {
  render: (args) => (
    <CardMedia {...args} image={sampleThumbnail} imageAlt="카드 썸네일 예시" />
  ),
}

export const WithoutMedia: Story = {
  render: (args) => <CardMedia {...args} />,
}
