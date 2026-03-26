import Fuse from 'fuse.js'
import { join } from 'path'
import { readFileSync } from 'fs'
import { app } from 'electron'
import type { CatalogItem } from '../../renderer/src/types'

interface ExternalItem {
  name: string
  specs?: string
}

interface MatchResult {
  externalName: string
  externalSpecs?: string
  matched: boolean
  localItem?: CatalogItem
  score?: number
  suggestions?: CatalogItem[]
}

interface MatchResponse {
  matched: MatchResult[]
  unmatched: MatchResult[]
  summary: {
    total: number
    matchedCount: number
    unmatchedCount: number
  }
}

export class MatcherService {
  private catalog: CatalogItem[]
  private fuse: Fuse<CatalogItem>

  constructor() {
    this.catalog = this.loadCatalog()
    this.fuse = new Fuse(this.catalog, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'aliases', weight: 0.4 },
        { name: 'category', weight: 0.1 },
        { name: 'specs', weight: 0.1 }
      ],
      threshold: 0.5,
      includeScore: true,
      minMatchCharLength: 1
    })
  }

  private loadCatalog(): CatalogItem[] {
    try {
      const catalogPath = join(app.getAppPath(), 'data', 'catalog.json')
      const raw = readFileSync(catalogPath, 'utf-8')
      return JSON.parse(raw) as CatalogItem[]
    } catch (err) {
      console.error('Failed to load catalog for matcher:', err)
      return []
    }
  }

  match(externalItems: ExternalItem[]): MatchResponse {
    const matched: MatchResult[] = []
    const unmatched: MatchResult[] = []

    for (const extItem of externalItems) {
      const query = `${extItem.name} ${extItem.specs || ''}`.trim()
      const results = this.fuse.search(query)

      if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.4) {
        matched.push({
          externalName: extItem.name,
          externalSpecs: extItem.specs,
          matched: true,
          localItem: results[0].item,
          score: results[0].score,
          suggestions: results.slice(1, 3).map((r) => r.item)
        })
      } else {
        // Provide suggestions even for unmatched items
        const suggestions = results.slice(0, 3).map((r) => r.item)
        unmatched.push({
          externalName: extItem.name,
          externalSpecs: extItem.specs,
          matched: false,
          suggestions
        })
      }
    }

    return {
      matched,
      unmatched,
      summary: {
        total: externalItems.length,
        matchedCount: matched.length,
        unmatchedCount: unmatched.length
      }
    }
  }
}
