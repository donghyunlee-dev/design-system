export const chartSeriesColors = [
  'var(--color-chart-series-1)',
  'var(--color-chart-series-2)',
  'var(--color-chart-series-3)',
  'var(--color-chart-series-4)',
  'var(--color-chart-series-5)',
] as const

export const chartTheme = {
  axis: 'var(--color-chart-axis)',
  grid: 'var(--color-chart-grid)',
  label: 'var(--color-chart-label)',
  separator: 'var(--color-chart-separator)',
  tick: {
    fontSize: 'var(--font-size-caption)',
    fill: 'var(--color-chart-label)',
    fontFamily: 'var(--font-body)',
  },
  tooltip: {
    background: 'var(--color-surface)',
    color: 'var(--color-foreground)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-card)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-caption)',
    boxShadow: 'var(--shadow-raised)',
  },
  legend: {
    color: 'var(--color-chart-label)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-caption)',
  },
} as const

export function getChartSeriesColor(index: number) {
  return chartSeriesColors[index % chartSeriesColors.length]
}
