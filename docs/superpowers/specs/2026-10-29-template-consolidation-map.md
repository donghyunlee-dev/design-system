# Template Inventory and Consolidation Map

This inventory reflects the checked-out source state, including the in-progress Admin detail/workspace work copied from the original checkout. It is the implementation map for `2026-10-29-template-catalog-design.md`.

## Inventory

There are 71 template component files: 14 Service, 7 Admin, and 50 Business. `Export` means a named component/type is currently exported from `src/templates/index.ts`. `Story` indicates a Storybook example exists; `Test` indicates an adjacent focused component test exists. The planned category is the component's one primary catalog category.

| Current component | Category | Export | Story | Test |
|---|---|---:|---|---:|
| `LandingCentered` | Landing | yes | Landing | no |
| `LandingMinimal` | Landing | yes | Landing | no |
| `LandingSplit` | Landing | yes | Landing | no |
| `FeatureShowcase` | Landing | yes | Landing | no |
| `LoginSimple` | Account | yes | Auth | yes |
| `LoginSplit` | Account | yes | Auth | no |
| `SignupPage` | Account | yes | Auth | no |
| `SettingsSidebar` | Account | yes | Account | no |
| `SettingsTabs` | Account | yes | Account | no |
| `ProductGrid` | Catalog | yes | Catalog | no |
| `ProductList` | Catalog | yes | Catalog | no |
| `ProductDetail` | Catalog | yes | Catalog | no |
| `ServiceCatalog` | Catalog | yes | Catalog | no |
| `DocumentCatalog` | Catalog | yes | Business | no |
| `TemplateGallery` | Catalog | yes | Business | no |
| `TemplateGalleryDirectory` | Catalog | yes | Business | no |
| `TemplateGalleryFiltered` | Catalog | yes | Business | no |
| `TemplateGalleryHero` | Catalog | no | Business | no |
| `TemplateGalleryMedia` | Catalog | yes | Business | no |
| `TemplateGalleryPreview` | Catalog | yes | Business | no |
| `TemplateGallerySpotlight` | Catalog | yes | Business | no |
| `TemplateCommunity` | Catalog | yes | Business | no |
| `DataTablePage` | Search | yes | Admin | no |
| `ListSearchTable` | Search | yes | Business | yes |
| `EntitySearchExplorer` | Search | yes | none | no |
| `HighlightedEntitySearchExplorer` | Search | yes | Business | no |
| `GlobalSearchResults` | Search | yes | Business | no |
| `GlobalSearchResultsMedia` | Search | no | none | no |
| `FacetedSearchResults` | Search | yes | Business | no |
| `TabbedSearchResults` | Search | yes | Business | no |
| `FileExplorer` | Search | yes | Business | no |
| `AdminDetailPage` | Details | yes | Admin | yes |
| `DetailView` | Details | yes | Business | no |
| `TicketDetail` | Details | no | none | no |
| `MasterDetail` | Details | yes | Business | no |
| `ActivityTimeline` | Details | yes | Business | no |
| `DiffView` | Details | yes | Business | no |
| `DataFormPage` | Forms | yes | Admin | no |
| `FormRegister` | Forms | yes | Business | yes |
| `WizardForm` | Forms | yes | Business | no |
| `CheckoutForm` | Forms | yes | Commerce | no |
| `BulkImport` | Forms | yes | Business | no |
| `DataImportMapping` | Forms | no | none | no |
| `DataImportWizard` | Forms | no | Business | no |
| `ApprovalView` | Workflows | yes | Business | no |
| `InboxCenter` | Workflows | yes | Business | no |
| `KanbanBoard` | Workflows | yes | Business | no |
| `IssueListBoard` | Workflows | yes | Business | no |
| `RequestQueueBoard` | Workflows | yes | Business | no |
| `SavedViewIssueBoard` | Workflows | yes | Business | no |
| `SystemIssueTracker` | Workflows | yes | Business | no |
| `IncidentComposer` | Workflows | yes | Business | no |
| `ScheduleCalendar` | Workflows | yes | Business | no |
| `DashboardFull` | Analytics | yes | Admin | no |
| `DashboardStats` | Analytics | yes | Admin | no |
| `DashboardKPI` | Analytics | yes | Business | no |
| `MonitoringBoard` | Analytics | yes | Business | no |
| `SystemStatusBoard` | Analytics | yes | Business | no |
| `ReportLayout` | Analytics | yes | Business | no |
| `DocumentPrint` | Analytics | yes | Business | no |
| `AdminShell` | Workspace | yes | Admin | yes |
| `AdminTabbedWorkspace` | Workspace | yes | Admin | yes |
| `SettingsPage` | Settings | yes | Business | no |
| `PermissionMatrix` | Settings | no | Business | no |
| `RolesPermissionsMatrix` | Settings | yes | Business | no |
| `DocsHub` | Help | yes | Business | no |
| `HelpCenter` | Help | yes | Business | no |
| `HelpCategoryArticles` | Help | yes | Business | no |
| `HelpArticleView` | Help | yes | Business | no |
| `SystemFeatureTour` | Help | yes | Business | no |
| `ErrorState` | Help | no | Business | no |

## Consolidation and API decisions

The category is for discovery; it does not imply every component in that category should be merged.

| Candidate family | Decision | Canonical behavior / migration |
|---|---|---|
| `DataTablePage` / `ListSearchTable` | Keep both. | `DataTablePage` is a simpler table with loading, empty state, and chip filters using `Table`; `ListSearchTable` uses `DataTable`, controlled search, arbitrary filter controls, and its own pagination. Their table contracts and empty/loading behavior differ. Place both under `Search` and make the guide explain the choice. |
| `DataFormPage` / `FormRegister` | Keep both. | `DataFormPage` is a compact configurable field layout with one/two-column sections and loading submit; `FormRegister` is a larger card-per-section form with descriptions and paired actions. Place both under `Forms`. |
| `DashboardStats` / `DashboardFull` | Consolidate implementation under `DashboardFull`. | `DashboardStats` is the stats + one chart subset of `DashboardFull`. Keep `DashboardStats` and its props export as a compatibility adapter mapping `chart` to `mainChart`, but show one canonical dashboard story and document the adapter. |
| `DashboardKPI` | Keep as a distinct analytics template. | It has a separate KPI card model (`change`, `trend`, `period`) and optional summary table, unlike the `StatProps`-based dashboards. |
| `PermissionMatrix` / `RolesPermissionsMatrix` | Consolidate on `RolesPermissionsMatrix`; remove the unexported `PermissionMatrix` component. | Convert the existing PermissionMatrix Story data to `roles`, `rows`, and `granted`. Carry useful role metadata and breadcrumb presentation into the canonical component before removing the older implementation. |
| `GlobalSearchResultsMedia` / `GlobalSearchResults` | Consolidate on `GlobalSearchResults`. | Add optional `leading` content to result items and keep grouping/filter behavior in one implementation. The media file is unexported and has no Story, so remove it after verifying no consumers. |
| `HighlightedEntitySearchExplorer` / `EntitySearchExplorer` | Consolidate on `EntitySearchExplorer`. | Add optional `keyword` highlighting to the base result rendering. Keep `HighlightedEntitySearchExplorer` and its props as a compatibility adapter so the exported API survives; show the highlighting behavior as a story variant in Search. |
| `TemplateGalleryMedia` / `TemplateGallery` | Consolidate shared category/search/grid behavior on `TemplateGallery`. | Add media card fields/optional rendering to the canonical gallery, then retain `TemplateGalleryMedia` as a thin adapter for API compatibility. Keep media and non-media stories if both remain useful choices. |
| `TemplateGalleryDirectory`, `TemplateGalleryFiltered`, `TemplateGalleryHero`, `TemplateGalleryPreview`, `TemplateGallerySpotlight`, `TemplateCommunity` | Keep distinct. | Each has a distinct discovery interaction: system tiles + sections, multi-facet AND/OR filters, hero + team entry, in-place preview drawer, featured tab layout, or horizontal curated community rows. Improve shared types only if the refactor can do so without flattening those interactions. |
| `BulkImport` / `DataImportWizard` | Keep both. | `BulkImport` is a compact upload/mapping/validation panel; `DataImportWizard` is a multi-step import experience with step progress and completion state. Export `DataImportWizard` because it is already documented in Storybook and is a reusable full-screen flow. |
| `DataImportMapping` | Retire. | It is unexported, has no Story or in-repository consumers, and its mapping step is already covered by `DataImportWizard`; remove the orphan module. |
| Issue/request board family | Keep distinct. | `IssueListBoard` is a basic issue list, `SavedViewIssueBoard` adds saved filters/views, `SystemIssueTracker` organizes issue tracking by system and bulk actions, and `RequestQueueBoard` handles incoming requests with batch decisions. Explain these distinctions under Workflows. |
| `TicketDetail` | Keep and promote to public catalog. | It is a distinct support conversation thread with requester/assignee details, status actions, and reply composition. Add a Story and a named export in `src/templates/index.ts`; category is `Details`. |
| `ErrorState` | Keep and promote to public catalog. | It represents route/status pages (`empty`, `forbidden`, `notFound`, `serverError`) and remains separate from runtime `ErrorFallback`. Add its named export; category is `Help` for discovery under system/help states. |
| `TemplateGalleryHero` | Keep and promote to public catalog. | It already has a Story and focused story test but is not in the package barrel. Add its named exports and category entry; no implementation merge. |

`DataImportMapping`, `GlobalSearchResultsMedia`, and `PermissionMatrix` have no package exports and are safe to retire after their references are migrated or confirmed absent. Existing exported component names and types remain available except these three were not public to begin with.

## Working-tree considerations

- `AdminShell.tsx`, its test, `Admin.stories.tsx`, `src/templates/index.ts`, and `LoginSimple.tsx` contain pre-existing uncommitted edits. Those edits are part of this inventory's baseline and must remain in the final worktree.
- The in-progress `AdminDetailPage` and `AdminTabbedWorkspace` files are maintained and included under `Details` and `Workspace`, respectively.
- The source checkout's untracked plans/specs are copied into the implementation worktree but are not part of this map's commits unless a task explicitly modifies them.
