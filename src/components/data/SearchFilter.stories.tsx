import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../foundation/Button'
import { Tag } from './Tag'
import { SearchField } from '../form/SearchField'
import { Select } from '../form/Select'
import { SearchFilter } from './SearchFilter'

const meta: Meta<typeof SearchFilter> = {
  title: 'Data/SearchFilter',
  component: SearchFilter,
  tags: ['autodocs'],
  args: {
    ariaLabel: '사용자 목록 검색 및 필터',
    search: <SearchField aria-label="사용자 이름 또는 이메일 검색" placeholder="이름 또는 이메일 검색" />,
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: '목록 제목 아래에서 검색 입력, 화면별 필터, 조회 액션과 적용된 필터를 한 영역에 정렬합니다. 검색 상태와 조회 동작은 호출부가 관리합니다.' } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const SearchOnly: Story = {}

export const WithFiltersAndActions: Story = {
  args: {
    filters: (
      <>
        <Select aria-label="상태 필터" options={[{ value: 'active', label: '사용 중' }, { value: 'inactive', label: '중지' }]} placeholder="상태 전체" />
        <Select aria-label="조직 필터" options={[{ value: 'sales', label: '영업팀' }, { value: 'ops', label: '운영팀' }]} placeholder="조직 전체" />
      </>
    ),
    actions: <><Button variant="secondary">초기화</Button><Button>조회</Button></>,
  },
}

export const WithActiveFilters: Story = {
  args: {
    filters: <Select aria-label="상태 필터" options={[{ value: 'active', label: '사용 중' }]} placeholder="상태 전체" />,
    actions: <><Button variant="secondary">초기화</Button><Button>조회</Button></>,
    activeFilters: <><Tag onRemove={() => {}}>상태: 사용 중</Tag><Tag onRemove={() => {}}>등록일: 최근 30일</Tag><Button variant="ghost" size="sm">필터 초기화</Button></>,
  },
}

export const Narrow: Story = {
  render: args => (
    <div className="w-full max-w-[22rem]">
      <SearchFilter
        {...args}
        filters={<Select aria-label="상태 필터" options={[{ value: 'active', label: '사용 중' }]} placeholder="상태 전체" />}
        actions={<><Button variant="secondary">초기화</Button><Button>조회</Button></>}
        activeFilters={<Tag onRemove={() => {}}>상태: 사용 중</Tag>}
      />
    </div>
  ),
}
