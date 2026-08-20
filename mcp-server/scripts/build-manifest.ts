import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync, writeFileSync } from 'node:fs'
import { buildManifest } from '../src/manifest.js'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'generated')

const manifest = buildManifest(REPO_ROOT)

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))

console.log(
  `Generated manifest.json: ${manifest.components.length} components, ${manifest.businessTemplates.length} templates`
)
