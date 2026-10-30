import { ReactNode, useId } from 'react'
import { EmptyState } from '../../components/feedback/EmptyState'
import { ErrorFallback } from '../../components/feedback/ErrorFallback'
import { Icon } from '../../components/foundation/Icon'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export type ErrorStateVariant = 'empty' | 'forbidden' | 'notFound' | 'serverError'

const VARIANT_CONFIG: Record<ErrorStateVariant, { icon: ReactNode; title: string; description: string }> = {
  empty:       { icon: <Icon name="info" size="lg" className="text-muted" />, title: '데이터가 없습니다', description: '아직 등록된 항목이 없습니다.' },
  forbidden:   { icon: <Icon name="info" size="lg" className="text-muted" />, title: '접근 권한이 없습니다', description: '이 페이지를 볼 수 있는 권한이 없습니다. 담당자에게 권한을 요청해 주세요.' },
  notFound:    { icon: <Icon name="help" size="lg" className="text-muted" />, title: '페이지를 찾을 수 없습니다', description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.' },
  serverError: { icon: <Icon name="warning" size="lg" className="text-danger" />, title: '오류가 발생했습니다', description: '일시적인 서버 오류로 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
}

export interface ErrorStateProps {
  /** 표준 상태 유형 — 지정 시 icon/title/description 기본값 제공 */
  variant: ErrorStateVariant
  /** 기본 제목을 덮어씀 */
  title?: string
  /** 기본 설명을 덮어씀 */
  description?: string
  /** 기본 아이콘을 덮어씀 */
  icon?: ReactNode
  /** 오류 코드 등 부가 정보 (예: "Error 500") */
  code?: string
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  className?: string
}

/** 빈 데이터, 권한, 경로, 서버 오류의 페이지 상태를 표시합니다. */
export function ErrorState({
  variant,
  title,
  description,
  icon,
  code,
  primaryAction,
  secondaryAction,
  className,
}: ErrorStateProps) {
  const config = VARIANT_CONFIG[variant]
  const resolvedTitle = title ?? config.title
  const resolvedDescription = description ?? config.description
  const titleId = useId()
  const descriptionId = useId()

  if (variant === 'serverError') {
    return (
      <ErrorFallback
        layout="page"
        title={resolvedTitle}
        description={resolvedDescription}
        icon={icon ?? config.icon}
        referenceCode={code}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        className={className}
      />
    )
  }

  if (variant === 'empty') {
    return (
      <section className={cn('flex min-h-full w-full flex-col items-center justify-center bg-background px-ws-4 py-ws-12', className)}>
        {code && <p className="mb-ws-2 text-center text-caption font-semibold tracking-wide text-muted">{code}</p>}
        <EmptyState
          icon={icon ?? config.icon}
          title={resolvedTitle}
          description={resolvedDescription}
          action={(primaryAction || secondaryAction) && (
            <Stack direction="row" gap={2} justify="center">
              {secondaryAction}
              {primaryAction}
            </Stack>
          )}
        />
      </section>
    )
  }

  return (
    <section
      role="status"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn('flex min-h-full w-full flex-col items-center justify-center bg-background px-ws-4 py-ws-12 text-center', className)}
    >
      {code && <p className="mb-ws-2 text-center text-caption font-semibold tracking-wide text-muted">{code}</p>}
      <div aria-hidden="true" className="shrink-0 text-muted">{icon ?? config.icon}</div>
      <div className="min-w-0">
        <h2 id={titleId} className="mt-ws-3 text-section-title font-semibold text-foreground">{resolvedTitle}</h2>
        <p id={descriptionId} className="mt-ws-1 max-w-prose text-body text-secondary">{resolvedDescription}</p>
      </div>
      {(primaryAction || secondaryAction) && (
        <Stack direction="row" gap={2} justify="center" className="mt-ws-3">
          {secondaryAction}
          {primaryAction}
        </Stack>
      )}
    </section>
  )
}
