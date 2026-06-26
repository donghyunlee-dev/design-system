import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tabs } from './Tabs'
import { Breadcrumb } from './Breadcrumb'
import { Pagination } from './Pagination'
import { Stepper } from './Stepper'
import { Navbar } from './Navbar'

const meta: Meta = { title: 'Navigation/Tabs' }
export default meta

export const TabsStory: StoryObj = {
  render: () => (
    <Tabs items={[
      { key: 'a', label: '개요', content: <p className="text-sm text-muted">개요 내용</p> },
      { key: 'b', label: '설정', content: <p className="text-sm text-muted">설정 내용</p> },
      { key: 'c', label: '로그', content: <p className="text-sm text-muted">로그 내용</p> },
    ]} />
  ),
}

export const BreadcrumbStory: StoryObj = {
  render: () => (
    <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '설정', href: '/settings' }, { label: '프로필' }]} />
  ),
}

export const PaginationStory: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1)
    return <Pagination page={page} total={100} onChange={setPage} />
  },
}

export const StepperStory: StoryObj = {
  render: () => <Stepper steps={['정보 입력', '확인', '완료']} current={1} />,
}

export const NavbarStory: StoryObj = {
  render: () => (
    <Navbar
      logo="SFOOD UI"
      items={[{ label: '대시보드', href: '#', active: true }, { label: '주문', href: '#' }, { label: '설정', href: '#' }]}
    />
  ),
}
