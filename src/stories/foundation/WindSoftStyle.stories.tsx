import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../../components/foundation/Badge'
import { Button } from '../../components/foundation/Button'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'

const meta: Meta = {
  title: 'Foundation/WindSoft Style',
  parameters: { layout: 'fullscreen', backgrounds: { default: 'light' } },
}
export default meta
type Story = StoryObj

export const AdminBaseline: Story = {
  render: () => (
    <main className="min-h-screen bg-background px-[var(--windsoft-page-gutter)] py-ws-8 text-foreground">
      <div className="mx-auto max-w-5xl space-y-ws-8">
        <header className="space-y-ws-2">
          <p className="text-label font-medium text-brand">WINDSOFT · ADMIN SYSTEM</p>
          <h1 className="text-page-title">운영 현황</h1>
          <p className="text-body text-secondary">사람과 함께 흐르는 기술로, 업무를 명확하게 관리합니다.</p>
        </header>

        <section className="grid gap-ws-4 sm:grid-cols-3" aria-label="브랜드 색상">
          {[
            ['브랜드 네이비', '#0B2D5B'], ['액션 블루', '#3B82F6'], ['보조 민트', '#14B8A6'],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-ws-3 rounded-card border border-border bg-surface p-ws-4">
              <span className="size-10 rounded-md" style={{ backgroundColor: color }} />
              <span><span className="block text-label font-medium">{label}</span><code className="text-caption text-secondary">{color}</code></span>
            </div>
          ))}
        </section>

        <section className="grid gap-ws-4 md:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-ws-6 rounded-card border border-border bg-surface p-ws-6 shadow-card">
            <div className="flex items-start justify-between gap-ws-4">
              <div className="space-y-ws-1">
                <h2 className="text-section-title">계정 설정</h2>
                <p className="text-caption text-secondary">기본 정보와 접근 권한을 관리합니다.</p>
              </div>
              <Badge variant="success">활성</Badge>
            </div>
            <div className="grid gap-ws-4 sm:grid-cols-2">
              <label className="space-y-ws-2 text-label font-medium">담당자 이름<Input defaultValue="김민서" /></label>
              <label className="space-y-ws-2 text-label font-medium">권한<Select options={[{ value: 'admin', label: '관리자' }, { value: 'member', label: '구성원' }]} /></label>
            </div>
            <div className="flex flex-wrap justify-end gap-ws-2 border-t border-border-subtle pt-ws-4">
              <Button variant="secondary">취소</Button><Button>변경 사항 저장</Button>
            </div>
          </article>
          <aside className="space-y-ws-4 rounded-card border border-border bg-surface p-ws-6">
            <h2 className="text-section-title">스타일 기준</h2>
            <dl className="space-y-ws-3 text-body">
              <div className="flex justify-between gap-ws-2"><dt className="text-secondary">기본 단위</dt><dd>4px 리듬</dd></div>
              <div className="flex justify-between gap-ws-2"><dt className="text-secondary">컨트롤 높이</dt><dd>32 / 40 / 48px</dd></div>
              <div className="flex justify-between gap-ws-2"><dt className="text-secondary">카드 모서리</dt><dd>8px</dd></div>
            </dl>
            <p className="border-t border-border-subtle pt-ws-4 text-caption text-secondary">작은 화면에서는 페이지 여백을 16px로 줄이고, 데이터 표는 가로 스크롤을 유지합니다.</p>
          </aside>
        </section>
      </div>
    </main>
  ),
}
