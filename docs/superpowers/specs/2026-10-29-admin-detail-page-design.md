# Admin Detail Page Design

**Status:** Approved

## Intent

Add a reusable admin page template for detail-oriented workspaces with this order: breadcrumb path, title and button toolbar, search area, data grid, and pagination. It is intended to be rendered inside `AdminShell` and also work within tabbed workspaces.

## Design

- Add an `AdminDetailPage` template under `src/templates/admin`.
- Reuse `Breadcrumb`, `SearchField`, `Table`, and `Pagination`.
- Accept breadcrumb items, title, toolbar actions, columns, rows, row key, search value/change callback, pagination state, and optional row click callback as props.
- Keep data fetching and query semantics in the consuming application. The template displays supplied data and forwards search and page changes.
- Export the component and its prop type from the admin template barrel.
- Do not add tabs, detail fields/history, or API fetching to this template.
