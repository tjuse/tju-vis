import { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { LogoCard } from './LogoCard'
import { useColumnCount } from '@/lib/useColumnCount'
import type { Filters, LogoEntry } from '@/types'

interface Props {
  logos: LogoEntry[]
  filters: Filters
  onSelect: (logo: LogoEntry) => void
}

const GAP = 16       // px, matches gap-4 / sm:gap-4
const CARD_PAD = 36  // top+bottom preview padding (p-4 sm:p-5 ≈ 18px each)
const CARD_BODY = 92 // card body height (name, tags, optional pill row)

/** Greedy bin-pack: put each card into the shortest column. */
function distributeByHeight(
  logos: LogoEntry[],
  colCount: number,
  colWidth: number,
): LogoEntry[][] {
  const cols: LogoEntry[][] = Array.from({ length: colCount }, () => [])
  const heights = new Array<number>(colCount).fill(0)

  for (const logo of logos) {
    // Estimate rendered image height (mirrors LogoCard: w-full h-auto max-h-[280px])
    const imgH = Math.min(colWidth / (logo.aspect || 1), 280)
    const cardH = imgH + CARD_PAD + CARD_BODY

    // Find the shortest column
    const shortestIdx = heights.indexOf(Math.min(...heights))
    cols[shortestIdx].push(logo)
    heights[shortestIdx] += cardH + GAP
  }

  return cols
}

export function LogoGrid({ logos, filters, onSelect }: Props) {
  const colCount = useColumnCount()
  const containerRef = useRef<HTMLDivElement>(null)
  const [colWidth, setColWidth] = useState(0)

  // Measure container width synchronously before paint
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const totalWidth = el.clientWidth
      const w = Math.floor((totalWidth - GAP * (colCount - 1)) / colCount)
      setColWidth(w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [colCount])

  // Derive a filter key for the fade transition
  const filterKey = `${filters.category}|${filters.foreground}|${filters.background}|${filters.layout}|${filters.search}`

  if (logos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <PackageSearch size={40} className="text-gray-300 dark:text-gray-700 mb-4" />
        <p className="text-base font-medium text-gray-500 dark:text-gray-400">暂无符合条件的素材</p>
        <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">请尝试调整筛选条件</p>
      </motion.div>
    )
  }

  // When colWidth is not yet measured, fall back to round-robin so nothing flashes
  const columns = colWidth > 0
    ? distributeByHeight(logos, colCount, colWidth)
    : Array.from({ length: colCount }, (_, ci) =>
        logos.filter((_, i) => i % colCount === ci)
      )

  return (
    <div ref={containerRef} className="py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={filterKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-start gap-3 sm:gap-4"
        >
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
              {col.map((logo, rowIdx) => (
                <motion.div
                  key={logo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: Math.min((colIdx + rowIdx * colCount) * 0.02, 0.3) },
                  }}
                >
                  <LogoCard logo={logo} onOpen={onSelect} />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
