import { motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { LogoCard } from './LogoCard'
import { useColumnCount } from '@/lib/useColumnCount'
import type { LogoEntry } from '@/types'

interface Props {
  logos: LogoEntry[]
  onSelect: (logo: LogoEntry) => void
}

export function LogoGrid({ logos, onSelect }: Props) {
  const colCount = useColumnCount()

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

  // Round-robin distribute into N columns (preserves left-to-right order)
  const columns: LogoEntry[][] = Array.from({ length: colCount }, () => [])
  logos.forEach((logo, i) => columns[i % colCount].push(logo))

  return (
    <div className="flex items-start gap-3 sm:gap-4 py-6">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
          {col.map((logo, rowIdx) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: Math.min((colIdx + rowIdx * colCount) * 0.025, 0.35) },
              }}
            >
              <LogoCard logo={logo} onOpen={onSelect} />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}
