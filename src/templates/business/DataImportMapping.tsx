import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Stepper } from '../../components/navigation/Stepper'
import { Select } from '../../components/form/Select'
import { Tag } from '../../components/data/Tag'
import { StatusBadge } from '../../components/foundation/StatusBadge'
import { Card } from '../../components/data/Card'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export interface ImportFieldOption {
  value: string
  label: string
}

export interface ImportColumnMapping {
  id: string
  /** 원본 파일의 컬럼명 */
  sourceColumn: string
  /** 원본 데이터 샘플 값 */
  sampleValue?: string
  /** 매핑된 시스템 필드 값 (미매핑 시 빈 문자열) */
  targetField: string
  /** 필수 매핑 여부 */
  required?: boolean
}

export interface ImportPreviewRow {
  id: string
  /** 컬럼 key -> 표시 값 */
  values: Record<string, ReactNode>
  status: 'success' | 'warning' | 'error'
  message?: string
}

export interface ImportPreviewColumn {
  key: string
  header: string
}

export interface DataImportMappingProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  /** 진행 단계 레이블 (예: ['업로드', '컬럼 매핑', '검증 미리보기', '완료']) */
  steps: string[]
  currentStep: number
  /** 업로드된 원본 파일명 */
  fileName?: string
  mappings: ImportColumnMapping[]
  fieldOptions: ImportFieldOption[]
  onMappingChange?: (id: string, targetField: string) => void
  previewColumns?: ImportPreviewColumn[]
  previewRows?: ImportPreviewRow[]
  summary?: { total: number; success: number; warning: number; error: number }
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  actions?: ReactNode
  className?: string
}

export function DataImportMapping({
  title,
  breadcrumb,
  steps,
  currentStep,
  fileName,
  mappings,
  fieldOptions,
  onMappingChange,
  previewColumns,
  previewRows,
  summary,
  onBack,
  onNext,
  nextLabel = '다음',
  actions,
  className,
}: DataImportMappingProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {fileName && <p className="text-sm text-muted mt-1">원본 파일: {fileName}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="mb-8">
          <Stepper steps={steps} current={currentStep} />
        </div>

        <Stack gap={6}>
          <Card title="컬럼 매핑" description="원본 컬럼을 시스템 필드에 매핑하세요.">
            <div className="w-full overflow-x-auto rounded-card border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface-raised border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">원본 컬럼</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">샘플 값</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">시스템 필드</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mappings.map(m => (
                    <tr key={m.id} className="bg-surface">
                      <td className="px-4 py-3 text-foreground font-medium">
                        {m.sourceColumn}
                        {m.required && <Tag className="ml-2">필수</Tag>}
                      </td>
                      <td className="px-4 py-3 text-muted">{m.sampleValue ?? '-'}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <Select
                          options={fieldOptions}
                          placeholder="매핑 안함"
                          value={m.targetField}
                          onChange={e => onMappingChange?.(m.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {previewColumns && previewRows && (
            <Card
              title="검증 미리보기"
              description={
                summary
                  ? `전체 ${summary.total}건 · 정상 ${summary.success} · 경고 ${summary.warning} · 오류 ${summary.error}`
                  : undefined
              }
            >
              <div className="w-full overflow-x-auto rounded-card border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface-raised border-b border-border">
                    <tr>
                      {previewColumns.map(col => (
                        <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                          {col.header}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewRows.map(row => (
                      <tr key={row.id} className="bg-surface">
                        {previewColumns.map(col => (
                          <td key={col.key} className="px-4 py-3 text-foreground">{row.values[col.key] ?? '-'}</td>
                        ))}
                        <td className="px-4 py-3">
                          <StatusBadge status={row.status} label={row.message} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium rounded-input border border-border text-foreground bg-surface hover:bg-surface-raised"
              >
                이전
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="px-4 py-2 text-sm font-medium rounded-input bg-brand text-white hover:opacity-90"
              >
                {nextLabel}
              </button>
            )}
          </div>
        </Stack>
      </div>
    </div>
  )
}
