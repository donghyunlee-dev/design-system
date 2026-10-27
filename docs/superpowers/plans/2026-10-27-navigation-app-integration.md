# Navigation and App Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable router-aware link rendering, externally controlled tab state, and clear Toast provider failures while documenting component/application responsibility boundaries.

**Spec:** [Navigation and App Integration Contract](../specs/2026-10-27-navigation-app-integration-contract.md)

## Tasks

### Task 1: Lock public contracts with regression tests

- [x] Add tests for custom link rendering in Sidebar, Navbar, and Breadcrumb, preserving current href/aria/class/children behavior.
- [x] Add controlled Tabs tests for controlled selection, click callback, keyboard callback, and uncontrolled compatibility.
- [x] Add Toast tests for provider usage and the missing-provider error.
- [x] Add Modal `sm/md/lg` max-width mapping tests.
- [x] Run the focused tests and verify the new contract assertions fail before implementation.

### Task 2: Add router-agnostic link rendering

- [x] Define and export shared `NavigationLinkProps` and `NavigationLinkRenderer` types.
- [x] Add optional `renderLink` to Sidebar, Navbar, and Breadcrumb, keeping a native anchor as the default.
- [x] Add a Storybook example using a small app-side adapter shape without importing a router dependency.

### Task 3: Add controlled Tabs state

- [x] Add optional `value`, `defaultValue`, and `onValueChange` props.
- [x] Keep current first-item default selection and local state behavior when uncontrolled.
- [x] Route both pointer and keyboard selection through the controlled/uncontrolled state contract.
- [x] Add controlled Storybook usage and a React Router `useSearchParams` integration example in the guide.

### Task 4: Make Toast provider misuse fail visibly

- [x] Use a nullable context and throw a clear error from `useToast` when no provider exists.
- [x] Preserve existing provider rendering, variants, and auto-dismiss behavior.
- [x] Document the root-level provider setup and error behavior.

### Task 5: Clarify app and data responsibility boundaries

- [x] Document `Table` versus `DataTable`, client sorting/filtering, and server pagination callbacks accurately.
- [x] Add app integration checklist entries for shell height/scroll, permission-filtered menu rendering, LNB state/submenus, API/auth expiry handling, and responsive Sidebar/content behavior.
- [x] Keep Modal widths unchanged and record their tested Tailwind width contract.

### Task 6: Validate, review, and commit

- [x] Run focused tests, `npm test`, `npm run build`, `npm run build-storybook`, and `git diff --check`.
- [x] Inspect the final diff and ensure no routing dependency was added.
- [x] Independent review found no actionable issues; commit the scoped implementation with message `feat: improve router and app integration contracts`.
