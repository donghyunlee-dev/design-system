import { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface ReportLayoutProps {
  title: string
  subtitle?: string
  /** 출력일 문자열. 생략 시 오늘 날짜 자동 표시 */
  date?: string
  organization?: string
  /** 상단 요약 지표 (3개 권장) */
  summary?: { label: string; value: string }[]
  /** 본문 (Table 컴포넌트 등을 자유롭게 배치) */
  children?: ReactNode
  /** 하단 서명란 (담당/팀장/본부장 등) */
  signatures?: { label: string }[]
  className?: string
}

export function ReportLayout({
  title,
  subtitle,
  date,
  organization,
  summary,
  children,
  signatures,
  className,
}: ReportLayoutProps) {
  const today = date
    ?? new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  return (
    <div className={cn('bg-white min-h-screen', className)}>
      <div className="max-w-4xl mx-auto px-8 py-8 print:px-6 print:py-4">
        {/* 최상단: 조직 + 출력일 */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-3 mb-6">
          {organization
            ? <p className="text-sm text-gray-600">{organization}</p>
            : <span />
          }
          <p className="text-sm text-gray-600">{today}</p>
        </div>

        {/* 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {/* 요약 지표 */}
        {summary && summary.length > 0 && (
          <div
            className="grid border border-gray-300 mb-6"
            style={{ gridTemplateColumns: `repeat(${summary.length}, 1fr)` }}
          >
            {summary.map((s, i) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-2',
                  i < summary.length - 1 && 'border-r border-gray-300'
                )}
              >
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* 본문 */}
        <div className="mb-8">{children}</div>

        {/* 서명란 */}
        {signatures && signatures.length > 0 && (
          <div className="border border-gray-300 mt-8">
            <div
              className="grid border-b border-gray-300"
              style={{ gridTemplateColumns: `repeat(${signatures.length}, 1fr)` }}
            >
              {signatures.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'px-3 py-1 text-center text-xs text-gray-600',
                    i > 0 && 'border-l border-gray-300'
                  )}
                >
                  {s.label}
                </div>
              ))}
            </div>
            <div
              className="grid h-16"
              style={{ gridTemplateColumns: `repeat(${signatures.length}, 1fr)` }}
            >
              {signatures.map((_, i) => (
                <div
                  key={i}
                  className={cn(i > 0 && 'border-l border-gray-300')}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
