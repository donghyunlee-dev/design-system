# Nested Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate multi-level Sidebar component while preserving the existing flat Sidebar API and appearance.

**Architecture:** Add `SidebarNested` with recursive keyed items; parents are disclosure buttons and leaves use the shared `renderLink` adapter. Active leaves mark their ancestor path for initial and route-change expansion. Expansion remains local, seeded by active ancestors and optional `defaultExpandedKeys`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4.3.3, Vitest, Testing Library, Storybook.

**Spec:** [Nested Sidebar Design](../specs/2026-10-28-sidebar-nested-design.md)

## Global Constraints

- Keep `Sidebar` and its current behavior unchanged.
- Add no runtime dependencies or router-specific imports.
- Reuse WindSoft semantic tokens and `NavigationLinkRenderer`.
- Parent items with children only expand/collapse; only leaf items navigate.

## Review Focus

- Empty children are treated as leaves only if they have an `href`; prevent rendering a disclosure control without content.
- Duplicate keys can break disclosure state and DOM IDs; document the unique-key requirement and avoid key-derived DOM IDs.
- Route changes into another active leaf must reveal its ancestor groups without breaking manual expansion/collapse.
- Nested children remain hidden from assistive technology when collapsed and are reachable after expansion.
- Long and deeply nested labels must wrap/truncate consistently without shifting disclosure controls.

## File Structure

- Create `src/components/navigation/SidebarNested.tsx` for recursive rendering and expansion state.
- Create `src/components/navigation/SidebarNested.test.tsx` for interaction and accessibility contracts.
- Create `src/components/navigation/SidebarNested.stories.tsx` for one-level comparison, grouped navigation, and deep navigation.
- Modify `src/index.ts` to export component and public types.
- Modify `docs/USAGE.md` and `docs/CHECKLIST.md` to explain component choice and host-app responsibilities.

## Tasks

### Task 1: Build the recursive SidebarNested component

**Files:**
- Create: `src/components/navigation/SidebarNested.tsx`
- Create: `src/components/navigation/SidebarNested.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces `SidebarNestedItem` with required unique `key` and `label`, optional `icon`, `href`, `active`, and recursive `children`.
- Produces `SidebarNestedProps` with `items`, `className`, `label`, `renderLink`, and optional `defaultExpandedKeys`.
- Exports `SidebarNested` using named navigation landmark, disclosure buttons for parents, and `NavigationLink` for leaf links.

- [x] Write tests for nested rendering, leaf hover/active styling, parent disclosure `aria-expanded`, hidden collapsed children, keyboard activation, `renderLink` forwarding, active ancestor expansion, and expansion after active route changes.
- [x] Run `npm test -- src/components/navigation/SidebarNested.test.tsx` and confirm failures are due to missing component/API.
- [x] Implement the recursive component and export its public types from `src/index.ts`.
- [x] Rerun the focused test and `npm test -- src/components/navigation/Sidebar.test.tsx`; both pass.

### Task 2: Add Storybook examples and usage guidance

**Files:**
- Create: `src/components/navigation/SidebarNested.stories.tsx`
- Modify: `docs/USAGE.md`
- Modify: `docs/CHECKLIST.md`

**Interfaces:**
- Consumes the `SidebarNested` public API produced by Task 1.

- [x] Add Storybook stories for grouped two-level menus, deeper nesting, active route ancestry, and initial expanded groups.
- [x] Document when to select `Sidebar` versus `SidebarNested`, unique keys, router adapter usage, and permission/route ownership in the app.
- [x] Update the checklist to distinguish component-level nested navigation from app-owned responsive shell and authorization behavior.
- [x] Run `npm run build-storybook`, `npm test`, `npx tsc --noEmit`, `npm run build`, and `git diff --check`.

### Task 3: Review and deliver

- [x] Independent review found no blockers; inspect final diff and public type declarations, confirming existing `Sidebar` behavior is unchanged.
- [x] Record final results: 50 test files / 232 tests, typecheck, package build, Storybook build, package verification, and `git diff --check` passed. Rendered browser screenshot review was unavailable because no browser executable is installed.
