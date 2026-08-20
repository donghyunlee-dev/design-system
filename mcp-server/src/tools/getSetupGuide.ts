import type { Manifest } from '../manifest.js'

export function getSetupGuide(manifest: Manifest) {
  return { markdown: manifest.setupGuideMarkdown }
}
