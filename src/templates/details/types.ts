import { ReactNode } from 'react'

/** DetailView, ApprovalView에서 공유하는 필드 정의 */
export interface DetailField {
  label: string
  value: ReactNode
  /** 그리드 colspan. 기본 1. 2로 설정하면 전체 너비 */
  span?: 1 | 2
}
