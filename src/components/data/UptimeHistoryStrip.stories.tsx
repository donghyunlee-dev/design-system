import type { Meta, StoryObj } from '@storybook/react'
import { UptimeHistoryStrip, UptimeDay } from './UptimeHistoryStrip'

const meta: Meta<typeof UptimeHistoryStrip> = {
  title: 'Data/UptimeHistoryStrip',
  component: UptimeHistoryStrip,
}
export default meta
type Story = StoryObj<typeof UptimeHistoryStrip>

function makeDays(count: number, pattern: UptimeDay['status'][]): UptimeDay[] {
  return Array.from({ length: count }, (_, i) => {
    const day = new Date(2026, 4, 6 + i)
    return {
      date: day.toISOString().slice(0, 10),
      status: pattern[i % pattern.length],
    }
  })
}

export const Default: Story = {
  render: () => (
    <UptimeHistoryStrip
      label="ERP"
      summary="99.98% uptime"
      days={makeDays(90, ['operational'])}
    />
  ),
}

export const WithIncidents: Story = {
  render: () => (
    <UptimeHistoryStrip
      label="OMS"
      summary="99.42% uptime"
      days={[
        ...makeDays(85, ['operational']),
        { date: '2026-08-01', status: 'degraded', note: '09:12 응답 지연' },
        { date: '2026-08-02', status: 'operational' },
        { date: '2026-08-03', status: 'maintenance', note: '정기 점검' },
        { date: '2026-08-04', status: 'outage', note: '03:20 서비스 중단' },
        { date: '2026-08-05', status: 'operational' },
      ]}
    />
  ),
}
