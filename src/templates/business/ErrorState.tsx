import { ReactNode } from 'react'
import { EmptyState } from '../../components/feedback/EmptyState'
import { Card } from '../../components/data/Card'
import { Stack } from '../../components/layout/Stack'
import { cn } from '../../utils/cn'

export type ErrorStateVariant = 'empty' | 'forbidden' | 'notFound' | 'serverError'

const VARIANT_CONFIG: Record<ErrorStateVariant, { icon: string; title: string; description: string }> = {
  empty:       { icon: '📭', title: '데이터가 없습니다', description: '아직 등록된 항목이 없습니다.' },
  forbidden:   { icon: '🔒', title: '접근 권한이 없습니다', description: '이 페이지를 볼 수 있는 권한이 없습니다. 담당자에게 권한을 요청해 주세요.' },
  notFound:    { icon: '❓', title: '페이지를 찾을 수 없습니다', description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.' },
  serverError: { icon: '⚠️', title: '오류가 발생했습니다', description: '일시적인 서버 오류로 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
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

  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center', className)}>
      <Card className="max-w-md w-full mx-4" padding="lg">
        {code && <p className="text-center text-xs font-semibold text-muted tracking-wider mb-2">{code}</p>}
        <EmptyState
          icon={icon ?? config.icon}
          title={title ?? config.title}
          description={description ?? config.description}
          action={
            (primaryAction || secondaryAction) && (
              <Stack direction="row" gap={2} justify="center">
                {secondaryAction}
                {primaryAction}
              </Stack>
            )
          }
        />
      </Card>
    </div>
  )
}
