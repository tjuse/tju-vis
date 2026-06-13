export interface FormatSet {
  png?: string
  svg?: string
  pdf?: string
}

export interface LogoEntry {
  id: string
  base: string
  name: string
  category: string
  color: string
  lang: string
  orientation: string
  cardBg: 'blue' | 'white' | 'checker' | 'light'
  preview: string | null
  layouts: {
    fill?: FormatSet
    padding?: FormatSet
  }
  tags: string[]
}

export interface Reference {
  name: string
  path: string
  type: 'jpg' | 'pdf'
  sizeBytes: number
}

export interface Manifest {
  generated: string
  stats: {
    total: number
    withFill: number
    withPadding: number
  }
  filterOptions: {
    categories: string[]
    colors: string[]
    langs: string[]
    orientations: string[]
  }
  logos: LogoEntry[]
  references: Reference[]
}

export interface Filters {
  category: string   // '' means all
  color: string
  layout: string     // '' | '填充' | '独立区域'
  search: string
}
