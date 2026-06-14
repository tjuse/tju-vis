import { useEffect, useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Filters } from '@/types'

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  categories: string[]
  foregrounds: string[]
  backgrounds: string[]
  total: number
  filtered: number
}

const LAYOUTS = ['填充', '独立区域'] as const

// ── Chip (no shared-layout animation — replaced with plain CSS transition) ──

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? 'bg-peiyang-500 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {label || '全部'}
    </motion.button>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 pt-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-8">
        {label}
      </span>
      <div className="flex items-center gap-1 flex-wrap">
        <FilterChip label="" active={value === ''} onClick={() => onChange('')} />
        {options.map(opt => (
          <FilterChip
            key={opt}
            label={opt}
            active={value === opt}
            onClick={() => onChange(opt)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Desktop inline filter row ─────────────────────────────────────────────────

function DesktopFilters({
  filters,
  onChange,
  categories,
  foregrounds,
  backgrounds,
}: Pick<Props, 'filters' | 'onChange' | 'categories' | 'foregrounds' | 'backgrounds'>) {
  return (
    <div className="hidden sm:flex flex-row flex-wrap gap-x-6 gap-y-3 pb-1">
      <FilterGroup
        label="分类"
        options={categories}
        value={filters.category}
        onChange={v => onChange({ ...filters, category: v })}
      />
      <FilterGroup
        label="前景"
        options={foregrounds}
        value={filters.foreground}
        onChange={v => onChange({ ...filters, foreground: v })}
      />
      <FilterGroup
        label="背景"
        options={backgrounds}
        value={filters.background}
        onChange={v => onChange({ ...filters, background: v })}
      />
      <FilterGroup
        label="版式"
        options={[...LAYOUTS]}
        value={filters.layout}
        onChange={v => onChange({ ...filters, layout: v })}
      />
    </div>
  )
}

// ── Mobile bottom-sheet ───────────────────────────────────────────────────────

function MobileFilterSheet({
  open,
  onClose,
  filters,
  onChange,
  categories,
  foregrounds,
  backgrounds,
  filtered,
}: {
  open: boolean
  onClose: () => void
  filters: Filters
  onChange: (f: Filters) => void
  categories: string[]
  foregrounds: string[]
  backgrounds: string[]
  filtered: number
}) {
  // Scroll-lock while open
  useEffect(() => {
    if (open) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
    return () => document.body.classList.remove('scroll-locked')
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  function reset() {
    onChange({ ...filters, category: '', foreground: '', background: '', layout: '' })
  }

  const hasActiveFilters =
    filters.category !== '' || filters.foreground !== '' ||
    filters.background !== '' || filters.layout !== ''

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0.12, duration: 0.4 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 sm:hidden',
              'bg-white dark:bg-gray-900',
              'rounded-t-2xl shadow-2xl',
              'px-5 pb-8 pt-4',
              'max-h-[85dvh] overflow-y-auto'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="筛选素材"
          >
            {/* Handle bar */}
            <div className="flex justify-center mb-4">
              <div className="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">筛选</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="关闭筛选"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter groups */}
            <div className="flex flex-col gap-5">
              <FilterGroup
                label="分类"
                options={categories}
                value={filters.category}
                onChange={v => onChange({ ...filters, category: v })}
              />
              <FilterGroup
                label="前景"
                options={foregrounds}
                value={filters.foreground}
                onChange={v => onChange({ ...filters, foreground: v })}
              />
              <FilterGroup
                label="背景"
                options={backgrounds}
                value={filters.background}
                onChange={v => onChange({ ...filters, background: v })}
              />
              <FilterGroup
                label="版式"
                options={[...LAYOUTS]}
                value={filters.layout}
                onChange={v => onChange({ ...filters, layout: v })}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              {hasActiveFilters && (
                <button
                  onClick={reset}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  清除筛选
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-[2] py-3 rounded-xl bg-peiyang-500 text-white text-sm font-semibold hover:bg-peiyang-600 transition-colors"
              >
                查看 {filtered} 个结果
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Main FilterBar ────────────────────────────────────────────────────────────

export function FilterBar({
  filters, onChange, categories, foregrounds, backgrounds, total, filtered,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const hasActiveFilters =
    filters.category !== '' || filters.foreground !== '' ||
    filters.background !== '' || filters.layout !== '' || filters.search !== ''

  const activeFilterCount =
    [filters.category, filters.foreground, filters.background, filters.layout]
      .filter(Boolean).length

  function reset() {
    onChange({ category: '', foreground: '', background: '', layout: '', search: '' })
  }

  return (
    <>
      <div
        id="gallery"
        className="sticky top-16 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3"
      >
        <div className="flex flex-col gap-3">
          {/* Search row — always visible */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
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

            {/* Mobile: filter trigger button */}
            <button
              onClick={() => setSheetOpen(true)}
              className={cn(
                'sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors shrink-0',
                activeFilterCount > 0
                  ? 'border-peiyang-400 bg-peiyang-50 dark:bg-peiyang-900/20 text-peiyang-600 dark:text-peiyang-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
              aria-label="打开筛选"
            >
              <SlidersHorizontal size={14} />
              筛选
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-peiyang-500 text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Count + reset — desktop */}
            <div className="hidden sm:flex items-center gap-2 ml-auto shrink-0">
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

            {/* Count — mobile right side */}
            <span className="sm:hidden text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
              {filtered < total ? (
                <>
                  <span className="font-semibold text-peiyang-500">{filtered}</span>
                  <span className="text-gray-400"> / {total}</span>
                </>
              ) : (
                `${total} 个`
              )}
            </span>
          </div>

          {/* Desktop filter chips */}
          <DesktopFilters
            filters={filters}
            onChange={onChange}
            categories={categories}
            foregrounds={foregrounds}
            backgrounds={backgrounds}
          />
        </div>
      </div>

      {/* Mobile bottom-sheet */}
      <MobileFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={onChange}
        categories={categories}
        foregrounds={foregrounds}
        backgrounds={backgrounds}
        filtered={filtered}
      />
    </>
  )
}
