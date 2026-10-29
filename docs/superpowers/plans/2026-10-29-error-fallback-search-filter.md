# ErrorFallback and SearchFilter Implementation Plan

> **For agentic workers:** Implement this plan inline; do not add dependencies.

**Goal:** Add reusable ErrorFallback and SearchFilter UI compositions and apply them to current error and list templates without changing consumer behavior.

**Architecture:** Keep runtime error capture and query/filter semantics in the consuming app. Implement presentation-only components with existing WindSoft primitives, then compose them in the existing page/template layer. Preserve the current template props and search callback timing.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4.3.3, Storybook, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-29-error-fallback-search-filter-design.md`

## Global Constraints

- Add no runtime dependency or ErrorBoundary behavior.
- Preserve the existing `ErrorState`, `ListSearchTable`, and `DataTablePage` public props and callback timing.
- Keep an empty data state separate from a runtime error state.
- Use existing WindSoft semantic tokens and components; no emoji, icon circles, heavy cards, raw exception output, or forced `100vh` fallback.
- Keep filter schema, data fetching, retry implementation, and error reporting caller-owned.

## Review Focus

- Error fallback embedded in `AdminShell` must not impose viewport height or move the footer; test page layout classes and inspect Storybook composition.
- Error fallback must not expose raw exception text; test that only explicitly passed safe reference codes render.
- Empty state must remain distinct from runtime error; test each `ErrorState` branch.
- Search slots must wrap in the intended order without equal-width filter columns; test semantic order and responsive classes.
- Existing list templates must keep immediate search callbacks and current submit-button behavior; test callback timing and values.

## Files

- Create `src/components/feedback/ErrorFallback.tsx`, test, and Storybook story.
- Modify `src/templates/business/ErrorState.tsx` and its relevant story to compose `ErrorFallback` for server errors and `EmptyState` for empty data.
- Create `src/components/data/SearchFilter.tsx`, test, and Storybook story.
- Modify `src/templates/business/ListSearchTable.tsx` and `src/templates/admin/DataTablePage.tsx` to compose `SearchFilter` while retaining props and behavior.
- Modify `src/index.ts` to export both components and their prop types.
- Update Autodocs descriptions and the usage guide with component responsibilities and realistic examples.

## Tasks

### Task 1: ErrorFallback and ErrorState composition

1. Add failing tests for `inline`, `section`, and `page` content order; optional retry/reference code; no raw error input; and accessible labeling.
2. Run `npx vitest run src/components/feedback/ErrorFallback.test.tsx` and confirm failures are due to missing behavior.
3. Implement `ErrorFallback` with `layout?: 'inline' | 'section' | 'page'`, optional title/description/referenceCode/onRetry/retryLabel/secondaryAction/className, semantic warning icon, and no full-viewport sizing.
4. Add failing `ErrorState` regression assertions for empty/serverError separation and page shell sizing, run the focused test, then update `ErrorState` while preserving its current props/variants.
5. Add Storybook examples for all layouts and both generic and safe-reference-code states; keep error-boundary logic out of the component.
6. Run both focused test files and review the final source diff.

### Task 2: SearchFilter and list-template integration

1. Add failing component tests for required search slot, optional filters/actions/activeFilters, accessible landmark label, desktop slot order, and narrow wrapping classes.
2. Run `npx vitest run src/components/data/SearchFilter.test.tsx` and confirm the missing component causes the expected failures.
3. Implement `SearchFilter` as a controlled layout component with `search`, `filters`, `actions`, `activeFilters`, `ariaLabel`, and `className` slots; it owns no query state.
4. Add template regression tests first for `ListSearchTable` and `DataTablePage`: immediate callback behavior, query values, filter presence, and lookup action behavior.
5. Integrate the shared component into both templates, retaining existing APIs, local state, callback timing, and current query button behavior.
6. Add Storybook examples with realistic admin filters, active chips, and responsive wrapping.
7. Run focused SearchFilter and template tests and review the final source diff.

### Task 3: Package exports, documentation, and final verification

1. Export both components and prop types from `src/index.ts`; add Autodocs descriptions and a `docs/USAGE.md` section with an ErrorFallback example inside a host-provided boundary and a SearchFilter slot example.
2. Run `npm test` and fix regressions caused by this change; run `npm run build`, `npm run verify:package`, and `npm run build-storybook`.
3. Inspect representative Storybook views at desktop and narrow widths in Light and Dark themes, specifically checking ErrorFallback within an app shell and SearchFilter against a dense table.
4. Run `git diff --check` and report visual evidence or any unavailable browser limitation separately from automated results.

## Implementation Notes

- **Ruling:** Keep `icon` and arbitrary `primaryAction` props available on `ErrorFallback` so the existing `ErrorState` template can compose the new presentation without discarding its caller-supplied content; if wrong, the cost is a slightly wider fallback API.
- **Ruling:** Make SearchFilter's search slot optional to preserve `DataTablePage` screens that have filters but intentionally omit text search; if wrong, consumers can pass `null` instead without a behavior change.
- Use `src/components/feedback/EmptyState` for the existing empty branch; do not style empty data as an exception.
- SearchFilter actions are query actions only. Page-level actions such as create/export remain in the template's title/action row.
- Exact gaps and responsive breakpoints are implementation choices within existing tokens, confirmed in rendered stories.
- Use the current shared warning icon unless visual inspection shows a concrete recognition issue; only then extend the shared icon set.

## Completion

- [x] ErrorFallback and ErrorState composition, stories, and regression coverage.
- [x] SearchFilter and list-template integrations, stories, and regression coverage.
- [x] Package exports, usage documentation, and generated MCP manifest.
- [x] `npm test` (58 files, 260 tests), `npm run build`, `npm run verify:package`, `npm run build-storybook`, and `git diff --check` passed.
- [x] Reviewed SearchFilter in a narrow story, and ErrorFallback in AdminShell with a footer in dark theme; visual screenshots were inspected.
- [x] Independent final review found no actionable findings.
