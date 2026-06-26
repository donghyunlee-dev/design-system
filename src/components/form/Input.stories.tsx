import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { FormField } from './FormField'
import { Select } from './Select'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'

const meta: Meta = { title: 'Form/Input' }
export default meta

export const Default: StoryObj = {
  render: () => <Input placeholder="텍스트를 입력하세요" />,
}
export const WithError: StoryObj = {
  render: () => (
    <FormField label="이메일" error="올바른 이메일 형식이 아닙니다" required>
      <Input type="email" error placeholder="example@email.com" />
    </FormField>
  ),
}
export const SelectExample: StoryObj = {
  render: () => (
    <Select options={[{ value: '1', label: '옵션 1' }, { value: '2', label: '옵션 2' }]} placeholder="선택하세요" />
  ),
}
export const Controls: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="동의합니다" defaultChecked />
      <Switch checked label="알림 켜기" onChange={() => {}} />
    </div>
  ),
}
