import { ReactNode } from 'react'
import { SearchField } from '../../components/form/SearchField'
import { Column, Table } from '../../components/data/Table'
import { Pagination, PaginationProps } from '../../components/navigation/Pagination'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { NavigationLinkRenderer } from '../../components/navigation/NavigationLink'
import { cn } from '../../utils/cn'

export interface AdminDetailPageProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /** 현재 화면까지의 경로 */
  breadcrumb: BreadcrumbItem[]
  /** 페이지 제목 */
  title: string
  /** 제목 오른쪽의 주요 작업 버튼 */
  actions?: ReactNode
  /** 검색 입력값 */
  searchValue: string
  /** 검색 입력 변경 콜백 */
  onSearchChange: (value: string) => void
  /** 검색 입력 안내 문구 */
  searchPlaceholder?: string
  /** 그리드 열 정의 */
  columns: Column<T>[]
  /** 현재 페이지에 표시할 데이터 */
  data: T[]
  /** 각 행의 고유 키 필드 */
  rowKey: keyof T
  /** 페이지 탐색 상태 */
  pagination: PaginationProps
  /** 행 선택 콜백 */
  onRowClick?: (row: T) => void
  /** 앱 라우터 링크 렌더러 */
  renderLink?: NavigationLinkRenderer
  className?: string
}

/** 경로, 작업 도구, 검색, 데이터 그리드, 페이지 탐색을 배치하는 관리자 화면 템플릿입니다. */
export function AdminDetailPage<T extends Record<string, unknown> = Record<string, unknown>>({
  breadcrumb,
  title,
  actions,
  searchValue,
  onSearchChange,
  searchPlaceholder = '검색어를 입력하세요',
  columns,
  data,
  rowKey,
  pagination,
  onRowClick,
  renderLink,
  className,
}: AdminDetailPageProps<T>) {
  return (
    <div className={cn('min-h-full w-full min-w-0 bg-background', className)}>
      <div className="mx-auto w-full max-w-7xl min-w-0 px-[var(--windsoft-page-gutter)] py-ws-6">
        <div className="mb-ws-3">
          <Breadcrumb items={breadcrumb} renderLink={renderLink} />
        </div>

        <div className="mb-ws-5 flex min-w-0 flex-wrap items-center justify-between gap-ws-3">
          <h1 className="min-w-0 break-words text-page-title text-foreground">{title}</h1>
          {actions && <div className="flex min-w-0 flex-wrap items-center gap-ws-2">{actions}</div>}
        </div>

        <div className="mb-ws-4 w-full max-w-md">
          <SearchField
            aria-label="검색"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={event => onSearchChange(event.target.value)}
          />
        </div>

        <Table columns={columns} data={data} rowKey={rowKey} onRowClick={onRowClick} />

        <div className="mt-ws-4 flex justify-end overflow-x-auto">
          <Pagination {...pagination} />
        </div>
      </div>
    </div>
  )
}
