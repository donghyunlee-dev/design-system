import type { Meta, StoryObj } from '@storybook/react'
import { List } from './List'
import { Badge } from '../foundation/Badge'

const meta: Meta<typeof List> = {
  title: 'Data/List',
  component: List,
  tags: ['autodocs'],
  args: {},
  parameters: { docs: { description: { component: "관련 항목을 세로 목록으로 표시합니다. 선택 동작과 콘텐츠는 데이터 예제에서 확인합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <List
      {...args}
      items={[
        { id: 1, primary: '이동현', secondary: 'dhlee@windsoft.com', trailing: <Badge>관리자</Badge> },
        { id: 2, primary: '김철수', secondary: 'kim@windsoft.com', trailing: <Badge variant="info">멤버</Badge> },
        { id: 3, primary: '이영희', secondary: 'lee@windsoft.com', trailing: <Badge variant="info">멤버</Badge> },
      ]}
    />
  ),
}

export const LongValues: Story = {
  name: 'Long Korean values',
  render: () => (
    <List items={[
      {
        id: 'long-1',
        primary: 'WindSoft 통합 관리 플랫폼 운영 담당자 및 권한 정책 변경 검토 요청',
        secondary: '운영지원본부 · 서비스 관리 및 조직 권한 승인 담당',
        trailing: <Badge variant="warning">검토 중</Badge>,
      },
    ]} />
  ),
}
