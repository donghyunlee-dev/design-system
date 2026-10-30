import type { Meta } from '@storybook/react'
export { IncidentComposerStory, Approval, Kanban, Schedule, Inbox, IssueList, SystemIssueTrackerStory, RequestQueue, SavedViewIssueBoardStory } from './Business.shared'

const meta: Meta = {
  title: 'Templates/Workflows',
  parameters: { layout: 'fullscreen', docs: { codePanel: true } },
}
export default meta
