import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Form/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: { label: '파일 선택 또는 드래그' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ImageOnly: Story = { args: { accept: 'image/*', label: '이미지 파일만 가능 (PNG, JPG)' } }
export const Multiple: Story = { args: { multiple: true, label: '여러 파일 선택 가능' } }
