# Template Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Reorganize the template library around 11 user-task categories, consolidate truly redundant templates, and make Storybook, docs, and MCP expose one consistent catalog.

**Architecture:** Move maintained templates into first-level folders matching the approved task categories and keep `src/templates/index.ts` as the stable package entry point. Split the current Storybook template groups to match those categories, use short English group names across Storybook, and update catalog consumers (docs and MCP) to read the same taxonomy.

**Tech Stack:** React 19, TypeScript, Storybook 10, Vitest, Node.js MCP server.

**Spec:** `docs/superpowers/specs/2026-10-29-template-catalog-design.md`

## Global Constraints

- Use these categories: `Landing`, `Account`, `Catalog`, `Search`, `Details`, `Forms`, `Workflows`, `Analytics`, `Workspace`, `Settings`, and `Help`.
- Storybook navigation group labels use English only; keep component/export names and individual Story names unchanged.
- Keep all rendered examples, labels, and sample data in their current language; this change changes navigation labels only.
- A shared category is not evidence to merge templates; compare purpose, interaction flow, layout, props, and current consumers.
- Preserve all unaffected root-barrel exports; remove an export only when its duplicate component is retired and document the migration path.
- Preserve current uncommitted work. Integrate the checked-out state and do not overwrite existing edits in admin templates or stories.
- No dependency, build-tool, or framework upgrades.

## Review Focus

- **Unique interaction hidden by a similar name:** every proposed consolidation retains distinct flows; add/adjust behavior tests in the consolidation task for each retained flow.
- **Public template export lost during moves:** add an export inventory assertion in the source migration task and verify package build.
- **Unexported source templates silently omitted:** inventory exported and unexported files before deciding which remain maintained; add assertions to the catalog test that each maintained template appears once and each retired one has a replacement.
- **Storybook stories disappear or move to the wrong group:** preserve all existing Story names and test the existing `TemplateGalleryHero` story after splitting; build Storybook.
- **MCP static and live catalogs disagree after paths change:** compare generated and live manifest entries in MCP tests and verify all returned file paths exist.

---

## File Structure

The approved category table in the spec is the authoritative file-to-folder map. The resulting source structure uses lower-case directories matching those group names:

```text
src/templates/
  landing/ account/ catalog/ search/ details/ forms/
  workflows/ analytics/ workspace/ settings/ help/
  index.ts
```

Storybook uses category-aligned story modules under `src/stories/templates/`. The existing 3,300-line `Business.stories.tsx` is divided by category without renaming its Story exports or changing example content. Existing service and admin story modules are moved or split into the same groups. `mcp-server/src/manifest.ts` becomes the catalog reader for all public templates and their categories; the generated manifest is rebuilt from it. `src/stories/docs/TemplateGuide.mdx`, `docs/PATTERNS.md`, `README.md`, and `docs/MCP.md` describe the resulting taxonomy.

## Tasks

### Task 1: Audit template usage and finalize the consolidation map

**Files:**
- Read: all template modules listed in the spec, `src/templates/index.ts`, template stories and tests, `mcp-server/src/manifest.ts`, and active template documentation.
- Create: `docs/superpowers/specs/2026-10-29-template-consolidation-map.md`

- [x] Inventory every template file, mark whether it is exported, has a Story, has tests, and has in-repository consumers. Include the seven currently unexported files explicitly.
- [x] Compare candidate families from the design spec. For every candidate, record the canonical template, props/behavior retained, retired names, and replacement mapping. Keep a distinct template when it represents a materially different task or interaction.
- [x] Review the existing admin files and stories from the checked-out working tree before recording the map; preserve their current work.
- [x] Confirm that every retired component has a migration target and every retained public API has a path forward.
- [x] Commit only the inventory/mapping document.

The comparison set is: `DataTablePage` / `ListSearchTable`; `DataFormPage` / `FormRegister`; dashboard variants; `PermissionMatrix` / `RolesPermissionsMatrix`; search variants; `TemplateGallery` variants and `TemplateCommunity`; import flows; issue/request boards. The map is the gate for the implementation tasks and must not retire a component based on naming alone. Keep `TemplateGalleryMedia` distinct from `TemplateGallery`: its flat data model, featured slot, top/sidebar navigation, and author/usage metadata make it a useful media-gallery variant.

### Task 2: Consolidate confirmed duplicate implementations

**Files:**
- Modify: candidate template modules and their focused tests, as specified in Task 1's map.
- Modify: `src/templates/index.ts` only for exports explicitly retired by the map.
- Modify: affected Storybook stories and story tests.

- [x] For each mapped canonical component, add or update a behavior test that covers the unique props and flows retained from its variants.
- [x] Run the affected template tests and confirm the new/updated test fails if the retained behavior is removed.
- [x] Consolidate only the confirmed duplicates. If a unique public API can remain as a thin adapter without duplicating layout logic, keep the adapter and mark the migration in docs; otherwise remove the export and use the documented canonical replacement.
- [x] Run affected template and Storybook story tests; confirm all retained variants render through the canonical component.
- [x] Commit the consolidation and its tests as one scoped change.

### Task 3: Move templates into the approved category folders

**Files:**
- Move: maintained components from `src/templates/service/`, `src/templates/admin/`, and `src/templates/business/` into category folders from the spec and consolidation map.
- Move: `src/templates/business/types.ts` to the category folder selected by its remaining consumers, or remove it if no longer needed.
- Modify: `src/templates/index.ts`, internal deep imports, and tests that import moved paths.

- [x] Move each maintained file according to the approved category map. Do not move or overwrite a file with existing user edits until those edits are included in the move.
- [x] Update each moved file's relative imports and all repository imports to the new path.
- [x] Update `src/templates/index.ts` to point to the new paths while preserving every unaffected named export and exported type.
- [x] Add an export inventory assertion that checks unique named exports and verifies all maintained template names are represented exactly once.
- [x] Run the template tests and `npm run build`; confirm there are no unresolved old source imports and package exports compile.
- [x] Commit the source moves and barrel changes.

### Task 4: Align Storybook groups and split template stories

**Files:**
- Modify/move: `src/stories/templates/{Account,Admin,Auth,Business,Catalog,Commerce,Landing}.stories.tsx` into category-aligned story modules.
- Modify: `src/stories/templates/Business.stories.test.tsx` and other affected story tests.
- Modify: any non-template Storybook meta whose group label is not short English.

- [x] Split `Business.stories.tsx` by the approved category map, keeping each existing `Story` export name and all Korean demo data unchanged.
- [x] Move service and admin stories to their matching category groups. Set Storybook titles to exactly `Templates/<Category>` using the approved labels.
- [x] Update template imports and the `TemplateGalleryHero` story test to the new story module.
- [x] Normalize any non-template Storybook group labels that are Korean or inconsistent to short English group labels; do not rename individual stories.
- [x] Run story tests and `npm run build-storybook`; confirm all 11 template groups appear and every story remains available.
- [x] Commit the Storybook navigation and story organization changes.

### Task 5: Expose the unified catalog through MCP

**Files:**
- Modify: `mcp-server/src/manifest.ts`, `mcp-server/src/manifest.test.ts`.
- Modify: `mcp-server/src/tools/getBusinessTemplates.ts`, `mcp-server/src/tools/tools.test.ts`, `mcp-server/src/createMcpServer.ts`.
- Regenerate: `mcp-server/src/generated/manifest.ts`.
- Modify: `mcp-server/src/generated/manifest.test.ts`.

- [x] Add `category` to `TemplateEntry` and scan all category folders from the template barrel, rather than only `./business/*` exports.
- [x] Define the canonical `get_templates` MCP tool with optional category filtering and exact name matching. Keep `get_business_templates` as a compatibility alias with the existing response shape while returning the unified catalog.
- [x] Add tests that verify category filtering, case-insensitive exact lookup, partial-name suggestions, unique names, all returned file paths existing, and the legacy tool alias behavior.
- [x] Regenerate the static manifest and assert it matches the live manifest for every template name, category, and path.
- [x] Run `npm --prefix mcp-server test`, `npm --prefix mcp-server run typecheck`, and `npm --prefix mcp-server run build`.
- [x] Commit MCP source, tests, and generated manifest together.

### Task 6: Update catalog documentation

**Files:**
- Modify: `src/stories/docs/TemplateGuide.mdx`.
- Modify: `docs/PATTERNS.md`, `README.md`, and `docs/MCP.md`.
- Modify: migration references identified in Task 1.

- [x] Replace the old `service`/`admin`/`business` navigation guidance with the 11 approved task categories.
- [x] For each retained template, explain when to choose it and how it differs from its nearest alternative. Remove retired templates from the guide and point to their canonical replacement.
- [x] Update repository structure descriptions and MCP examples to show category-aware template discovery.
- [x] Keep Korean rendered examples and documentation prose as-is except where old paths, old group labels, or retired template guidance must change.
- [x] Search active source, docs, and MCP files for obsolete folder paths and old Storybook group roots; resolve all live references. Historical plans/specs may retain old paths as history.
- [x] Commit documentation updates.

### Task 7: Verify the complete catalog and compatibility

**Files:**
- Read/verify: `src/templates/index.ts`, Storybook categories, active docs, MCP generated/live manifests.

- [x] Run `npm test -- --run`.
- [x] Run `npm run build`, `npm run build-storybook`, and `npm run verify:package`.
- [x] Run the MCP tests, typecheck, and build from Task 5 after the final integration.
- [x] Verify each maintained template appears once in its source category, once in Storybook, and once in the MCP manifest; verify every retired component points to its replacement.
- [x] Verify Storybook group names use English, and Korean strings in rendered demos have not been translated or removed.
- [x] Review `git diff` to confirm no unrelated user changes were lost or rewritten; commit only task-scoped files.

## Plan Self-Review

- Source moves, duplicate consolidation, Storybook groups, MCP discovery, docs, and final validation each have an explicit task.
- Public root exports remain stable except for duplicate components explicitly retired with a migration mapping.
- Current uncommitted admin changes are called out as inputs to the moves and review, not cleanup targets.
- Validation covers moved imports, Storybook visibility, package exports, live/static MCP manifests, and docs references.
