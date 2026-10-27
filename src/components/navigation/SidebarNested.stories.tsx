import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { SidebarNested } from './SidebarNested'

const ITEMS = [
  { key: 'dashboard', label: '대시보드', href: '/dashboard' },
  {
    key: 'sales',
    label: '판매 관리',
    children: [
      { key: 'orders', label: '주문 목록', href: '/orders' },
      { key: 'settlements', label: '정산', href: '/settlements' },
    ],
  },
  {
    key: 'catalog',
    label: '상품 관리',
    children: [
      { key: 'products', label: '상품 목록', href: '/products', active: true },
      {
        key: 'categories',
        label: '분류 설정',
        children: [{ key: 'category-list', label: '카테고리', href: '/categories' }],
      },
    ],
  },
]

const meta: Meta<typeof SidebarNested> = {
  title: 'Navigation/Sidebar Nested',
  component: SidebarNested,
  tags: ['autodocs'],
  args: { items: ITEMS },
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof meta>

export const TwoLevel: Story = {
  name: 'Two-level Groups',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sales = canvas.getByRole('button', { name: '판매 관리' })
    await expect(sales).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(sales)
    await expect(canvas.getByRole('link', { name: '주문 목록' })).toBeInTheDocument()
  },
}

export const DeepNavigation: Story = {
  name: 'Active Route at a Deeper Level',
  args: { items: ITEMS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: '상품 관리' })).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByRole('link', { name: '상품 목록' })).toHaveAttribute('aria-current', 'page')
  },
}

export const InitiallyExpanded: Story = {
  name: 'Initially Expanded Groups',
  args: { items: ITEMS, defaultExpandedKeys: ['sales'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: '주문 목록' })).toBeInTheDocument()
  },
}
