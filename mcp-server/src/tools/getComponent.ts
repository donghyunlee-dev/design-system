import type { ComponentEntry, Manifest } from '../manifest.js'

export function getComponent(
  manifest: Manifest,
  name: string
): ComponentEntry | { error: string; suggestions: string[] } {
  const found = manifest.components.find((c) => c.name.toLowerCase() === name.toLowerCase())
  if (found) return found

  const suggestions = manifest.components
    .filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))
    .map((c) => c.name)
  return { error: `Component not found: ${name}`, suggestions }
}
