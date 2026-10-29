# ErrorFallback and SearchFilter Design

**Status:** Design review requested

## Intent

Add two reusable UI compositions for WindSoft's information-dense admin and business screens:

- `ErrorFallback` presents a clear, recoverable error state inside an existing page or shell.
- `SearchFilter` provides a consistent layout for a list's search field, filters, related actions, and active-filter summary.

The deliverable is the visual UI and component/template composition. Error capture, reporting, data fetching, and filtering semantics remain owned by the consuming application or page template.

## Why

The repository already has a page-level `ErrorState`, an input-level `SearchField`, and list templates that compose their own search areas. Their layouts and behavior are inconsistent: `ErrorState` assumes a full viewport and wraps content in a card, while `ListSearchTable` and `DataTablePage` build search controls independently. Admin users need errors to stay within the failed content region and list controls to remain compact and predictable above dense tables.

## Current repository behavior

- `src/templates/business/ErrorState.tsx` provides `empty`, `forbidden`, `notFound`, and `serverError` states. It applies `min-h-screen`, a centered card, and emoji icons. `empty` overlaps semantically with the shared `EmptyState` component.
- `src/components/form/SearchField.tsx` is a search input with an icon; it does not lay out filters or actions.
- `src/templates/business/ListSearchTable.tsx` renders an input, arbitrary filter controls, and a submit button in a bordered card with shadow. Its `onSearch` currently runs on each input change and on submit.
- `src/templates/admin/DataTablePage.tsx` independently renders an input and filter chips; it has no reset or query-submit contract.
- `DataTable` owns client-side column filtering and its empty state. Server-side search and filters are handled by the page or template.

## Goals

- Support error fallback content at inline, content-section, and page-content scopes without assuming it owns the viewport or application shell.
- Use semantic WindSoft status colors, existing icons, typography, spacing, and buttons; avoid emoji, decorative icon circles, heavy cards, and raw exception output.
- Make the search/filter region visually consistent across list templates and compact enough for dense admin screens.
- Keep the component UI separate from application error boundaries, API/query logic, and filter data models.
- Preserve existing exported template APIs and search callback behavior during migration.
- Show realistic desktop and narrow-screen states, including populated filters, clear/reset controls, loading, error, and no-result guidance where applicable.

## Non-goals

- Adding an `ErrorBoundary`, `react-error-boundary`, error-reporting SDK, router integration, or global error policy.
- Deciding how an app retries a request, reloads a page, changes route, logs an error, or resets query state.
- Replacing `SearchField`, `EmptyState`, `Alert`, `DataTable`, or existing templates with a new data/query framework.
- Adding facets, saved searches, suggestions, server query serialization, or a filter schema language.
- Showing stack traces or raw error objects to end users.

## Approaches

1. **Reusable UI components composed by existing templates — selected.** Add `ErrorFallback` and `SearchFilter` as presentation/layout components, then use them from the existing page/template layer. This gives screens one visual contract while keeping runtime decisions in the app.
2. **Templates only — not selected.** Improve `ErrorState` and list templates independently. This avoids component APIs but leaves other screens to recreate the same layouts.
3. **Components that also own runtime behavior — not selected.** Add a packaged error boundary and query/filter behavior. This couples a UI library to app-specific error and data semantics and exceeds the requested scope.

## Design references and application

- [React error boundary reference](https://react.dev/reference/react/Component): Error Boundaries replace a failed subtree with fallback UI; they do not catch ordinary event-handler or asynchronous errors. Therefore `ErrorFallback` is presentation only, not an error-catching boundary.
- [Atlassian error-message guidance](https://atlassian.design/foundations/content/designing-messages/error-messages): state the likely issue plainly and give a simple next step. Error copy should stay brief and actionable.
- [Ant Design Result](https://ant.design/components/result/): separates error outcomes such as 403, 404, and 500 from generic inline feedback. WindSoft will keep route/status templates distinct from runtime fallback UI.
- [Carbon Data Table guidelines](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines): places table search below the title, with search on the left and table actions on the right; the toolbar is for global table controls and should not become a decorative card.
- [Carbon Search pattern](https://www.carbondesignsystem.com/building-blocks/core/patterns/search): distinguishes active, immediate search for small local sets from submitted search for server-backed result pages, and calls for a clear affordance when an active query is present.
- [Carbon Filtering pattern](https://www.carbondesignsystem.com/building-blocks/core/patterns/filtering): chooses filter selection behavior based on whether one or multiple attributes/categories can be selected.

Apply these behavior and placement principles using existing WindSoft tokens and components. Do not copy another system's palette, radii, or visual treatment.

## Component design: `ErrorFallback`

### Placement and visual hierarchy

Use a simple error icon with no colored circular backdrop, followed by a short heading, one or two lines of guidance, optional safe reference code, and recovery actions. Use the semantic danger foreground for the icon and rely on text as well as color to communicate the error. Do not use a large illustration, shadow card, full-screen background, or arbitrary viewport height.

| Layout | Use | Composition |
| --- | --- | --- |
| `inline` | A failed panel, table area, or dashboard widget | Compact horizontal row; icon and copy on the left, retry/action on the right; wraps on narrow screens. |
| `section` | The main content region of a feature/page | Centered compact stack in the available content region; no card; no viewport sizing assumption. |
| `page` | A route-level failure inside the app shell | Centered stack with wider copy and actions; fills the supplied content slot, never `100vh` by default, so the shell footer remains at the bottom. |

### Proposed API

```ts
type ErrorFallbackLayout = 'inline' | 'section' | 'page'

interface ErrorFallbackProps {
  layout?: ErrorFallbackLayout // default: 'section'
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  referenceCode?: string
  onRetry?: () => void
  retryLabel?: string // default: '다시 시도'
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  className?: string
}
```

- If `onRetry` is absent, no retry button is rendered.
- If `primaryAction` is supplied, it replaces the default retry button; `secondaryAction` remains optional.
- `icon` may replace the default warning icon while retaining the same unframed icon treatment.
- Keep error content generic by default. `referenceCode` is an opaque support/correlation identifier, not an exception message or stack trace.
- Do not accept an `Error` object, logger callback, reset key, or boundary state. The caller controls those behaviors.
- Mark the fallback region with an accessible heading relationship and an appropriate alert/status announcement. The implementation should avoid duplicate live announcements when the caller already announces the same failure.
- Add the component under `src/components/feedback`, export its props from the package entry point, and document it in Storybook's native Autodocs structure.

### Existing error template integration

- Keep `ErrorState`'s public variants and props compatible for the initial migration.
- Use `ErrorFallback` for `serverError`; retain `forbidden` and `notFound` as route/status templates with their own status copy and actions.
- Keep `empty` backed by `EmptyState`; do not model absence of data as an exception.
- Remove the template's unconditional full-viewport/card assumptions so embedding it in the admin shell does not float the footer or duplicate page chrome.

## Component design: `SearchFilter`

### Placement and visual hierarchy

Place the search/filter controls immediately below the list title and before the table. The search control gets the flexible width; filters size to their content; related submit/reset controls align at the end. Keep the region low-emphasis and unboxed by default: no shadow and no large rounded card. Use compact vertical spacing and the existing admin 36px control-height token in admin templates. Global page actions such as “새로 등록” remain in the page title/action area, separate from search actions.

```text
Desktop
[ search field, flexible ] [ status ] [ date range ]                 [ 조회 ] [ 초기화 ]
[ active filter chips and clear-all, only when filters are active                         ]

Narrow view
[ search field, full width                                                            ]
[ status ] [ date range ]
[ 조회 ] [ 초기화 ]
[ active filter chips, wrapping                                                       ]
```

Search and filters are a single visual region with a subtle separator from the table when needed. Do not put every filter in a separate card or add explanatory text that increases scroll height.

### Proposed API

```ts
interface SearchFilterProps {
  search?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
  activeFilters?: ReactNode
  ariaLabel?: string // default: '목록 검색 및 필터'
  className?: string
}
```

- `search` is normally the existing `SearchField`; its value and change/submit behavior stay controlled by the caller. It may be omitted for filter-only lists.
- `filters` contains the screen-specific controls (`Select`, date range, `ChipGroup`, etc.). The component does not define a universal filter schema.
- `actions` contains query actions such as 조회/초기화. Global page actions stay outside this component.
- `activeFilters` is an optional second row for selected-filter chips and clear-all affordances. It is omitted when nothing is active.
- Render a labeled search region with logical keyboard order: search, filters, query actions, then active-filter actions. Ensure the slots wrap without horizontal overflow and preserve usable control widths on small screens.
- Add the component under `src/components/data` because it composes list-query UI, export it from the package entry point, and document the anatomy and slot contracts in Autodocs.

### Template integration and compatibility

- `ListSearchTable` composes `SearchFilter` while retaining its current props and immediate `onSearch(value)` behavior. Its existing 조회 button remains and continues to invoke `onSearch` with the current value.
- `DataTablePage` composes `SearchFilter` for its query input and filter controls while retaining its current props and immediate search behavior.
- The first implementation does not change when existing templates issue searches. New consumers may choose submitted or immediate behavior in their own handlers; a future API for behavior ownership requires a separate contract.
- Keep `DataTable` client-side column filtering and `pagination` behavior unchanged.

## Acceptance criteria

### ErrorFallback

- Inline, section, and page layouts have visibly different density while using the same semantic content order.
- The page layout fills its parent content slot without forcing `100vh`; it works inside the existing header/LNB/footer shell.
- Retry and secondary actions render only when supplied and are keyboard reachable.
- No raw exception details, emoji, icon circles, or heavy card treatment appear by default.
- Existing `ErrorState` variants remain source-compatible, and an empty-data state continues to use `EmptyState`.

### SearchFilter

- Search, filter, submit/reset, and active-filter slots line up as one compact region on desktop and wrap in the specified order at narrow widths.
- Search is the only flexible-width control; filters keep content-appropriate widths and do not become equal-width columns by default.
- The component owns no query state and does not silently change existing template callback timing.
- Both existing list templates render their current search and filter features through the shared layout without API regression.
- Light and dark themes retain clear input boundaries, readable hover/focus states, and semantic selected-filter contrast.

### Documentation and verification

- Add Storybook stories for layout variants, populated filters, active-filter row, and narrow viewport behavior.
- Add focused tests for slot placement, optional regions, callbacks preserved through template adapters, accessibility labeling, and responsive class contracts.
- Verify package exports/build and Storybook rendering after implementation. Visual inspection uses identical sample content at desktop and narrow widths in Light and Dark themes.

## Decisions left to the builder

- Exact spacing and breakpoint values within existing tokens, confirmed in rendered Storybook views.
- The concrete error icon name. The current icon set has `warning` but no dedicated error glyph; prefer extending the shared icon set only if the current shape fails recognition in visual review.
- Whether `ErrorFallback` uses `role="alert"` or a polite status region based on whether the instance replaces a just-failed subtree or is rendered persistently; do not announce the same failure twice.
