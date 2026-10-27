import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

/**
 * 카테고리 데이터를 막대 차트로 표시하는 컴포넌트. recharts 기반.
 */
export interface BarChartProps {
  /** 차트 데이터 배열 */
  data: Record<string, unknown>[]
  /** 막대 설정 목록 */
  bars: { key: string; label: string; color?: string }[]
  /** X축으로 사용할 데이터 키 */
  xKey: string
  /** 차트 높이(px) */
  height?: number
}

export function BarChart({ data, bars, xKey, height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 'var(--font-size-caption)', fill: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }} />
        <YAxis tick={{ fontSize: 'var(--font-size-caption)', fill: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }} />
        <Tooltip contentStyle={{ background: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-caption)', boxShadow: 'var(--shadow-raised)' }} />
        <Legend wrapperStyle={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-caption)' }} />
        {bars.map(bar => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color ?? 'var(--color-brand)'}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}
