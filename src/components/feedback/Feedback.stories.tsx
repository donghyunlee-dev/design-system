import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'
import { Skeleton } from './Skeleton'
import { Progress } from './Progress'
import { Alert } from './Alert'
import { EmptyState } from './EmptyState'

const meta: Meta = { title: 'Feedback/Spinner' }
export default meta

export const Spinners: StoryObj = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </div>
  ),
}
export const Skeletons: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}
export const Progresses: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Progress value={30} /><Progress value={60} /><Progress value={90} />
    </div>
  ),
}
export const Alerts: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Alert variant="info" title="안내">확인이 필요합니다.</Alert>
      <Alert variant="success" title="완료">저장되었습니다.</Alert>
      <Alert variant="warning" title="주의">주의가 필요합니다.</Alert>
      <Alert variant="danger" title="오류">오류가 발생했습니다.</Alert>
    </div>
  ),
}
export const Empty: StoryObj = {
  render: () => <EmptyState icon="📭" title="데이터가 없습니다" description="새 항목을 추가해 주세요" />,
}
