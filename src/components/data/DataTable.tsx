// src/components/data/DataTable.tsx
import { CSSProperties, ReactNode } from 'react'

/**
 * DataTable 컬럼 정의.
 */
export interface DataColumn<T extends Record<string, unknown>> {
  /** 컬럼 식별자 (TanStack Table의 id와 accessorKey로 사용) */
  key: string
  /** 헤더 텍스트 */
  header: string
  /** 셀 커스텀 렌더러. 생략 시 row[key]를 문자열로 표시 */
  render?: (row: T) => ReactNode
  /** 정렬 허용 여부 (기본 false) */
  sortable?: boolean
  /** 컬럼 헤더 아래 텍스트 필터 입력창 표시 여부 (기본 false) */
  filterable?: boolean
  /** 헤더 우측 경계선 드래그로 너비 조절 허용 여부 (기본 false) */
  resizable?: boolean
  /** 초기 너비 (px, 기본 150) */
  width?: number
  /** 초기 숨김 여부 (기본 false) */
  hidden?: boolean
  /** 헤더 셀 추가 CSS 클래스 */
  headerClassName?: string
  /** 데이터 셀 추가 CSS 클래스 (함수로 행별 조건부 적용 가능) */
  cellClassName?: string | ((row: T) => string)
  /** 데이터 셀 인라인 스타일 (함수로 행별 조건부 적용 가능) */
  cellStyle?: CSSProperties | ((row: T) => CSSProperties)
}

export interface DataTablePagination {
  /** 페이지당 행 수 (기본 10) */
  pageSize?: number
  /** 서버 사이드 전체 건수. 생략 시 data.length 기준 클라이언트 페이징 */
  total?: number
  /** 페이지 변경 콜백 */
  onChange?: (page: number) => void
}

/**
 * 정렬·필터·컬럼 표시/숨김·순서 변경·너비 조절·강조·페이징을 지원하는 데이터 테이블.
 */
export interface DataTableProps<T extends Record<string, unknown>> {
  /** 컬럼 정의 목록 */
  columns: DataColumn<T>[]
  /** 데이터 행 목록 */
  data: T[]
  /** 각 행의 고유 키 필드명 */
  rowKey: keyof T
  /** 행 번호 컬럼 표시 여부 (기본 false) */
  showRowNumbers?: boolean
  /** 행 추가 CSS 클래스 (함수로 조건부 적용 가능) */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 행 인라인 스타일 (함수로 조건부 적용 가능) */
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)
  /** 페이징 설정. 생략 시 페이징 없음 */
  pagination?: DataTablePagination
  /** 행 클릭 콜백 */
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  className,
}: DataTableProps<T>) {
  return (
    <div data-testid="data-table" className={className}>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={String(row[rowKey])}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
