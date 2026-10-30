# Theme Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure production components and templates use semantic theme tokens for all UI text, surfaces, borders, and statuses.

**Approach:** Audit production TSX for fixed palette utility classes, add a regression test for those classes, convert every current violation, then validate source, tests, and builds.

**Files:** `src/tokens.test.ts`; `src/templates/analytics/ReportLayout.tsx`; `src/templates/analytics/MonitoringBoard.tsx`; `src/templates/account/LoginSimple.tsx`; `src/templates/workflows/ApprovalView.tsx`; add/update focused template tests as needed.

### Tasks

1. [x] Add a failing source audit test for fixed foreground/background/border palette utilities in components, templates, and stories. It found 47 violations before the fixes.
2. [x] Convert all violations to semantic tokens, retaining print-specific colors and intentionally translucent overlay scrims.
3. [x] Add focused rendering assertions for the affected templates.
4. [x] Run source audit, full suite, package build, Storybook build, TypeScript check, package verification, and final diff checks.

## Verification

- `npm test`: 66 files / 288 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build-storybook`: passed.
- `npm run verify:package`: passed.
- `git diff --check`: passed.
