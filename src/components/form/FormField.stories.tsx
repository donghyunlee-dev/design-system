import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { FormField } from './FormField'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'
import { NumberInput } from './NumberInput'
import { DateTimePicker } from './DateTimePicker'
import { MultiSelect } from './MultiSelect'
import { Checkbox } from './Checkbox'
import { Radio } from './Radio'
import { Switch } from './Switch'

const meta: Meta<typeof FormField> = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: '이메일' },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
export const Required: Story = {
  render: (args) => (
    <FormField {...args} required>
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
export const WithHint: Story = {
  render: (args) => (
    <FormField {...args} hint="회사 이메일을 입력하세요">
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}
export const WithError: Story = {
  render: (args) => (
    <FormField {...args} error="올바른 이메일 형식이 아닙니다">
      <Input placeholder="example@email.com" error />
    </FormField>
  ),
}

export const ErrorMessage: Story = {
  render: (args) => (
    <FormField {...args} label="이메일" error="올바른 이메일 형식이 아닙니다.">
      <Input placeholder="example@email.com" error />
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument()
  },
}

export const WithRulesRequired: Story = {
  name: 'Validation / Required',
  render: (args) => (
    <FormField
      {...args}
      label="제품명"
      rules={{ required: '필수 입력입니다', notBlank: '공백만 입력할 수 없습니다' }}
    >
      <Input placeholder="제품명을 입력하세요" />
    </FormField>
  ),
}

export const WithRulesMinMax: Story = {
  name: 'Validation / Min·Max',
  render: (args) => (
    <FormField
      {...args}
      label="수량"
      rules={{
        required: '필수',
        min: { value: 1, message: '1 이상' },
        max: { value: 100, message: '100 이하' },
      }}
    >
      <Input type="number" placeholder="1~100" />
    </FormField>
  ),
}

export const WithRulesPattern: Story = {
  name: 'Validation / Pattern',
  render: (args) => (
    <FormField
      {...args}
      label="이메일"
      rules={{
        required: '필수',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '이메일 형식이 올바르지 않습니다',
        },
      }}
    >
      <Input placeholder="example@email.com" />
    </FormField>
  ),
}

export const WindSoftControlMatrix: Story = {
  name: 'WindSoft 컨트롤 기준',
  render: () => {
    const [teams, setTeams] = useState<string[]>(['design'])
    const [notifications, setNotifications] = useState(true)
    return (
      <main className="min-h-screen bg-background px-[var(--windsoft-page-gutter)] py-ws-8 text-foreground">
        <div className="mx-auto max-w-4xl space-y-ws-8">
          <header className="space-y-ws-2">
            <p className="text-label font-medium text-brand">WINDSOFT · FORM SYSTEM</p>
            <h1 className="text-page-title">작업 정보</h1>
            <p className="text-body text-secondary">공통 높이와 상태 표현을 사용하는 관리 화면 입력 예시입니다.</p>
          </header>

          <section className="grid gap-ws-6 rounded-card border border-border bg-surface p-ws-6 md:grid-cols-2">
            <FormField label="작업 이름" required hint="프로젝트 안에서 식별하기 쉬운 이름을 입력하세요.">
              <Input placeholder="예: 사용자 포털 개선" />
            </FormField>
            <FormField label="담당 팀" hint="여러 팀을 선택할 수 있습니다.">
              <MultiSelect
                options={[{ value: 'design', label: '디자인' }, { value: 'platform', label: '플랫폼 운영' }, { value: 'support', label: '고객 지원' }]}
                value={teams}
                onChange={setTeams}
                placeholder="팀 선택"
              />
            </FormField>
            <FormField label="진행 상태" required>
              <Select options={[{ value: 'planned', label: '예정' }, { value: 'active', label: '진행 중' }, { value: 'done', label: '완료' }]} placeholder="상태 선택" />
            </FormField>
            <FormField label="목표 완료일">
              <DateTimePicker mode="date" />
            </FormField>
            <FormField label="작업량" hint="예상 인시를 숫자로 입력하세요.">
              <NumberInput unit="시간" placeholder="0" />
            </FormField>
            <FormField label="작업 담당자 이메일 주소" error="회사 도메인 이메일을 입력해 주세요. 계정 권한이 없으면 관리자에게 문의하세요.">
              <Input defaultValue="user@example.net" />
            </FormField>
            <FormField label="상세 설명" className="md:col-span-2">
              <Textarea placeholder="요청 배경과 완료 기준을 작성하세요." />
            </FormField>
            <div className="flex flex-wrap items-center gap-ws-6 md:col-span-2">
              <Checkbox label="관련 부서와 공유" defaultChecked />
              <Radio label="일반 우선순위" name="priority" defaultChecked />
              <span className="inline-flex items-center gap-ws-2 text-label text-foreground">
                알림 받기 <Switch label="알림 받기" checked={notifications} onChange={setNotifications} />
              </span>
              <Input disabled aria-label="비활성 참고 정보" value="관리자 전용 항목" readOnly />
            </div>
          </section>
        </div>
      </main>
    )
  },
}
