import { useState } from 'react'
import { Stepper } from '../../components/navigation/Stepper'
import { Button } from '../../components/foundation/Button'
import { FileUpload } from '../../components/form/FileUpload'
import { Select } from '../../components/form/Select'
import { Table, Column } from '../../components/data/Table'
import { StatusBadge } from '../../components/foundation/StatusBadge'
import { Alert } from '../../components/feedback/Alert'
import { Tag } from '../../components/data/Tag'
import { cn } from '../../utils/cn'

const STEP_LABELS = ['파일 업로드', '컬럼 매핑', '검증 미리보기', '반영 완료']

export interface ImportColumnMapping extends Record<string, unknown> {
  /** 업로드 파일의 원본 컬럼명 */
  sourceColumn: string
  /** 매핑된 대상 필드 값 (미매핑 시 빈 문자열) */
  targetField: string
}

export interface ImportPreviewRow extends Record<string, unknown> {
  id: string | number
  /** 유효성 검증 결과 */
  status: 'valid' | 'warning' | 'error'
  /** 경고/오류 상세 메시지 */
  message?: string
}

export interface DataImportWizardProps {
  title?: string
  /** 업로드된 파일명 (1단계 완료 표시) */
  fileName?: string
  /** 파일 선택/드롭 콜백 */
  onUpload?: (files: FileList | null) => void
  /** 대상 필드 선택 옵션 (품목코드, 거래처명 등) */
  targetFieldOptions: { value: string; label: string }[]
  /** 컬럼 매핑 목록 (2단계) */
  mapping: ImportColumnMapping[]
  /** 매핑 변경 콜백 */
  onMappingChange?: (sourceColumn: string, targetField: string) => void
  /** 검증 미리보기 컬럼 (3단계) */
  previewColumns?: Column<ImportPreviewRow>[]
  /** 검증 미리보기 데이터 (3단계) */
  previewRows?: ImportPreviewRow[]
  /** 반영 완료 후 요약 (4단계) */
  summary?: { label: string; value: string }[]
  onCancel?: () => void
  /** 최종 반영(적용) 콜백 — 검증 단계에서 다음으로 진행 시 호출 */
  onSubmit?: () => void
  className?: string
}

export function DataImportWizard({
  title = '데이터 가져오기',
  fileName,
  onUpload,
  targetFieldOptions,
  mapping,
  onMappingChange,
  previewColumns,
  previewRows = [],
  summary,
  onCancel,
  onSubmit,
  className,
}: DataImportWizardProps) {
  const [step, setStep] = useState(0)

  const errorCount = previewRows.filter(r => r.status === 'error').length
  const warningCount = previewRows.filter(r => r.status === 'warning').length
  const validCount = previewRows.filter(r => r.status === 'valid').length

  const columns: Column<ImportPreviewRow>[] =
    previewColumns ?? [
      {
        key: 'status',
        header: '상태',
        width: '100px',
        render: row => <StatusBadge status={row.status === 'valid' ? 'success' : row.status === 'warning' ? 'warning' : 'error'} />,
      },
      { key: 'message', header: '메시지', render: row => row.message ?? '-' },
    ]

  const canGoNext = step === 0 ? !!fileName : step === 2 ? errorCount === 0 : true

  const handleNext = () => {
    if (step === 2) onSubmit?.()
    setStep(s => Math.min(s + 1, STEP_LABELS.length - 1))
  }
  const handlePrev = () => setStep(s => Math.max(s - 1, 0))

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>

        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 flex justify-center overflow-x-auto">
          <Stepper steps={STEP_LABELS} current={step} />
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 min-h-[320px]">
          {step === 0 && (
            <div className="space-y-4">
              <FileUpload accept=".csv,.xlsx" label="CSV 또는 XLSX 파일을 선택 또는 드래그" onChange={onUpload} />
              {fileName && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">선택된 파일</span>
                  <Tag>{fileName}</Tag>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <Table
              rowKey="sourceColumn"
              columns={[
                { key: 'sourceColumn', header: '원본 컬럼' },
                {
                  key: 'targetField',
                  header: '대상 필드',
                  render: row => (
                    <Select
                      options={targetFieldOptions}
                      placeholder="매핑 안 함"
                      value={row.targetField}
                      onChange={e => onMappingChange?.(row.sourceColumn, e.target.value)}
                    />
                  ),
                },
              ]}
              data={mapping}
            />
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Alert variant={errorCount > 0 ? 'danger' : warningCount > 0 ? 'warning' : 'success'}>
                전체 {previewRows.length}건 중 정상 {validCount}건, 경고 {warningCount}건, 오류 {errorCount}건
                {errorCount > 0 && ' — 오류 건이 있으면 반영할 수 없습니다.'}
              </Alert>
              <Table columns={columns} data={previewRows} rowKey="id" />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="text-4xl">✅</div>
              <p className="text-lg font-semibold text-foreground">데이터 반영이 완료되었습니다</p>
              {summary && (
                <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mt-2">
                  {summary.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <dt className="text-muted">{s.label}</dt>
                      <dd className="text-foreground font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={step === 0 ? onCancel : handlePrev}>
            {step === 0 ? '취소' : '이전'}
          </Button>
          {step < STEP_LABELS.length - 1 && (
            <Button variant="primary" onClick={handleNext} disabled={!canGoNext}>
              {step === 2 ? '반영' : '다음'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
