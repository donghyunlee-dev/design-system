# Template Catalog and Organization Design

## Intent

Make the design system's templates easier to discover and reuse across service projects. The current `service`, `admin`, and `business` split mixes audience and implementation history, while users usually look for a template by the screen they need to build. This design organizes the source tree, Storybook groups, and selection guide around those tasks.

## Goals

- Provide one predictable taxonomy for template source folders and Storybook navigation.
- Let users find templates by screen purpose without needing to know whether they came from `service`, `admin`, or `business`.
- Review similar templates and consolidate only when their purpose and behavior overlap enough to share one implementation.
- Use simple English group names consistently across Storybook, including non-template component groups.
- Preserve component names, prop APIs, package root exports, rendered Korean sample copy, and Story names unless a consolidation is approved as part of the inventory review.

## Non-goals

- Translate Korean text shown inside example screens or sample data.
- Rename exported React components or redesign their visual behavior.
- Merge templates solely because they appear in the same navigation group.
- Reorganize unrelated component implementation folders.

## Current state

- There are 71 template component files: 14 under `service`, 7 under `admin`, and 50 under `business`.
- Service templates are split into subfolders such as `landing`, `auth`, `catalog`, `commerce`, and `account`; Admin and Business use separate top-level roots.
- Storybook currently groups templates as `Templates/Service/*`, `Templates/Admin`, and `Templates/Business`.
- `src/templates/index.ts` is the package's template export barrel. `package.json` exposes the package root, not individual deep template paths.
- `TemplateGuide.mdx` and `docs/PATTERNS.md` describe template selection but encode the old taxonomy and need to be aligned after the inventory and migration decisions.

## Proposed taxonomy

Use these simple English groups as the canonical first-level categories in both `src/templates/` and Storybook. Story names remain unchanged. All 71 existing templates receive one primary category; categories are navigation, not an instruction to merge their contents.

| Category | Templates |
|---|---|
| `Landing` | `LandingCentered`, `LandingMinimal`, `LandingSplit`, `FeatureShowcase` |
| `Account` | `LoginSimple`, `LoginSplit`, `SignupPage`, `SettingsSidebar`, `SettingsTabs` |
| `Catalog` | `ProductGrid`, `ProductList`, `ProductDetail`, `ServiceCatalog`, `DocumentCatalog`, `TemplateGallery`, `TemplateGalleryDirectory`, `TemplateGalleryFiltered`, `TemplateGalleryHero`, `TemplateGalleryMedia`, `TemplateGalleryPreview`, `TemplateGallerySpotlight`, `TemplateCommunity` |
| `Search` | `DataTablePage`, `ListSearchTable`, `EntitySearchExplorer`, `HighlightedEntitySearchExplorer`, `GlobalSearchResults`, `GlobalSearchResultsMedia`, `FacetedSearchResults`, `TabbedSearchResults`, `FileExplorer` |
| `Details` | `AdminDetailPage`, `DetailView`, `TicketDetail`, `MasterDetail`, `ActivityTimeline`, `DiffView` |
| `Forms` | `DataFormPage`, `FormRegister`, `WizardForm`, `CheckoutForm`, `BulkImport`, `DataImportMapping`, `DataImportWizard` |
| `Workflows` | `ApprovalView`, `InboxCenter`, `KanbanBoard`, `IssueListBoard`, `RequestQueueBoard`, `SavedViewIssueBoard`, `SystemIssueTracker`, `IncidentComposer`, `ScheduleCalendar` |
| `Analytics` | `DashboardFull`, `DashboardStats`, `DashboardKPI`, `MonitoringBoard`, `SystemStatusBoard`, `ReportLayout`, `DocumentPrint` |
| `Workspace` | `AdminShell`, `AdminTabbedWorkspace` |
| `Settings` | `SettingsPage`, `PermissionMatrix`, `RolesPermissionsMatrix` |
| `Help` | `DocsHub`, `HelpCenter`, `HelpCategoryArticles`, `HelpArticleView`, `SystemFeatureTour`, `ErrorState` |

The categories are user-task oriented rather than audience oriented. For example, product and internal document catalogs share `Catalog` because users browse and select from both; the story description and rendered example continue to explain the specific context.

## Naming and language rules

- Storybook navigation group labels use English only and follow the categories above.
- Existing component group labels outside Templates remain English; normalize any inconsistent group labels to short, recognizable English words.
- Keep component/export names and individual Story names unchanged.
- Keep all rendered examples, labels, and sample data in their current language. This request changes navigation labels only.
- Do not use `Service`, `Admin`, or `Business` as competing template menu roots after migration.

## Duplicate review and consolidation policy

First compare the templates' user task, interaction flow, layout, props, and current consumers. A shared category alone is not evidence of duplication. Candidate clusters for review include:

- `DataTablePage` / `ListSearchTable`
- `DataFormPage` / `FormRegister`
- `DashboardStats` / `DashboardKPI` / `DashboardFull`
- `PermissionMatrix` / `RolesPermissionsMatrix`
- Search result variants, including `GlobalSearchResults`, `GlobalSearchResultsMedia`, `EntitySearchExplorer`, `HighlightedEntitySearchExplorer`, `FacetedSearchResults`, and `TabbedSearchResults`
- `TemplateGallery` and its variants, plus `TemplateCommunity`
- `BulkImport` / `DataImportMapping` / `DataImportWizard`
- Issue and request handling templates, including `IssueListBoard`, `RequestQueueBoard`, `SavedViewIssueBoard`, and `SystemIssueTracker`

For each cluster, retain a canonical template when its props can represent the shared behavior cleanly. Keep a distinct template when it expresses a materially different task or interaction. The user has authorized duplicate removal and consolidation as part of this effort; retire a template when the review confirms it is redundant, and record its replacement mapping in the guide/changelog so consumers can migrate. Preserve all unaffected root-barrel exports; remove an export only when its duplicate component is retired and document the migration path.

## Approaches considered

1. **Task-oriented taxonomy — proposed.** Group by the screen or task users are trying to build, and use the same categories in source folders, Storybook, and the guide. This directly addresses discoverability and removes the `admin`/`business` split. It requires moving files and updating internal imports.
2. **Keep `service` and merge `admin` with `business`.** This is a smaller move, but leaves a large internal-work bucket and still makes users translate audience into the task they need.
3. **Keep all source folders and only relabel Storybook.** This minimizes code changes but leaves the inconsistent physical structure and makes future additions harder to place consistently.

The task-oriented taxonomy is proposed because the accepted category list reflects how users search for templates. Physical source organization should follow it to keep implementation and discovery aligned.

## Constraints and implementation calls

- Preserve current uncommitted work. Several template/admin files and plans are already modified or untracked in the working tree; inventory and migration must account for the checked-out state.
- Keep package root exports stable except for duplicates explicitly retired under the user's authorized consolidation scope. Deep source paths are not listed in `package.json` exports, but repository imports, tests, documentation, and MCP template discovery must be updated when files move.
- Treat duplicate elimination as a behavior/API comparison, not a filename cleanup.
- Keep Story names and in-screen Korean content intact; only Storybook navigation/group labels are translated/normalized.
- Update `TemplateGuide.mdx`, `docs/PATTERNS.md`, and any MCP template listing/category assumptions so they describe the final catalog.

## Success criteria

- Every maintained template has exactly one primary category in source and Storybook.
- Storybook template groups use the 11 proposed English names with no legacy `Service`, `Admin`, or `Business` roots.
- All Storybook group labels are short, consistent English; individual Story names and rendered sample text are unchanged.
- Every retired duplicate has a documented replacement; no unreviewed template disappears.
- Package root imports, Storybook, MCP template discovery, and the selection guide reference the maintained catalog consistently.
