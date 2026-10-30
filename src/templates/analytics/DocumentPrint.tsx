import { ReactNode } from 'react'
import { Table, Column } from '../../components/data/Table'
import { Divider } from '../../components/layout/Divider'
import { Stack } from '../../components/layout/Stack'
import { Grid } from '../../components/layout/Grid'
import { Tag } from '../../components/data/Tag'
import { cn } from '../../utils/cn'

/** 발신처/수신처 등 문서 당사자 정보 */
export interface DocumentPrintParty {
  /** 상호/성명 */
  name: string
  /** 추가 정보 라인 (사업자번호, 주소, 연락처 등) */
  info?: string[]
}

/** 품목 라인아이템 */
export interface DocumentPrintLineItem extends Record<string, unknown> {
  id: string
  name: string
  /** 규격/단위 */
  spec?: string
  qty: number
  unitPrice: number
  amount: number
}

/** 하단 합계 항목 (공급가액, 세액, 합계 등) */
export interface DocumentPrintSummaryItem {
  label: string
  value: string
  /** 강조 표시 (예: 합계 금액) */
  emphasis?: boolean
}

export interface DocumentPrintProps {
  /** 문서 제목 (예: 거래명세서, 발주서) */
  title?: string
  /** 문서 번호 */
  docNumber: string
  /** 발행일 */
  issueDate: string
  /** 상태 태그 (예: 발행완료) */
  statusTag?: string
  from: DocumentPrintParty
  to: DocumentPrintParty
  items: DocumentPrintLineItem[]
  summary?: DocumentPrintSummaryItem[]
  /** 약관/특기사항 */
  notes?: string
  /** 서명/직인란 레이블 목록 (예: ['공급자', '공급받는자']) */
  signatureLabels?: string[]
  /** 인쇄/다운로드 등 상단 액션 */
  actions?: ReactNode
  className?: string
}

function formatAmount(n: number) {
  return n.toLocaleString('ko-KR')
}

export function DocumentPrint({
  title = '거래명세서',
  docNumber,
  issueDate,
  statusTag,
  from,
  to,
  items,
  summary,
  notes,
  signatureLabels,
  actions,
  className,
}: DocumentPrintProps) {
  const columns: Column<DocumentPrintLineItem>[] = [
    { key: 'name', header: '품목', render: row => (
      <div>
        <p className="text-sm text-foreground">{row.name}</p>
        {row.spec && <p className="text-xs text-muted">{row.spec}</p>}
      </div>
    ) },
    { key: 'qty', header: '수량', width: '80px', render: row => <span>{formatAmount(row.qty)}</span> },
    { key: 'unitPrice', header: '단가', width: '120px', render: row => <span>{formatAmount(row.unitPrice)}</span> },
    { key: 'amount', header: '금액', width: '140px', render: row => <span className="font-medium">{formatAmount(row.amount)}</span> },
  ]

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-3xl mx-auto px-[var(--page-padding)] py-6">
        {actions && (
          <div className="flex justify-end gap-2 mb-4 print:hidden">{actions}</div>
        )}

        {/* 인쇄 영역 */}
        <div className="bg-surface border border-border rounded-card shadow-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted mt-1">문서번호 {docNumber} · 발행일 {issueDate}</p>
            </div>
            {statusTag && <Tag>{statusTag}</Tag>}
          </div>

          <Grid cols={2} gap={6} className="mb-6">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">공급자</p>
              <p className="text-sm font-medium text-foreground">{from.name}</p>
              {from.info?.map((line, i) => (
                <p key={i} className="text-xs text-muted mt-0.5">{line}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">공급받는자</p>
              <p className="text-sm font-medium text-foreground">{to.name}</p>
              {to.info?.map((line, i) => (
                <p key={i} className="text-xs text-muted mt-0.5">{line}</p>
              ))}
            </div>
          </Grid>

          <Table columns={columns} data={items} rowKey="id" className="mb-4" />

          {summary && summary.length > 0 && (
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <Stack gap={2}>
                  {summary.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className={cn('text-sm', s.emphasis ? 'font-semibold text-foreground' : 'text-muted')}>{s.label}</span>
                      <span className={cn('text-sm', s.emphasis ? 'font-bold text-foreground text-base' : 'text-foreground')}>{s.value}</span>
                    </div>
                  ))}
                </Stack>
              </div>
            </div>
          )}

          {notes && (
            <>
              <Divider />
              <p className="text-xs text-muted whitespace-pre-line">{notes}</p>
            </>
          )}

          {signatureLabels && signatureLabels.length > 0 && (
            <div className={cn('grid gap-6 mt-8', signatureLabels.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
              {signatureLabels.map((label, i) => (
                <div key={i} className="text-center">
                  <div className="h-16 border-b border-border" />
                  <p className="text-xs text-muted mt-2">{label} (서명 또는 직인)</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
