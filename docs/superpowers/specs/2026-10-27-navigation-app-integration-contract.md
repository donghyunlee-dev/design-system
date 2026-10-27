# Navigation and App Integration Contract

**Status:** Approved by the user to proceed on 2026-10-27.

## Goal

Make WindSoft navigation primitives usable inside SPA routers, allow tab state to be owned by the consuming application, and make Toast provider misuse visible. Clarify which table behavior belongs to `Table`, `DataTable`, templates, and the host application.

## Decisions

- The package stays router-agnostic and adds no router dependency.
- `Sidebar`, `Navbar`, and `Breadcrumb` accept an optional `renderLink` callback with a shared props shape (`href`, `children`, `className`, and `aria-current`). The default remains a native anchor. Consumers adapt that shape to React Router's `Link` or another router.
- `Tabs` keeps its current uncontrolled behavior by default and gains optional `value`, `defaultValue`, and `onValueChange` props. The consuming application owns URL synchronization.
- `useToast()` throws a descriptive error outside `ToastProvider` instead of silently returning a no-op function.
- `Modal` size classes remain unchanged. Tailwind width regression coverage already establishes `max-w-sm/md/lg` independently of WindSoft spacing aliases; add a component-level size contract test.
- `Table` remains a display primitive. `DataTable` provides client sorting/filtering and pagination; `pagination.total` plus `onChange` supports server pagination. Server search/sort/filter remain application/template responsibilities unless an explicit controlled API is later approved.
- Authentication, authorization, menu policy, API error/session expiry behavior, and responsive app-shell orchestration stay in the consuming application. The guide/checklist will state these boundaries and review items.

## Compatibility

- Existing anchor rendering, `Tabs` local state, and component props remain the defaults.
- No new runtime dependency is added.
- Storybook examples demonstrate router rendering and externally controlled tabs without importing a routing package into the library.

## Acceptance

- Custom link renderers receive the same `href`, visual classes, current-page semantics, and child content across all three navigation components.
- Existing Tabs consumers behave as before; controlled consumers change the selected panel only when `value` changes and receive click/keyboard updates through `onValueChange`.
- `useToast` works under a provider and fails immediately with a clear error outside one.
- Modal width variants remain mapped to Tailwind's original `max-w-*` utilities.
- Docs accurately distinguish client-side `DataTable` features, server pagination callbacks, and app-owned server search/auth/layout behavior.
