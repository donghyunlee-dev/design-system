import type { StoryObj, Meta } from '@storybook/react'
import { Stack } from './Stack'
import { Grid } from './Grid'
import { Badge } from '../foundation/Badge'

const meta: Meta = { title: 'Layout/Stack' }
export default meta

export const VerticalStack: StoryObj = {
  render: () => (
    <Stack gap={3}>
      <Badge>항목 1</Badge>
      <Badge>항목 2</Badge>
      <Badge>항목 3</Badge>
    </Stack>
  ),
}

export const HorizontalStack: StoryObj = {
  render: () => (
    <Stack direction="row" gap={2} align="center">
      <Badge>좌측</Badge>
      <Badge variant="success">중앙</Badge>
      <Badge variant="danger">우측</Badge>
    </Stack>
  ),
}

export const GridLayout: StoryObj = {
  render: () => (
    <Grid cols={3} gap={4}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="bg-surface-raised border border-border rounded-card p-4 text-sm text-muted">
          항목 {i + 1}
        </div>
      ))}
    </Grid>
  ),
}
