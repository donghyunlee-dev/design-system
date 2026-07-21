import { ReactNode } from 'react'
import { Table, Column } from '../../components/data/Table'
import { Select } from '../../components/form/Select'
import { Progress } from '../../components/feedback/Progress'
import { Alert } from '../../components/feedback/Alert'
import { Tag } from '../../components/data/Tag'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

/** 원본 컬럼 ↔ 시스템 필드 매핑 항목 */
export interface ImportColumnMapping extends Record<string, unknown> {
  /** 업로드 파일의 원본 컬럼명 */
  sourceColumn: string
  /** 매핑된 시스템 필드 값 (미매핑 시 빈 문자열) */
  targetField: string
  /** 원본 데이터 샘플 값 */
  sample?: string
}

/** 검증 결과 미리보기 행 */
export interface ImportValidationRow extends Record<string, unknown> {
  id: string
  rowNumber: number
  /** 컬럼명 -> 값 */
  data: Record<string, string>
  status: 'valid' | 'error' | 'warning'
  message?: string
}

export interface BulkImportProps {
  title?: string
  /** 업로드된 파일명 */
  fileName?: string
  /** 전체 행 수 */
  totalRows?: number
  /** 업로드/검증 진행률 (0~100). 미지정 시 진행률 바를 표시하지 않음 */
  progress?: number
  /** 컬럼 매핑 목록 */
  mappings: ImportColumnMapping[]
  /** 매핑 대상 필드 선택지 */
  targetFieldOptions: { value: string; label: string }[]
  onMappingChange?: (sourceColumn: string, targetField: string) => void
  /** 검증 결과 미리보기 행 */
  validationRows?: ImportValidationRow[]
  actions?: ReactNode
  className?: string
}

const STATUS_LABEL: Record<ImportValidationRow['status'], string> = {
  valid: '정상',
  warning: '경고',
  error: '오류',
}

export function BulkImport({
  title = '대량 데이터 반입',
  fileName,
  totalRows,
  progress,
  mappings,
  targetFieldOptions,
  onMappingChange,
  validationRows,
  actions,
  className,
}: BulkImportProps) {
  const errorCount = validationRows?.filter(r => r.status === 'error').length ?? 0
  const warningCount = validationRows?.filter(r => r.status === 'warning').length ?? 0
  const validCount = validationRows?.filter(r => r.status === 'valid').length ?? 0

  const mappingColumns: Column<ImportColumnMapping>[] = [
    { key: 'sourceColumn', header: '원본 컬럼' },
    { key: 'sample', header: '샘플 값', render: row => <span className="text-muted">{row.sample ?? '-'}</span> },
    {
      key: 'targetField',
      header: '매핑 필드',
      width: '220px',
      render: row => (
        <Select
          options={targetFieldOptions}
          placeholder="필드 선택"
          value={row.targetField}
          onChange={e => onMappingChange?.(row.sourceColumn, e.target.value)}
        />
      ),
    },
  ]

  const previewColumnKeys = validationRows && validationRows.length > 0
    ? Object.keys(validationRows[0].data)
    : []
  const validationColumns: Column<ImportValidationRow>[] = [
    { key: 'rowNumber', header: '행', width: '60px' },
    ...previewColumnKeys.map(key => ({
      key,
      header: key,
      render: (row: ImportValidationRow) => <span>{row.data[key]}</span>,
    })),
    {
      key: 'status',
      header: '검증 결과',
      width: '160px',
      render: row => (
        <Stack direction="row" gap={2} align="center">
          <Tag className={cn(
            row.status === 'error' && 'text-danger border-danger/30 bg-danger/10',
            row.status === 'warning' && 'text-warning border-warning/30 bg-warning/10',
            row.status === 'valid' && 'text-success border-success/30 bg-success/10',
          )}>
            {STATUS_LABEL[row.status]}
          </Tag>
          {row.message && <span className="text-xs text-muted">{row.message}</span>}
        </Stack>
      ),
    },
  ]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* 1. 업로드 파일 정보 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">
              {fileName ?? '업로드된 파일 없음'}
            </p>
            {totalRows !== undefined && (
              <p className="text-xs text-muted">전체 {totalRows.toLocaleString('ko-KR')}행</p>
            )}
          </div>
          {progress !== undefined && <Progress value={progress} />}
        </div>

        {/* 2. 컬럼 매핑 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-2">컬럼 매핑</h2>
          <Table columns={mappingColumns} data={mappings} rowKey="sourceColumn" />
        </div>

        {/* 3. 검증 결과 미리보기 */}
        {validationRows && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">검증 결과 미리보기</h2>
            {errorCount > 0 ? (
              <Alert variant="danger" title="반영 전 확인이 필요합니다" className="mb-3">
                오류 {errorCount}건, 경고 {warningCount}건, 정상 {validCount}건이 확인되었습니다.
              </Alert>
            ) : warningCount > 0 ? (
              <Alert variant="warning" title="경고 항목이 있습니다" className="mb-3">
                경고 {warningCount}건, 정상 {validCount}건이 확인되었습니다.
              </Alert>
            ) : (
              <Alert variant="success" title="모든 행이 검증을 통과했습니다" className="mb-3">
                정상 {validCount}건. 반영을 진행할 수 있습니다.
              </Alert>
            )}
            <Table columns={validationColumns} data={validationRows} rowKey="id" />
          </div>
        )}
      </div>
    </div>
  )
}
