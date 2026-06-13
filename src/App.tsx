import { useState, useMemo, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { FilterBar } from '@/components/FilterBar'
import { LogoGrid } from '@/components/LogoGrid'
import { Lightbox } from '@/components/Lightbox'
import { ReferenceSection } from '@/components/ReferenceSection'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/lib/useTheme'
import { filterLogos, DEFAULT_FILTERS } from '@/lib/filtering'
import type { Filters, LogoEntry } from '@/types'
import manifestData from '@/data/manifest.json'

const manifest = manifestData as typeof import('@/data/manifest.json')

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedLogo, setSelectedLogo] = useState<LogoEntry | null>(null)

  const logos = manifest.logos as LogoEntry[]
  const references = manifest.references

  const filteredLogos = useMemo(
    () => filterLogos(logos, filters),
    [logos, filters]
  )

  // Index in filtered array for prev/next navigation
  const selectedIdx = selectedLogo
    ? filteredLogos.findIndex(l => l.id === selectedLogo.id)
    : -1

  const openLogo = useCallback((logo: LogoEntry) => setSelectedLogo(logo), [])
  const closeLogo = useCallback(() => setSelectedLogo(null), [])

  const goNext = selectedIdx < filteredLogos.length - 1
    ? () => setSelectedLogo(filteredLogos[selectedIdx + 1])
    : undefined

  const goPrev = selectedIdx > 0
    ? () => setSelectedLogo(filteredLogos[selectedIdx - 1])
    : undefined

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header theme={theme} onToggle={toggleTheme} />

      <main className="flex-1">
        <Hero totalLogos={logos.length} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            categories={manifest.filterOptions.categories}
            colors={manifest.filterOptions.colors}
            total={logos.length}
            filtered={filteredLogos.length}
          />

          <LogoGrid logos={filteredLogos} onSelect={openLogo} />
        </div>
      </main>

      <ReferenceSection references={references} />
      <Footer />

      <AnimatePresence>
        {selectedLogo && (
          <Lightbox
            key={selectedLogo.id}
            logo={selectedLogo}
            onClose={closeLogo}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
