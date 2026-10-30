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
import { chartTheme, getChartSeriesColor } from './chartTheme'

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
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey={xKey} stroke={chartTheme.axis} tick={chartTheme.tick} />
        <YAxis stroke={chartTheme.axis} tick={chartTheme.tick} />
        <Tooltip contentStyle={chartTheme.tooltip} />
        <Legend wrapperStyle={chartTheme.legend} />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color ?? getChartSeriesColor(index)}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  )
}
