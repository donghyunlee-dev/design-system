# Nested Sidebar Design

## Goal

Offer a clear choice between the existing one-level `Sidebar` and a separate multi-level navigation component for admin applications.

## Design

- Keep `Sidebar` and its current flat item API and rendering unchanged.
- Add a separately exported `SidebarNested` component with recursive `children` items. Items with children are groups; clicking their row only expands or collapses them. Leaf items navigate through the existing optional `renderLink` adapter.
- Preserve the current WindSoft sidebar width, surface, typography, spacing, focus ring, and hover treatment. Indent child levels consistently; use a disclosure chevron that rotates when expanded. Hover and active states apply to each navigable leaf, with a distinct expanded/active treatment for groups.
- Mark the active leaf with `aria-current="page"` and automatically reveal its ancestor groups. Group buttons expose `aria-expanded` and `aria-controls`; native button/link keyboard behavior provides keyboard access.
- Keep expansion local to the new component, with optional initial expanded keys for applications that need specific groups open. Authorization, route matching, and permission filtering remain application-owned.
- Add unit tests and Storybook stories for nested rendering, expansion, active ancestry, link adapter behavior, hover/active classes, and keyboard/focus semantics. Document when to choose each component.

## Out of Scope

- Changing the existing `Sidebar` API or appearance.
- Mobile drawer behavior, authorization policy, route matching, and persistence of expanded state across page loads.
