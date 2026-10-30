import type { Meta, StoryObj } from '@storybook/react'
import { TicketDetail } from '../../templates/details/TicketDetail'
export { Detail, Master, Activity, Diff } from './Business.shared'
export { DetailWorkspace } from './Admin.shared'

const meta: Meta = {
  title: 'Templates/Details',
  parameters: { layout: 'fullscreen', docs: { codePanel: true } },
}
export default meta
type Story = StoryObj<typeof meta>

export const TicketDetailStory: Story = {
  render: () => (
    <TicketDetail
      ticketNo="TKT-2026-0184"
      title="정산 내역 다운로드 오류"
      status="pending"
      statusLabel="처리 중"
      requester={{ name: '김민지', initials: '민', meta: '고객 · 2026. 10. 28.' }}
      assignee={{ name: '박준호', initials: '준' }}
      tags={['P2', '정산']}
      messages={[
        { id: 'm1', author: { name: '김민지', initials: '민' }, time: '10:32', content: '지난달 정산 파일을 내려받으면 빈 파일이 생성됩니다.' },
        { id: 'm2', author: { name: '박준호', initials: '준' }, isAgent: true, time: '11:05', content: '확인 중입니다. 브라우저와 다운로드 시각을 알려주실 수 있을까요?' },
      ]}
      statusActions={[{ key: 'resolved', label: '해결 완료' }]}
    />
  ),
}
