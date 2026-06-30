import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Foundation/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: { children: '텍스트 예시', variant: 'body' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Heading1: Story = { args: { variant: 'h1', children: '제목 1단계' } }
export const Heading2: Story = { args: { variant: 'h2', children: '제목 2단계' } }
export const Heading3: Story = { args: { variant: 'h3', children: '제목 3단계' } }
export const Heading4: Story = { args: { variant: 'h4', children: '제목 4단계' } }
export const Body: Story = { args: { variant: 'body', children: '본문 텍스트입니다.' } }
export const BodySmall: Story = { args: { variant: 'body-sm', children: '작은 본문 텍스트입니다.' } }
export const Caption: Story = { args: { variant: 'caption', children: '캡션 텍스트' } }
export const Code: Story = { args: { variant: 'code', children: 'const x = 1' } }
