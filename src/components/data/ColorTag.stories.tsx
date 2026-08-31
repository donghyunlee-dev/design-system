import type { Meta, StoryObj } from '@storybook/react'
import { ColorTag } from './ColorTag'
import { Stack } from '../layout/Stack'

const meta: Meta<typeof ColorTag> = {
  title: 'Data/ColorTag',
  component: ColorTag,
  tags: ['autodocs'],
  args: { children: '영업팀' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { variant: 'neutral', children: '영업팀' } }
export const Brand: Story = { args: { variant: 'brand', children: '경영기획팀' } }
export const Success: Story = { args: { variant: 'success', children: '물류팀' } }
export const Warning: Story = { args: { variant: 'warning', children: '품질관리팀' } }
export const Danger: Story = { args: { variant: 'danger', children: '재무팀' } }
export const Info: Story = { args: { variant: 'info', children: 'IT팀' } }

export const Removable: Story = { args: { variant: 'brand', children: '구매팀', onRemove: () => {} } }

export const AllVariants: Story = {
  render: () => (
    <Stack direction="row" gap={2}>
      <ColorTag variant="neutral">영업팀</ColorTag>
      <ColorTag variant="brand">경영기획팀</ColorTag>
      <ColorTag variant="success">물류팀</ColorTag>
      <ColorTag variant="warning">품질관리팀</ColorTag>
      <ColorTag variant="danger">재무팀</ColorTag>
      <ColorTag variant="info">IT팀</ColorTag>
    </Stack>
  ),
}
