import Fuse from 'fuse.js'
import { getCatalogService } from './catalog'
import type { CatalogItem } from './catalog'

export interface ExternalItem {
  name: string
  specs?: string
}

export interface MatchResult {
  externalName: string
  externalSpecs?: string
  matched: boolean
  localItem?: CatalogItem
  score?: number
  suggestions?: CatalogItem[]
}

export interface MatchResponse {
  matched: MatchResult[]
  unmatched: MatchResult[]
  summary: {
    total: number
    matchedCount: number
    unmatchedCount: number
  }
}

export class MatcherService {
  private fuse: Fuse<CatalogItem>

  constructor() {
    const catalog = getCatalogService().getAll()
    this.fuse = new Fuse(catalog, {
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

let matcherInstance: MatcherService | null = null

export function getMatcherService(): MatcherService {
  if (!matcherInstance) {
    matcherInstance = new MatcherService()
  }
  return matcherInstance
}
