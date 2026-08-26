import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Button } from '../../components/foundation/Button'
import { Checkbox } from '../../components/form/Checkbox'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { Input } from '../../components/form/Input'
import { FormField } from '../../components/form/FormField'
import { Switch } from '../../components/form/Switch'
import { Tag } from '../../components/data/Tag'
import { cn } from '../../utils/cn'
import { IncidentRecord } from './SystemStatusBoard'

export interface IncidentComposerSystem {
  id: string
  /** 시스템명 (예: ERP, OMS, WMS) */
  name: string
}

export interface IncidentComposerChannel {
  id: string
  /** 채널명 (예: 이메일, 팀즈, SMS) */
  label: string
  checked: boolean
}

export interface IncidentComposerProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  /** 공지 대상으로 선택 가능한 전체 시스템 목록 */
  systems: IncidentComposerSystem[]
  /** 선택된 시스템 id 목록 */
  selectedSystemIds: string[]
  onToggleSystem: (id: string) => void
  incidentStatus: IncidentRecord['status']
  onIncidentStatusChange: (status: IncidentRecord['status']) => void
  incidentTitle: string
  onIncidentTitleChange: (value: string) => void
  message: string
  onMessageChange: (value: string) => void
  /** 발송 채널 목록 (예: 이메일/팀즈/SMS) */
  channels: IncidentComposerChannel[]
  onToggleChannel: (id: string) => void
  /** 이 공지 대상 시스템의 최근 업데이트 이력 (미리보기 하단에 표시) */
  recentUpdates?: IncidentRecord['updates']
  onPublish?: () => void
  onCancel?: () => void
  isPublishing?: boolean
  className?: string
}

const INCIDENT_STATUS_OPTIONS: { value: IncidentRecord['status']; label: string }[] = [
  { value: 'investigating', label: '조사중' },
  { value: 'monitoring', label: '모니터링중' },
  { value: 'resolved', label: '해결됨' },
]

const INCIDENT_STATUS_LABEL: Record<IncidentRecord['status'], string> = {
  investigating: '조사중',
  monitoring: '모니터링중',
  resolved: '해결됨',
}

const INCIDENT_STATUS_CLASS: Record<IncidentRecord['status'], string> = {
  investigating: 'text-danger border-danger/30 bg-danger/10',
  monitoring: 'text-warning border-warning/30 bg-warning/10',
  resolved: 'text-success border-success/30 bg-success/10',
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-card shadow-card p-5">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  )
}

export function IncidentComposer({
  title,
  breadcrumb,
  systems,
  selectedSystemIds,
  onToggleSystem,
  incidentStatus,
  onIncidentStatusChange,
  incidentTitle,
  onIncidentTitleChange,
  message,
  onMessageChange,
  channels,
  onToggleChannel,
  recentUpdates,
  onPublish,
  onCancel,
  isPublishing,
  className,
}: IncidentComposerProps) {
  const selectedSystems = systems.filter(s => selectedSystemIds.includes(s.id))

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onCancel}>취소</Button>
            <Button variant="primary" onClick={onPublish} disabled={isPublishing}>
              {isPublishing ? '게시 중...' : '게시 및 알림 발송'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* 작성 영역 */}
          <div className="space-y-4">
            <SectionCard title="영향받는 시스템">
              <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                {systems.map(s => (
                  <Checkbox
                    key={s.id}
                    label={s.name}
                    checked={selectedSystemIds.includes(s.id)}
                    onChange={() => onToggleSystem(s.id)}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="공지 내용">
              <div className="space-y-4">
                <FormField label="제목" required>
                  <Input
                    value={incidentTitle}
                    onChange={e => onIncidentTitleChange(e.target.value)}
                    placeholder="예: OMS 주문 접수 지연"
                  />
                </FormField>
                <FormField label="상태">
                  <Select
                    options={INCIDENT_STATUS_OPTIONS}
                    value={incidentStatus}
                    onChange={e => onIncidentStatusChange(e.target.value as IncidentRecord['status'])}
                  />
                </FormField>
                <FormField label="업데이트 내용" required>
                  <Textarea
                    rows={4}
                    value={message}
                    onChange={e => onMessageChange(e.target.value)}
                    placeholder="현재 상황과 대응 계획을 입력하세요"
                  />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="알림 발송 채널">
              <div className="space-y-3">
                {channels.map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{c.label}</span>
                    <Switch checked={c.checked} onChange={() => onToggleChannel(c.id)} label={c.label} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* 미리보기 영역 */}
          <div className="lg:sticky lg:top-6">
            <SectionCard title="구독자에게 보이는 미리보기">
              <div className="bg-background border border-border rounded-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">
                    {incidentTitle || '(제목 미입력)'}
                  </p>
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0',
                      INCIDENT_STATUS_CLASS[incidentStatus]
                    )}
                  >
                    {INCIDENT_STATUS_LABEL[incidentStatus]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedSystems.length === 0 && (
                    <span className="text-xs text-muted">영향받는 시스템을 선택하세요</span>
                  )}
                  {selectedSystems.map(s => (
                    <Tag key={s.id}>{s.name}</Tag>
                  ))}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {message || '업데이트 내용을 입력하면 여기에 표시됩니다.'}
                </p>
                {recentUpdates && recentUpdates.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border space-y-2">
                    {recentUpdates.map((u, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <span className="text-muted flex-shrink-0">{u.time}</span>
                        <span className="text-foreground">{u.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted mt-3">
                {channels.filter(c => c.checked).length > 0
                  ? `${channels.filter(c => c.checked).map(c => c.label).join(', ')} 채널로 구독자에게 발송됩니다.`
                  : '선택된 발송 채널이 없습니다.'}
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
