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
  /** Combined "fg/bg" string kept for search/aria back-compat */
  color: string
  /** Foreground color e.g. "北洋蓝" | "白" | "黑" */
  colorFg: string
  /** Background color e.g. "白" | "北洋蓝" | "透明" */
  colorBg: string
  lang: string
  orientation: string
  cardBg: 'blue' | 'white' | 'checker' | 'light'
  /** Intrinsic SVG width / height ratio; used for masonry height estimation */
  aspect: number
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
    foregrounds: string[]
    backgrounds: string[]
    langs: string[]
    orientations: string[]
  }
  logos: LogoEntry[]
  references: Reference[]
}

export interface Filters {
  category: string    // '' means all
  foreground: string  // '' means all
  background: string  // '' means all
  layout: string      // '' | '填充' | '独立区域'
  search: string
}
