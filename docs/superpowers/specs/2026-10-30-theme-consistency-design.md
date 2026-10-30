# Theme Consistency Design

## Intent

Make production components and templates adapt their text, surface, border, and status colors to the active light or dark semantic token set. The user asked for a complete review and correction after repeated partial theme fixes.

## Goals

- Replace fixed palette utility classes in production components and templates with existing semantic tokens.
- Preserve intentionally translucent overlay scrims and colors that are data-driven or part of illustrative assets.
- Keep the existing `data-theme` and system preference behavior.
- Add a source-level regression check so fixed palette utilities do not silently return to production UI.

## Approaches

- Update only the files found in the latest search: smallest diff, but future components can repeat the same issue.
- Add a repository-wide fixed-color regression check and convert every production component/template violation found by that check: selected because it covers both current defects and recurrence.
- Replace the design system palette with a different theme architecture: rejected because the current semantic tokens and Tailwind mappings already support both themes.

## Constraints and decisions

- Use existing semantic roles (`background`, `surface`, `foreground`, `secondary`, `muted`, and status subtle/foreground roles).
- Keep explicit overlay scrims such as `bg-black/50`; they represent translucency rather than a theme surface.
- Convert the monitoring board to semantic roles so its layout remains the same while colors follow the active theme.
- No public API changes, dependency changes, package release, or deployment.

## Validation

Run the new regression test, affected component tests, the full Vitest suite, package build, Storybook build, and package verification where available.
