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
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-muted mb-4 text-4xl">{icon}</div>}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
