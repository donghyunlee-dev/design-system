import { ReactNode, useId } from 'react'
import { Button } from '../foundation/Button'
import { Icon } from '../foundation/Icon'
import { cn } from '../../utils/cn'

export type ErrorFallbackLayout = 'inline' | 'section' | 'page'

export interface ErrorFallbackProps {
  /** 표시 위치에 맞는 밀도와 정렬 */
  layout?: ErrorFallbackLayout
  /** 오류 상태 제목 */
  title?: ReactNode
  /** 사용자가 취할 수 있는 다음 단계 */
  description?: ReactNode
  /** 기본 경고 아이콘을 대체할 아이콘 */
  icon?: ReactNode
  /** 운영 지원에 사용할 안전한 요청/참조 코드 */
  referenceCode?: string
  /** 기본 재시도 버튼 동작. primaryAction이 있으면 대체됩니다. */
  onRetry?: () => void
  /** 재시도 버튼 레이블 */
  retryLabel?: string
  /** 기본 재시도 대신 표시할 사용자 액션 */
  primaryAction?: ReactNode
  /** 보조 사용자 액션 */
  secondaryAction?: ReactNode
  className?: string
}

const layoutClass: Record<ErrorFallbackLayout, string> = {
  inline: 'flex w-full min-w-0 flex-col gap-ws-3 sm:flex-row sm:items-center',
  section: 'flex min-h-64 w-full flex-col items-center justify-center gap-ws-3 px-ws-4 py-ws-8 text-center',
  page: 'flex min-h-full w-full flex-col items-center justify-center gap-ws-4 px-ws-4 py-ws-12 text-center',
}

/** 실패한 화면 영역을 대체하는 표시 컴포넌트입니다. 오류 포착과 복구는 호출부에서 처리합니다. */
export function ErrorFallback({
  layout = 'section',
  title = '요청을 처리하지 못했습니다',
  description = '잠시 후 다시 시도해 주세요.',
  icon,
  referenceCode,
  onRetry,
  retryLabel = '다시 시도',
  primaryAction,
  secondaryAction,
  className,
}: ErrorFallbackProps) {
  const titleId = useId()
  const descriptionId = useId()
  const referenceCodeId = useId()
  const describedBy = [description ? descriptionId : undefined, referenceCode ? referenceCodeId : undefined]
    .filter((id): id is string => Boolean(id))
    .join(' ') || undefined
  const primary = primaryAction ?? (onRetry ? (
    <Button type="button" size={layout === 'inline' ? 'sm' : 'md'} onClick={onRetry}>
      {retryLabel}
    </Button>
  ) : null)

  return (
    <section
      role="alert"
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      className={cn(layoutClass[layout], className)}
    >
      <div aria-hidden="true" className="shrink-0 text-danger">
        {icon ?? <Icon name="warning" size={layout === 'inline' ? 'md' : 'lg'} />}
      </div>
      <div className={cn('min-w-0', layout === 'inline' && 'flex-1 text-left')}>
        <h2 id={titleId} className={cn('font-semibold text-foreground', layout === 'inline' ? 'text-label' : 'text-section-title')}>
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="mt-ws-1 text-body text-secondary">
            {description}
          </p>
        )}
        {referenceCode && (
          <p id={referenceCodeId} className="mt-ws-1 text-caption text-muted">문의 코드: {referenceCode}</p>
        )}
      </div>
      {(secondaryAction || primary) && (
        <div className={cn(
          'flex flex-wrap items-center gap-ws-2',
          layout === 'inline' ? 'sm:ml-auto sm:shrink-0' : 'justify-center'
        )}>
          {secondaryAction}
          {primary}
        </div>
      )}
    </section>
  )
}
