import Fuse from 'fuse.js'
import { join } from 'path'
import { readFileSync } from 'fs'

export interface CatalogItem {
  code: string
  name: string
  category: string
  specs: string
  unit: string
  unitPrice: number
  discountable: boolean
  aliases: string[]
}

let catalogInstance: CatalogService | null = null

export class CatalogService {
  private catalog: CatalogItem[]
  private fuse: Fuse<CatalogItem>

  constructor() {
    this.catalog = this.loadCatalog()
    this.fuse = new Fuse(this.catalog, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'aliases', weight: 0.35 },
        { name: 'category', weight: 0.1 },
        { name: 'specs', weight: 0.15 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 1
    })
  }

  private loadCatalog(): CatalogItem[] {
    try {
      const catalogPath = join(process.cwd(), 'data', 'catalog.json')
      const raw = readFileSync(catalogPath, 'utf-8')
      return JSON.parse(raw) as CatalogItem[]
    } catch (err) {
      console.error('Failed to load catalog:', err)
      return []
    }
  }

  search(query: string): CatalogItem[] {
    if (!query.trim()) return this.catalog.slice(0, 20)

    const results = this.fuse.search(query)
    return results.map((r) => r.item)
  }

  findByCode(code: string): CatalogItem | undefined {
    return this.catalog.find((item) => item.code === code)
  }

  getAll(): CatalogItem[] {
    return this.catalog
  }
}

export function getCatalogService(): CatalogService {
  if (!catalogInstance) {
    catalogInstance = new CatalogService()
  }
  return catalogInstance
}
