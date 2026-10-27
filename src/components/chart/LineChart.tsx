import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

/**
 * 시계열 데이터를 꺾은선 차트로 표시하는 컴포넌트. recharts 기반.
 */
export interface LineChartProps {
  /** 차트 데이터 배열 */
  data: Record<string, unknown>[]
  /** 라인 설정 목록 */
  lines: { key: string; label: string; color?: string }[]
  /** X축으로 사용할 데이터 키 */
  xKey: string
  /** 차트 높이(px) */
  height?: number
}

export function LineChart({ data, lines, xKey, height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 'var(--font-size-caption)', fill: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }} />
        <YAxis tick={{ fontSize: 'var(--font-size-caption)', fill: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }} />
        <Tooltip contentStyle={{ background: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-caption)', boxShadow: 'var(--shadow-raised)' }} />
        <Legend wrapperStyle={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-caption)' }} />
        {lines.map(line => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color ?? 'var(--color-brand)'}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  )
}
