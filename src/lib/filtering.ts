import type { Filters, LogoEntry } from '@/types'

export function filterLogos(logos: LogoEntry[], filters: Filters): LogoEntry[] {
  return logos.filter(logo => {
    if (filters.category && logo.category !== filters.category) return false
    if (filters.color && logo.color !== filters.color) return false
    if (filters.layout) {
      const key = filters.layout === '填充' ? 'fill' : 'padding'
      if (!logo.layouts[key]) return false
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const haystack = [logo.name, logo.base, logo.color, logo.category, logo.lang, logo.orientation]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export const DEFAULT_FILTERS: Filters = {
  category: '',
  color: '',
  layout: '',
  search: '',
}
