import { EntitySearchExplorer } from './EntitySearchExplorer'
import type { EntitySearchExplorerProps } from './EntitySearchExplorer'

export interface HighlightedEntitySearchExplorerProps extends EntitySearchExplorerProps {}

/** @deprecated Use EntitySearchExplorer; a non-empty keyword is highlighted automatically. */
export function HighlightedEntitySearchExplorer(props: HighlightedEntitySearchExplorerProps) {
  return <EntitySearchExplorer {...props} />
}
