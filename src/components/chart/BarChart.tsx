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
import { chartTheme, getChartSeriesColor } from './chartTheme'

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
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey={xKey} stroke={chartTheme.axis} tick={chartTheme.tick} />
        <YAxis stroke={chartTheme.axis} tick={chartTheme.tick} />
        <Tooltip contentStyle={chartTheme.tooltip} />
        <Legend wrapperStyle={chartTheme.legend} />
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color ?? getChartSeriesColor(index)}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}
