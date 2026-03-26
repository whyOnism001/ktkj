import Fuse from 'fuse.js'
import { join } from 'path'
import { readFileSync } from 'fs'
import { app } from 'electron'
import type { CatalogItem } from '../../renderer/src/types'

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
      const catalogPath = join(app.getAppPath(), 'data', 'catalog.json')
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

  getByCategory(category: string): CatalogItem[] {
    return this.catalog.filter((item) => item.category === category)
  }
}
