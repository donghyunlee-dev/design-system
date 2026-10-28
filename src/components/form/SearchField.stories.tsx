import type { Meta, StoryObj } from '@storybook/react'
import { SearchField } from './SearchField'

const meta: Meta<typeof SearchField> = {
  title: 'Form/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: { 'aria-label': '사이트 검색', placeholder: '검색어를 입력하세요' },
  parameters: { layout: 'padded', docs: { description: { component: "목록이나 데이터에서 검색어를 입력받습니다. 검색 실행과 지우기 동작을 설정합니다." } }},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
