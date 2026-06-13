import { Copy, Check, Loader2, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { assetUrl } from '@/lib/assetUrl'
import { useCopySvg } from '@/lib/useCopy'
import type { LogoEntry, FormatSet } from '@/types'

interface Props {
  logo: LogoEntry
  onOpen: (logo: LogoEntry) => void
}

function getCardBgClass(cardBg: LogoEntry['cardBg']): string {
  switch (cardBg) {
    case 'blue':    return 'bg-peiyang-500'
    case 'white':   return 'bg-white border border-gray-200 dark:border-gray-700'
    case 'checker': return 'checkerboard'
    case 'light':   return 'bg-gray-100 dark:bg-gray-800'
    default:        return 'bg-gray-100'
  }
}

function FormatButton({ fmt, path }: { fmt: string; path: string }) {
  return (
    <a
      href={assetUrl(path)}
      download
      onClick={e => e.stopPropagation()}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide',
        'transition-colors',
        fmt === 'png'
          ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800/60'
          : fmt === 'svg'
          ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/60'
          : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-800/60'
      )}
    >
      <Download size={9} />
      {fmt}
    </a>
  )
}

export function LogoCard({ logo, onOpen }: Props) {
  const { state: copyState, copy } = useCopySvg()

  // Prefer padding variant for the card download row
  const displayFormats: FormatSet | undefined = logo.layouts.padding ?? logo.layouts.fill
  const colorLabel = logo.color
  const hasMultipleLayouts = !!(logo.layouts.fill && logo.layouts.padding)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      onClick={() => onOpen(logo)}
      className={cn(
        'group flex flex-col rounded-2xl overflow-hidden cursor-pointer',
        'border border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-900',
        'shadow-sm hover:shadow-md dark:shadow-none',
        'transition-shadow duration-200',
        'focus-visible:outline-2 focus-visible:outline-peiyang-500'
      )}
      tabIndex={0}
      role="button"
      aria-label={`预览 ${logo.name} ${colorLabel}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(logo) } }}
    >
      {/* Preview area */}
      <div className="relative">
        <div
          className={cn(
            'aspect-[4/3] flex items-center justify-center p-4 sm:p-6',
            getCardBgClass(logo.cardBg)
          )}
        >
          {logo.preview ? (
            <img
              src={assetUrl(logo.preview)}
              alt={`${logo.name} ${colorLabel}`}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="text-gray-300 text-xs">无预览</div>
          )}
        </div>

        {/* Expand hint — desktop hover only */}
        <div
          className={cn(
            'absolute inset-0 hidden sm:flex items-center justify-center',
            'bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5',
            'opacity-0 group-hover:opacity-100 transition-all duration-200'
          )}
          aria-hidden="true"
        >
          <span className="px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
            点击预览
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
        {/* Name + tags */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
            {logo.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-peiyang-50 dark:bg-peiyang-900/30 text-peiyang-700 dark:text-peiyang-300 font-medium">
              {colorLabel}
            </span>
            {hasMultipleLayouts && (
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                填充 + 独立区域
              </span>
            )}
          </div>
        </div>

        {/* Download buttons — desktop only; mobile opens lightbox for downloads */}
        {displayFormats && (
          <div className="hidden sm:flex flex-wrap items-center gap-1.5 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            {displayFormats.png && <FormatButton fmt="png" path={displayFormats.png} />}
            {displayFormats.svg && <FormatButton fmt="svg" path={displayFormats.svg} />}
            {displayFormats.pdf && <FormatButton fmt="pdf" path={displayFormats.pdf} />}

            {displayFormats.svg && (
              <button
                onClick={e => { e.stopPropagation(); copy(displayFormats.svg!) }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold ml-auto',
                  'transition-colors',
                  copyState === 'done'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
                disabled={copyState === 'copying'}
                title="复制 SVG 代码"
              >
                {copyState === 'copying' ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : copyState === 'done' ? (
                  <Check size={10} />
                ) : (
                  <Copy size={10} />
                )}
                {copyState === 'done' ? '已复制' : 'SVG'}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
