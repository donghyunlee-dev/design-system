import { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface SearchFilterProps {
  /** 검색 입력. 일반적으로 SearchField를 전달합니다. 필터만 있는 화면에서는 생략합니다. */
  search?: ReactNode
  /** 화면별 상태, 유형, 기간 필터 등의 슬롯 */
  filters?: ReactNode
  /** 조회·초기화 등 검색 영역의 액션 */
  actions?: ReactNode
  /** 선택된 필터와 전체 초기화 액션을 표시하는 보조 행 */
  activeFilters?: ReactNode
  /** 접근 가능한 검색 영역 이름 */
  ariaLabel?: string
  className?: string
}

/** 검색 입력, 필터와 조회 액션을 목록 위에 정렬하는 업무 화면용 영역입니다. */
export function SearchFilter({
  search,
  filters,
  actions,
  activeFilters,
  ariaLabel = '목록 검색 및 필터',
  className,
}: SearchFilterProps) {
  return (
    <section role="search" aria-label={ariaLabel} className={cn('flex min-w-0 flex-col gap-ws-2', className)}>
      <div className="flex min-w-0 flex-col gap-ws-2 sm:flex-row sm:flex-wrap sm:items-center">
        {search && <div className="w-full min-w-0 sm:min-w-[16rem] sm:flex-1">{search}</div>}
        {filters && (
          <div className="flex w-full min-w-0 flex-wrap items-center gap-ws-2 sm:w-auto sm:flex-none sm:[&>*]:w-auto">
            {filters}
          </div>
        )}
        {actions && (
          <div className="flex w-full flex-wrap items-center justify-end gap-ws-2 sm:ml-auto sm:w-auto sm:shrink-0">
            {actions}
          </div>
        )}
      </div>
      {activeFilters && (
        <div className="flex min-w-0 flex-wrap items-center gap-ws-2 border-t border-border pt-ws-2">
          {activeFilters}
        </div>
      )}
    </section>
  )
}
