import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { chartTheme, getChartSeriesColor } from './chartTheme'

/**
 * 비율 데이터를 원형 차트로 표시하는 컴포넌트. recharts 기반.
 */
export interface PieChartProps {
  /** 차트 데이터 배열 */
  data: { name: string; value: number; color?: string }[]
  /** 차트 높이(px) */
  height?: number
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} stroke={chartTheme.separator} label={{ fill: chartTheme.label }}>
          {data.map((item, i) => (
            <Cell key={i} fill={item.color ?? getChartSeriesColor(i)} stroke={chartTheme.separator} />
          ))}
        </Pie>
        <Tooltip contentStyle={chartTheme.tooltip} />
        <Legend wrapperStyle={chartTheme.legend} />
      </RePieChart>
    </ResponsiveContainer>
  )
}
