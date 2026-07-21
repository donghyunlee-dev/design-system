import { useState } from 'react'
import { Stepper } from '../../components/navigation/Stepper'
import { Button } from '../../components/foundation/Button'
import { FileUpload } from '../../components/form/FileUpload'
import { Select } from '../../components/form/Select'
import { Table, Column } from '../../components/data/Table'
import { StatusBadge } from '../../components/foundation/StatusBadge'
import { Tag } from '../../components/data/Tag'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { cn } from '../../utils/cn'

/** 임포트 대상 필드 정의 */
export interface ImportTargetField {
  key: string
  label: string
  required?: boolean
}

/** 업로드 파일의 원본 컬럼 → 대상 필드 매핑 */
export interface ImportColumnMapping extends Record<string, unknown> {
  sourceColumn: string
  /** 매핑된 대상 필드 키. 미매핑 시 null */
  targetKey: string | null
}

/** 검증 결과 행 (미리보기) */
export interface ImportValidationRow extends Record<string, unknown> {
  rowNumber: number
  /** 컬럼 키 -> 값 */
  cells: Record<string, string>
  status: 'valid' | 'warning' | 'error'
  message?: string
}

export interface DataImportWizardProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  fileName?: string
  onFileSelect?: (files: FileList | null) => void
  targetFields: ImportTargetField[]
  mapping: ImportColumnMapping[]
  onMappingChange?: (sourceColumn: string, targetKey: string | null) => void
  validationRows: ImportValidationRow[]
  importedCount?: number
  onImport?: () => void
  onCancel?: () => void
  className?: string
}

const STEP_LABELS = ['파일 업로드', '컬럼 매핑', '검증 결과', '완료']

export function DataImportWizard({
  title,
  breadcrumb,
  fileName,
  onFileSelect,
  targetFields,
  mapping,
  onMappingChange,
  validationRows,
  importedCount,
  onImport,
  onCancel,
  className,
}: DataImportWizardProps) {
  const [current, setCurrent] = useState(0)

  const errorCount = validationRows.filter(r => r.status === 'error').length
  const warningCount = validationRows.filter(r => r.status === 'warning').length

  const mappingColumns: Column<ImportColumnMapping>[] = [
    { key: 'sourceColumn', header: '원본 컬럼' },
    {
      key: 'targetKey',
      header: '대상 필드',
      render: row => (
        <Select
          value={row.targetKey ?? ''}
          onChange={e => onMappingChange?.(row.sourceColumn, e.target.value || null)}
          options={targetFields.map(f => ({ value: f.key, label: f.required ? `${f.label} *` : f.label }))}
          placeholder="매핑 안 함"
        />
      ),
    },
  ]

  const previewColumns: Column<ImportValidationRow>[] = [
    { key: 'rowNumber', header: '행', width: '60px' },
    ...mapping
      .filter(m => m.targetKey)
      .map((m): Column<ImportValidationRow> => ({
        key: m.targetKey as string,
        header: targetFields.find(f => f.key === m.targetKey)?.label ?? m.targetKey!,
        render: row => row.cells[m.targetKey as string] ?? '',
      })),
    {
      key: 'status',
      header: '상태',
      width: '140px',
      render: row => (
        <div className="flex items-center gap-2">
          <StatusBadge
            status={row.status === 'valid' ? 'success' : row.status === 'warning' ? 'warning' : 'error'}
            label={row.status === 'valid' ? '정상' : row.status === 'warning' ? '경고' : '오류'}
          />
          {row.message && <Tag>{row.message}</Tag>}
        </div>
      ),
    },
  ]

  const canProceed = current !== 2 || errorCount === 0

  const handleNext = () => {
    if (current === 3) return
    setCurrent(c => c + 1)
  }
  const handlePrev = () => setCurrent(c => c - 1)

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-4xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>

        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 flex justify-center overflow-x-auto">
          <Stepper steps={STEP_LABELS} current={current} />
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card p-6 mb-4 min-h-[320px]">
          {current === 0 && (
            <div className="space-y-4">
              <FileUpload
                label="CSV 또는 Excel 파일을 선택하거나 드래그하세요"
                accept=".csv,.xlsx,.xls"
                onChange={onFileSelect}
              />
              {fileName && (
                <p className="text-sm text-foreground">
                  선택된 파일: <span className="font-medium">{fileName}</span>
                </p>
              )}
            </div>
          )}

          {current === 1 && (
            <div>
              <p className="text-sm text-muted mb-4">업로드한 파일의 컬럼을 대상 필드에 매핑하세요.</p>
              <Table columns={mappingColumns} data={mapping} rowKey="sourceColumn" />
            </div>
          )}

          {current === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm text-muted">전체 {validationRows.length}건 미리보기</p>
                {warningCount > 0 && <Tag>경고 {warningCount}건</Tag>}
                {errorCount > 0 && <Tag>오류 {errorCount}건</Tag>}
              </div>
              <Table columns={previewColumns} data={validationRows} rowKey="rowNumber" />
              {errorCount > 0 && (
                <p className="text-sm text-danger mt-4 font-medium">
                  오류가 있는 행이 있어 반영할 수 없습니다. 원본 파일을 수정한 뒤 다시 업로드해 주세요.
                </p>
              )}
            </div>
          )}

          {current === 3 && (
            <div className="flex flex-col items-center justify-center h-56 gap-3">
              <div className="text-4xl">✅</div>
              <p className="text-lg font-semibold text-foreground">일괄 반영이 완료되었습니다</p>
              <p className="text-sm text-muted">총 {importedCount ?? validationRows.length}건 반영</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={current === 0 ? onCancel : handlePrev} disabled={current === 3}>
            {current === 0 ? '취소' : '이전'}
          </Button>
          {current < 3 ? (
            <Button
              variant="primary"
              onClick={current === 2 ? () => { onImport?.(); handleNext() } : handleNext}
              disabled={!canProceed}
            >
              {current === 2 ? '반영하기' : '다음'}
            </Button>
          ) : (
            <Button variant="primary" onClick={onCancel}>확인</Button>
          )}
        </div>
      </div>
    </div>
  )
}
