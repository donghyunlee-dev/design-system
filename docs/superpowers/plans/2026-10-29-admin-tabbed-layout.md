# AdminTabbedLayout Implementation Plan

> Implement this plan inline without adding dependencies.

**Goal:** Add a Chrome-inspired admin page-tab workspace to `template > admin`.

**Spec:** `docs/superpowers/specs/2026-10-29-admin-tabbed-layout-design.md`

## Review Focus

- Verify router callbacks are preserved and capacity prevents navigation without removing existing work.
- Verify closing the selected tab chooses the left neighbor and then home.
- Verify home cannot close and context actions target the right-clicked tab.
- Verify reordering updates route/tab identity without losing mounted page state.
- Inspect proportions, active surface connection, close affordance, and theme contrast in rendered AdminShell stories.

## Tasks

### Task 1: Route click contract and tab workspace

1. Add failing tests for optional navigation click forwarding and SidebarNested callback composition.
2. Add failing AdminTabbedLayout tests for home navigation, LNB-created/deduplicated tabs, capacity, closing, context actions, and page retention.
3. Implement `AdminTabbedLayout` using `AdminShell`, app-owned routing, and existing drag-and-drop dependencies.
4. Export the template and its route/props types through `src/templates/index.ts`.

### Task 2: Storybook, docs, and validation

1. Add a realistic interactive AdminTabbedLayout story with route state, a dashboard home, and several page types.
2. Document router integration and tab-limit behavior in `docs/USAGE.md` and the generated MCP manifest.
3. Run focused tests, full `npm test`, `npm run build`, `npm run verify:package`, `npm run build-storybook`, and `git diff --check`.
4. Inspect desktop/narrow and Light/Dark Storybook rendering, including right-click context actions.

## Completion

- [x] Added and exported `AdminTabbedLayout` with router callbacks, fixed home, capped route tabs, page retention, reorder, close controls, and context actions.
- [x] Added Home icon and optional link click forwarding for app-router adapters.
- [x] Added interactive desktop/mobile Storybook examples and usage documentation.
- [x] Independent review finding on focus restoration was fixed with a regression test that failed before the fix.
- [x] `npm test` (59 files, 267 tests), `npx tsc --noEmit`, `npm run build`, `npm run verify:package`, `npm run build-storybook`, and `git diff --check` passed.
- [x] Reviewed rendered Light/Dark and narrow layouts plus the tab context menu.
