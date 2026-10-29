# AdminTabbedLayout Design

## Goal

Add an admin template that composes `AdminShell` with a browser-inspired page tab strip. Selecting an LNB leaf opens its route as a tab and renders its page in the workspace.

## User-visible behavior

- A fixed home tab is always first, uses a home icon, and navigates to configurable `homeHref` while showing `homeContent`.
- Leaf menu items use their `href` as the route identity and their menu `label` as the tab label. Clicking an already-open route activates its existing tab.
- Route pages are supplied as `{ href, content }`; the library does not import or own a router. `activePath` reflects the app route, and `onNavigate(href)` asks the app to navigate.
- A newly selected route is opened in a closable tab. Tabs retain their mounted page state while inactive.
- `maxTabs` caps closable page tabs (default 8; home is excluded). If opening a new route would exceed the cap, navigation is prevented and `onTabLimitReached` is called. Existing tabs remain intact.
- Tabs can be reordered by pointer drag and keyboard. Closing the active tab navigates to the nearest remaining tab, preferring the tab to its left, then home.
- Right-clicking a closable tab opens a context menu for that tab: close tab, close other tabs, close all tabs. Home is fixed and cannot be closed.
- The visual treatment borrows Chrome's connected active tab surface, restrained inactive tabs, close control revealed on hover/focus, and draggable ordering, adapted to WindSoft tokens and dense admin layouts.

## API direction

`AdminTabbedLayout` extends `AdminShellProps` except `children`, and adds `pages`, `homeHref`, `homeContent`, `activePath`, `onNavigate`, optional `maxTabs`, and optional `onTabLimitReached`.

`NavigationLinkProps` gains optional `onClick` so the template can intercept LNB route selection while the consumer's router link remains responsible for navigation. Existing link renderers remain compatible.

## Boundaries

- No React Router dependency and no direct `window.history` mutation.
- No tab persistence across reloads, dirty-form confirmation, pinning, groups, or tab virtualization.
- Do not change existing `Tabs` behavior; this is a separate admin page-workspace template.

## Visual review

Storybook must show a full AdminShell with home, multiple open tabs, a selected page, and a footer. Check a narrow viewport and Light/Dark themes. The context menu and close behavior must be demonstrable in the story.
