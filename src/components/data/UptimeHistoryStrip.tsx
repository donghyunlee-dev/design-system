import { cn } from '../../utils/cn'
import { Tooltip } from '../overlay/Tooltip'

/**
 * 일별 가동 상태를 나타내는 이산 값. SystemHealthStatus와 동일한 팔레트를 사용한다.
 */
export type UptimeDayStatus = 'operational' | 'degraded' | 'outage' | 'maintenance' | 'nodata'

export interface UptimeDay {
  /** 표시용 날짜 (예: "2026-08-05") — 툴팁에 노출 */
  date: string
  status: UptimeDayStatus
  /** 툴팁에 상태 라벨 뒤에 덧붙일 보조 설명 (예: "09:12 지연 발생") */
  note?: string
}

const DAY_COLOR: Record<UptimeDayStatus, string> = {
  operational: 'bg-success',
  degraded: 'bg-warning',
  outage: 'bg-danger',
  maintenance: 'bg-muted',
  nodata: 'bg-surface-subtle',
}

const DAY_LABEL: Record<UptimeDayStatus, string> = {
  operational: '정상',
  degraded: '지연',
  outage: '장애',
  maintenance: '점검중',
  nodata: '데이터 없음',
}

export interface UptimeHistoryStripProps {
  /** 오래된 날짜 → 최근 날짜 순으로 정렬된 일별 상태 목록 (예: 최근 90일) */
  days: UptimeDay[]
  /** 스트립 좌측에 표시할 라벨 (예: 시스템명) */
  label?: string
  /** 스트립 우측에 표시할 요약 (예: "99.98% uptime") */
  summary?: string
  className?: string
}

/**
 * 컴포넌트별 일별 가동 상태를 색상 블록으로 나열하는 히스토리 스트립.
 * BarChart/LineChart와 달리 축이 있는 연속형 데이터가 아닌 이산적 일별 상태를 표현할 때 사용한다.
 */
export function UptimeHistoryStrip({ days, label, summary, className }: UptimeHistoryStripProps) {
  return (
    <div className={cn('w-full', className)}>
      {(label || summary) && (
        <div className="flex items-center justify-between mb-2">
          {label && <p className="text-sm font-medium text-foreground">{label}</p>}
          {summary && <p className="text-xs text-muted">{summary}</p>}
        </div>
      )}
      <div className="flex gap-0.5">
        {days.map((day, i) => (
          <Tooltip key={i} content={`${day.date} · ${DAY_LABEL[day.status]}${day.note ? ` · ${day.note}` : ''}`}>
            <span className={cn('flex-1 h-6 rounded-sm', DAY_COLOR[day.status])} />
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
