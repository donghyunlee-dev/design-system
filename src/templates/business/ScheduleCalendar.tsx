import { ReactNode } from 'react'
import { Breadcrumb, BreadcrumbItem } from '../../components/navigation/Breadcrumb'
import { StatusBadge, StatusVariant } from '../../components/foundation/StatusBadge'
import { cn } from '../../utils/cn'

export interface ScheduleEvent {
  id: string
  label: string
  status?: StatusVariant
}

export interface ScheduleDay {
  /** 날짜 숫자 (1~31) */
  date: number
  /** 이번 달이 아닌 날짜(이전/다음 달 채움용) */
  outside?: boolean
  /** 오늘 여부 강조 */
  today?: boolean
  events?: ScheduleEvent[]
}

export interface ScheduleCalendarProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  /** "2026년 7월" 등 현재 월 레이블 */
  period: string
  onPrev?: () => void
  onNext?: () => void
  weekdays?: string[]
  /** 항상 7의 배수 길이 (주 단위) */
  days: ScheduleDay[]
  onDayClick?: (day: ScheduleDay) => void
  actions?: ReactNode
  className?: string
}

const DEFAULT_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function ScheduleCalendar({
  title,
  breadcrumb,
  period,
  onPrev,
  onNext,
  weekdays = DEFAULT_WEEKDAYS,
  days,
  onDayClick,
  actions,
  className,
}: ScheduleCalendarProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-6">
        {breadcrumb && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <button
              type="button"
              onClick={onPrev}
              className="text-muted hover:text-foreground transition-colors px-2"
              aria-label="이전 달"
            >
              ‹
            </button>
            <h2 className="text-base font-semibold text-foreground">{period}</h2>
            <button
              type="button"
              onClick={onNext}
              className="text-muted hover:text-foreground transition-colors px-2"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-border">
            {weekdays.map(w => (
              <div key={w} className="text-center text-xs font-medium text-muted py-2">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onDayClick?.(day)}
                className={cn(
                  'text-left align-top min-h-24 p-2 border-b border-r border-border hover:bg-surface-subtle transition-colors',
                  (i + 1) % 7 === 0 && 'border-r-0',
                  day.outside && 'bg-surface-subtle'
                )}
              >
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs',
                    day.today ? 'bg-brand text-white font-semibold' : day.outside ? 'text-muted' : 'text-foreground'
                  )}
                >
                  {day.date}
                </span>
                <div className="mt-1 space-y-1">
                  {day.events?.slice(0, 3).map(ev => (
                    <div key={ev.id} className="truncate">
                      <StatusBadge status={ev.status ?? 'pending'} label={ev.label} className="text-xs" />
                    </div>
                  ))}
                  {day.events && day.events.length > 3 && (
                    <p className="text-xs text-muted">+{day.events.length - 3}건 더보기</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
