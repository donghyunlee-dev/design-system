import { ReactNode } from 'react'

/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트.
 */
export interface EmptyStateProps {
  /** 빈 상태 아이콘 */
  icon?: ReactNode
  /** 빈 상태 제목 */
  title: string
  /** 보조 설명 텍스트 */
  description?: string
  /** 액션 버튼 등 추가 요소 */
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-ws-2 py-ws-12 text-center">
      {icon && <div aria-hidden="true" className="mb-ws-2 text-4xl text-muted">{icon}</div>}
      <p className="text-section-title text-foreground">{title}</p>
      {description && <p className="max-w-prose text-body text-secondary">{description}</p>}
      {action && <div className="mt-ws-2">{action}</div>}
    </div>
  )
}
