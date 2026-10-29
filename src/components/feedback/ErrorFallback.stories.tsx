import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../foundation/Button'
import { ErrorFallback } from './ErrorFallback'

const meta: Meta<typeof ErrorFallback> = {
  title: 'Feedback/ErrorFallback',
  component: ErrorFallback,
  tags: ['autodocs'],
  args: {
    layout: 'section',
    title: '목록을 불러오지 못했습니다',
    description: '연결 상태를 확인한 뒤 다시 시도해 주세요.',
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: '실패한 콘텐츠 영역에 오류 이유와 복구 동작을 표시합니다. 오류 경계와 재시도 로직은 호출하는 앱에서 연결합니다.' } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Section: Story = {}

export const Inline: Story = {
  args: { layout: 'inline', title: '사용자 목록을 불러오지 못했습니다', description: '다시 시도해 주세요.' },
  render: args => <ErrorFallback {...args} onRetry={() => {}} />,
}

export const PageWithReferenceCode: Story = {
  args: { layout: 'page', referenceCode: 'REQ-381' },
  render: args => (
    <ErrorFallback
      {...args}
      referenceCode="REQ-381"
      primaryAction={<Button>다시 요청</Button>}
      secondaryAction={<Button variant="secondary">목록으로</Button>}
    />
  ),
}
