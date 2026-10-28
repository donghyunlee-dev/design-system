import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: '버튼', variant: 'primary', size: 'md' },
  parameters: { docs: { description: { component: "작업을 실행하거나 선택을 확정합니다. 중요도에 맞는 강조 단계와 크기를 선택합니다." } } },
}
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Disabled: Story = { args: { disabled: true } }
export const WindSoftMatrix: Story = {
  name: 'WindSoft 크기와 강조 단계',
  render: () => (
    <div className="space-y-ws-4">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map(variant => (
        <div key={variant} className="flex flex-wrap items-center gap-ws-2">
          <span className="w-24 text-caption text-secondary">{variant}</span>
          <Button variant={variant} size="sm">작게</Button>
          <Button variant={variant} size="md">기본 동작</Button>
          <Button variant={variant} size="lg">변경 사항 저장</Button>
          <Button variant={variant} size="md" disabled>비활성</Button>
        </div>
      ))}
      <div className="max-w-sm">
        <Button className="h-auto min-h-10 w-full whitespace-normal py-2 text-left">긴 한국어 작업 이름도 여러 줄에서 읽히도록 충분한 여백을 제공합니다</Button>
      </div>
    </div>
  ),
}
