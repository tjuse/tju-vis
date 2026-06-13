import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Filters } from '@/types'

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  categories: string[]
  colors: string[]
  total: number
  filtered: number
}

const LAYOUTS = ['', '填充', '独立区域'] as const

function FilterChip({
  label,
  active,
  onClick,
  groupId,
}: {
  label: string
  active: boolean
  onClick: () => void
  groupId: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? 'text-white'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {active && (
        <motion.span
          layoutId={`chip-bg-${groupId}`}
          className="absolute inset-0 rounded-lg bg-peiyang-500"
          style={{ zIndex: -1 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      {label || '全部'}
    </button>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  groupId,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  groupId: string
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-1 flex-wrap">
        <FilterChip label="" active={value === ''} onClick={() => onChange('')} groupId={groupId} />
        {options.map(opt => (
          <FilterChip
            key={opt}
            label={opt}
            active={value === opt}
            onClick={() => onChange(opt)}
            groupId={groupId}
          />
        ))}
      </div>
    </div>
  )
}

export function FilterBar({ filters, onChange, categories, colors, total, filtered }: Props) {
  const hasActiveFilters =
    filters.category !== '' || filters.color !== '' || filters.layout !== '' || filters.search !== ''

  function reset() {
    onChange({ category: '', color: '', layout: '', search: '' })
  }

  return (
    <div
      id="gallery"
      className="sticky top-16 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3"
    >
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              placeholder="搜索素材…"
              value={filters.search}
              onChange={e => onChange({ ...filters, search: e.target.value })}
              className={cn(
                'w-full pl-9 pr-3 py-2 text-sm rounded-lg border',
                'border-gray-200 dark:border-gray-700',
                'bg-white dark:bg-gray-900',
                'text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-peiyang-500/40 focus:border-peiyang-500',
                'transition-colors'
              )}
            />
          </div>

          {/* Count + reset */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {filtered < total ? (
                <>
                  <span className="font-semibold text-peiyang-500">{filtered}</span>
                  <span> / {total}</span>
                </>
              ) : (
                <span>{total} 个素材</span>
              )}
            </span>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={reset}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium',
                    'text-gray-500 dark:text-gray-400',
                    'hover:text-gray-900 dark:hover:text-gray-100',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'transition-colors border border-gray-200 dark:border-gray-700'
                  )}
                  aria-label="清除筛选"
                >
                  <X size={11} />
                  清除
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
          <FilterGroup
            label="分类"
            options={categories}
            value={filters.category}
            onChange={v => onChange({ ...filters, category: v })}
            groupId="category"
          />
          <FilterGroup
            label="配色"
            options={colors}
            value={filters.color}
            onChange={v => onChange({ ...filters, color: v })}
            groupId="color"
          />
          <FilterGroup
            label="版式"
            options={LAYOUTS.filter(Boolean) as string[]}
            value={filters.layout}
            onChange={v => onChange({ ...filters, layout: v })}
            groupId="layout"
          />
        </div>
      </div>
    </div>
  )
}
