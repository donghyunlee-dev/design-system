# Admin Shell Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide the reusable header controls and an admin SPA shell template with a collapsible, resizable LNB.

**Architecture:** Add a compact `SearchField` and `AccountMenu` to the component library, reusing existing `Input`, `Icon`, `Avatar`, and `DropdownMenu`. Add an `AdminShell` template that composes those pieces with the existing `Navbar` and `SidebarNested`; sidebar visibility and width behavior belong to this admin-specific template.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library, Storybook.

**Spec:** User request in the conversation on 2026-10-28: add only components justified for reuse, compose them into an admin site template, then let the user review that template.

## Global Constraints

- Keep React 19 and Tailwind CSS 4.3.3; add no dependency.
- Keep current public component APIs compatible.
- Leave routing, persistence, and content data ownership to the consuming app.
- Keep shell-level LNB collapse and resize behavior in the template, not base `Sidebar` components.

## Review Focus

- Search input remains labeled and forwards native input props and ref.
- Account trigger exposes identity and menu semantics while preserving keyboard use.
- LNB can be hidden and restored, resized by pointer and keyboard, and remains usable on narrow viewports.
- Consumer-provided header/footer/content slots render without requiring an account menu or search field.
- Router links continue to use the existing `renderLink` adapter.

## Files

- Create `src/components/form/SearchField.tsx`, its test and Storybook story.
- Create `src/components/foundation/AccountMenu.tsx`, its test and Storybook story.
- Create `src/templates/admin/AdminShell.tsx` and its test; add its Storybook example to `src/stories/templates/Admin.stories.tsx`.
- Modify `src/index.ts` and `src/templates/index.ts` to export public APIs.
- Regenerate `mcp-server/src/generated/manifest.ts` using the repository script.
- Update `docs/USAGE.md` with component and shell examples.

### Task 1: SearchField

- [x] Write tests for accessible search labeling, native props/ref forwarding, and clear browser-native search type.
- [x] Run the focused test and confirm it fails because `SearchField` is absent.
- [x] Implement `SearchField` using `Input` and the existing search `Icon`.
- [x] Add a Storybook example and export the component and props.
- [x] Run the focused test.

### Task 2: AccountMenu

- [x] Write tests for identity display, avatar fallback, menu item activation, and accessible trigger label.
- [x] Run the focused test and confirm it fails because `AccountMenu` is absent.
- [x] Implement `AccountMenu` using `Avatar` and `DropdownMenu`.
- [x] Add a Storybook example and export the component and related types.
- [x] Run the focused test.

### Task 3: AdminShell

- [x] Write tests for header, optional account/search slots, nested navigation, footer/content slots, collapse/restore, pointer resize, keyboard resize, and router adapter forwarding.
- [x] Run the focused test and confirm it fails because `AdminShell` is absent.
- [x] Implement the shell with a consumer-controlled collapse API and internal resize state; use a zero-width hidden LNB and default width 224px, with resizable bounds 180–360px.
- [x] Add a Storybook example and export the template and props.
- [x] Run the focused test.

### Task 4: Package integration

- [x] Add usage documentation for the reusable controls and shell composition.
- [x] Regenerate the MCP manifest.
- [x] Run focused tests, typecheck, package build, Storybook build, package verification, and `git diff --check`.
- [x] Review the complete diff and report the resulting template for user review.
- [x] After user approval, prepare the minor release and production deployment.
