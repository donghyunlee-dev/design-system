import type { Meta, StoryObj } from '@storybook/react'
import { SearchField } from './SearchField'

const meta: Meta<typeof SearchField> = {
  title: 'Form/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: { 'aria-label': '사이트 검색', placeholder: '검색어를 입력하세요' },
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
