# Admin Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin workspace page template with breadcrumb, toolbar, search, data grid, and pagination.

**Architecture:** A controlled presentation template composes existing navigation, form, table, and pagination components. Data loading and query behavior remain with the caller.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Testing Library, Storybook.

**Spec:** `docs/superpowers/specs/2026-10-29-admin-detail-page-design.md`

## Global Constraints

- Keep the template usable inside `AdminShell` and tabbed workspaces.
- Reuse existing components and public type conventions.
- Do not add API fetching, tabs, detail fields, or history.

## Review Focus

- Empty rows still render the table's existing empty state and pagination remains at the bottom.
- Long titles, toolbar actions, and search controls fit narrow viewports without horizontal page overflow.
- Search value and page changes are forwarded to the supplied callbacks.
- Breadcrumb router links use the existing `renderLink` adapter.
- Loading state is not part of the approved spec; do not infer or add a new loading contract.

---

### Task 1: Implement and export AdminDetailPage

**Files:**
- Create: `src/templates/admin/AdminDetailPage.tsx`
- Create: `src/templates/admin/AdminDetailPage.test.tsx`
- Modify: `src/templates/index.ts`
- Modify: `src/stories/templates/Admin.stories.tsx`

**Interfaces:**
- Consumes: `BreadcrumbItem`, `Column<T>`, `PaginationProps`, and existing `SearchField`, `Table`, `Pagination` components.
- Produces: `AdminDetailPage<T>` and `AdminDetailPageProps<T>` exported from the templates barrel and package root.

- [x] **Step 1: Write a failing behavior test**

Test that the component renders the breadcrumb, title, toolbar, search field, row data, and pagination in the documented order; typing forwards the search value and changing pages forwards the page number. Include the `renderLink` adapter and empty rows case.

- [x] **Step 2: Run the focused test and confirm it fails because the template is missing**

Run: `npm test -- src/templates/admin/AdminDetailPage.test.tsx`
Expected: FAIL due to the missing export/module.

- [x] **Step 3: Implement `AdminDetailPage<T>`**

Use controlled props for `searchValue`, `onSearchChange`, and `pagination`; accept `breadcrumb`, `renderLink`, `title`, `actions`, `columns`, `data`, `rowKey`, and optional `onRowClick`. Keep layout responsive and reuse existing components.

- [x] **Step 4: Export and add a Storybook example**

Export both component and prop type from `src/templates/index.ts`; add one representative admin detail workspace story.

- [x] **Step 5: Run focused and project validation**

Run: `npm test -- src/templates/admin/AdminDetailPage.test.tsx`
Expected: PASS.

Run: `npm test`
Expected: PASS.

Run: `npm run build`
Expected: PASS with the public component and declarations emitted.
