
import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { Stepper } from '../../components/navigation/Stepper'
import { FileUpload } from '../../components/form/FileUpload'
import { Table, Column } from '../../components/data/Table'
import { Alert } from '../../components/feedback/Alert'
import { Progress } from '../../components/feedback/Progress'
import { StatusBadge } from '../../components/foundation/StatusBadge'
import { Button } from '../../components/foundation/Button'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export interface ImportColumnMapping extends Record<string, unknown> {
  id: string
  /** 업로드 파일의 원본 컬럼명 */
  sourceColumn: string
  /** 매핑될 시스템 필드명 */
  targetField: string
  required?: boolean
}

export interface ImportPreviewRow extends Record<string, unknown> {
  id: string | number
  status: 'valid' | 'warning' | 'error'
  /** 경고/오류 메시지 (있는 경우) */
  message?: string
}

export interface DataImportWizardProps {
  title?: string
  breadcrumb?: BreadcrumbItem[]
  /** 현재 단계 인덱스 (0: 업로드, 1: 컬럼 매핑, 2: 검증, 3: 완료) */
  step: number
  onFileChange?: (files: FileList | null) => void
  fileName?: string
  fileSize?: string
  mappings?: ImportColumnMapping[]
  /** 검증 미리보기에 표시할 원본 컬럼 (상태/메시지 컬럼은 자동 추가) */
  previewColumns?: { key: string; header: string }[]
  previewRows?: ImportPreviewRow[]
  /** 데이터 적재(커밋) 진행률 (0~100) */
  commitProgress?: number
  onPrev?: () => void
  onNext?: () => void
  nextLabel?: string
  actions?: ReactNode
  className?: string
}

const STEP_LABELS = ['업로드', '컬럼 매핑', '검증', '완료']

export function DataImportWizard({
  title = '데이터 일괄 업로드',
  breadcrumb,
  step,
  onFileChange,
  fileName,
  fileSize,
  mappings,
  previewColumns,
  previewRows,
  commitProgress,
  onPrev,
  onNext,
  nextLabel,
  actions,
  className,
}: DataImportWizardProps) {
  const summary = previewRows
    ? {
        total: previewRows.length,
        error: previewRows.filter(r => r.status === 'error').length,
        warning: previewRows.filter(r => r.status === 'warning').length,
      }
    : null

  const mappingColumns: Column<ImportColumnMapping>[] = [
    { key: 'sourceColumn', header: '원본 컬럼' },
    { key: 'targetField', header: '매핑 필드' },
    {
      key: 'required',
      header: '필수',
      width: '80px',
      render: m => (m.required
        ? <span className="text-xs font-medium text-danger">필수</span>
        : <span className="text-xs text-muted">선택</span>),
    },
  ]

  const previewTableColumns: Column<ImportPreviewRow>[] = [
    {
      key: 'status',
      header: '상태',
      width: '90px',
      render: r => (
        <StatusBadge
          status={r.status === 'valid' ? 'success' : r.status === 'warning' ? 'warning' : 'error'}
          label={r.status === 'valid' ? '정상' : r.status === 'warning' ? '경고' : '오류'}
        />
      ),
    },
    ...(previewColumns ?? []).map(c => ({
      key: c.key,
      header: c.header,
      render: (r: ImportPreviewRow) => String(r[c.key] ?? '-'),
    })),
    { key: 'message', header: '메시지', render: r => (r.message ? <span className="text-xs text-muted">{r.message}</span> : '-') },
  ]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {breadcrumb && <div className="mb-4"><Breadcrumb items={breadcrumb} /></div>}

        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 flex justify-center overflow-x-auto">
          <Stepper steps={STEP_LABELS} current={step} />
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 min-h-[280px]">
          {step === 0 && (
            <Stack gap={4}>
              <FileUpload accept=".csv,.xlsx" label="CSV 또는 Excel 파일을 선택하거나 끌어다 놓으세요" onChange={onFileChange} />
              {fileName && (
                <p className="text-sm text-foreground">
                  선택한 파일: <span className="font-medium">{fileName}</span>
                  {fileSize && <span className="text-muted"> ({fileSize})</span>}
                </p>
              )}
            </Stack>
          )}

          {step === 1 && mappings && (
            <Stack gap={3}>
              <p className="text-sm text-muted">업로드한 파일의 컬럼을 시스템 필드에 매핑하세요.</p>
              <Table columns={mappingColumns} data={mappings} rowKey="id" />
            </Stack>
          )}

          {step === 2 && previewRows && (
            <Stack gap={3}>
              {summary && summary.error > 0 && (
                <Alert variant="danger" title="검증 오류가 있습니다">
                  총 {summary.total}건 중 오류 {summary.error}건, 경고 {summary.warning}건이 확인되었습니다. 오류 건은 적재에서 제외됩니다.
                </Alert>
              )}
              {summary && summary.error === 0 && summary.warning > 0 && (
                <Alert variant="warning" title="확인이 필요한 경고가 있습니다">
                  총 {summary.total}건 중 경고 {summary.warning}건이 확인되었습니다.
                </Alert>
              )}
              {summary && summary.error === 0 && summary.warning === 0 && (
                <Alert variant="success" title="검증을 통과했습니다">
                  총 {summary.total}건 모두 정상입니다.
                </Alert>
              )}
              <Table columns={previewTableColumns} data={previewRows} rowKey="id" />
            </Stack>
          )}

          {step === 3 && (
            <Stack gap={4}>
              <Progress value={commitProgress ?? 100} />
              <p className="text-sm text-foreground">
                {(commitProgress ?? 100) >= 100
                  ? `적재가 완료되었습니다. 총 ${summary?.total ?? 0}건이 반영되었습니다.`
                  : `데이터 적재 중입니다... (${commitProgress ?? 0}%)`}
              </p>
            </Stack>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={onPrev} disabled={step === 0}>이전</Button>
          <Button variant="primary" onClick={onNext} disabled={step === STEP_LABELS.length - 1}>
            {nextLabel ?? (step === STEP_LABELS.length - 2 ? '적재 시작' : '다음')}
          </Button>
        </div>
      </div>
    </div>
  )
}
