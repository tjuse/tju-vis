import { motion, AnimatePresence } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { LogoCard } from './LogoCard'
import type { LogoEntry } from '@/types'

interface Props {
  logos: LogoEntry[]
  onSelect: (logo: LogoEntry) => void
}

export function LogoGrid({ logos, onSelect }: Props) {
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

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6"
    >
      <AnimatePresence mode="popLayout">
        {logos.map((logo, i) => (
          <motion.div
            key={logo.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: Math.min(i * 0.02, 0.3) } }}
            exit={{ opacity: 0 }}
          >
            <LogoCard logo={logo} onOpen={onSelect} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
