import { useState } from 'react'
import { Download, FileImage, FileType, Copy, Check, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { assetUrl } from '@/lib/assetUrl'
import { useCopySvg } from '@/lib/useCopy'
import type { LogoEntry, FormatSet } from '@/types'

interface Props {
  logo: LogoEntry
  onOpen: (logo: LogoEntry) => void
}

// Card background by color variant
function getCardBgClass(cardBg: LogoEntry['cardBg']): string {
  switch (cardBg) {
    case 'blue':    return 'bg-peiyang-500'
    case 'white':   return 'bg-white border border-gray-200 dark:border-gray-700'
    case 'checker': return 'checkerboard'
    case 'light':   return 'bg-gray-100 dark:bg-gray-800'
    default:        return 'bg-gray-100'
  }
}

function FormatButton({
  fmt,
  path,
  svgState,
  onCopy,
}: {
  fmt: string
  path: string
  svgState?: ReturnType<typeof useCopySvg>['state']
  onCopy?: () => void
}) {
  const isSvg = fmt === 'svg'
  const isCopying = isSvg && svgState === 'copying'
  const isDone = isSvg && svgState === 'done'

  return (
    <a
      href={assetUrl(path)}
      download
      onClick={e => {
        if (isSvg && onCopy) {
          // Don't prevent default (let file download proceed) but also copy
        }
      }}
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

  // Determine which layout set to show by default: prefer padding, then fill
  const displayFormats: FormatSet | undefined = logo.layouts.padding ?? logo.layouts.fill

  const colorLabel = logo.color
  const hasMultipleLayouts = logo.layouts.fill && logo.layouts.padding

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className={cn(
        'group flex flex-col rounded-2xl overflow-hidden',
        'border border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-900',
        'shadow-sm hover:shadow-md dark:shadow-none',
        'transition-shadow duration-200'
      )}
    >
      {/* Preview area */}
      <button
        onClick={() => onOpen(logo)}
        className="relative cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-peiyang-500 focus-visible:ring-inset"
        aria-label={`预览 ${logo.name} ${colorLabel}`}
      >
        <div
          className={cn(
            'aspect-[4/3] flex items-center justify-center p-6',
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

        {/* Expand hint */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5',
            'opacity-0 group-hover:opacity-100 transition-all duration-200'
          )}
        >
          <span className="px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
            点击预览
          </span>
        </div>
      </button>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Name + tags */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
            {logo.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-peiyang-50 dark:bg-peiyang-900/30 text-peiyang-700 dark:text-peiyang-300 font-medium">
              {colorLabel}
            </span>
            {hasMultipleLayouts && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                填充 + 独立区域
              </span>
            )}
          </div>
        </div>

        {/* Download buttons */}
        {displayFormats && (
          <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            {displayFormats.png && <FormatButton fmt="png" path={displayFormats.png} />}
            {displayFormats.svg && <FormatButton fmt="svg" path={displayFormats.svg} />}
            {displayFormats.pdf && <FormatButton fmt="pdf" path={displayFormats.pdf} />}

            {/* Copy SVG */}
            {(displayFormats.svg) && (
              <button
                onClick={() => copy(displayFormats.svg!)}
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
