import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Copy, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { assetUrl } from '@/lib/assetUrl'
import { useCopySvg } from '@/lib/useCopy'
import type { LogoEntry, FormatSet } from '@/types'

type Backdrop = 'light' | 'dark' | 'checker'

interface Props {
  logo: LogoEntry
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

const BACKDROP_OPTIONS: { key: Backdrop; label: string }[] = [
  { key: 'light', label: '亮' },
  { key: 'dark',  label: '暗' },
  { key: 'checker', label: '透明' },
]

function getBackdropClass(backdrop: Backdrop): string {
  switch (backdrop) {
    case 'light':   return 'bg-gray-100'
    case 'dark':    return 'bg-gray-900'
    case 'checker': return 'checkerboard'
  }
}

function DownloadRow({ title, formats }: { title: string; formats: FormatSet }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {formats.png && (
          <a
            href={assetUrl(formats.png)}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
          >
            <Download size={12} /> PNG
          </a>
        )}
        {formats.svg && (
          <a
            href={assetUrl(formats.svg)}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors"
          >
            <Download size={12} /> SVG
          </a>
        )}
        {formats.pdf && (
          <a
            href={assetUrl(formats.pdf)}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
          >
            <Download size={12} /> PDF
          </a>
        )}
      </div>
    </div>
  )
}

export function Lightbox({ logo, onClose, onPrev, onNext }: Props) {
  const [backdrop, setBackdrop] = useState<Backdrop>(
    logo.cardBg === 'checker' ? 'checker' : logo.cardBg === 'blue' ? 'dark' : 'light'
  )
  const { state: copyState, copy } = useCopySvg()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock scroll
  useEffect(() => {
    document.body.classList.add('scroll-locked')
    return () => document.body.classList.remove('scroll-locked')
  }, [])

  // Keyboard: Esc, arrows
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  // Focus trap
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // Best SVG for copy
  const svgForCopy = logo.layouts.fill?.svg ?? logo.layouts.padding?.svg

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        aria-modal="true"
        role="dialog"
        aria-label={`${logo.name} ${logo.color}`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
          className={cn(
            'relative w-full max-w-3xl max-h-[90dvh] overflow-y-auto',
            'bg-white dark:bg-gray-900',
            'rounded-2xl shadow-2xl',
            'flex flex-col'
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-5 pb-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {logo.name}
              </h2>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {logo.colorFg && (
                  <span className="px-2 py-0.5 rounded-md text-xs bg-peiyang-50 dark:bg-peiyang-900/30 text-peiyang-700 dark:text-peiyang-300 font-medium">
                    前景 {logo.colorFg}
                  </span>
                )}
                {logo.colorBg && (
                  <span className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                    背景 {logo.colorBg}
                  </span>
                )}
                {logo.category && (
                  <span className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                    {logo.category}
                  </span>
                )}
              </div>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              className="shrink-0 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="关闭"
            >
              <X size={18} />
            </button>
          </div>

          {/* Preview */}
          <div className="p-5 flex flex-col gap-4">
            {/* Backdrop toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">预览底色</span>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {BACKDROP_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setBackdrop(opt.key)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium transition-colors',
                      backdrop === opt.key
                        ? 'bg-peiyang-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image preview */}
            <div
              className={cn(
                'rounded-xl flex items-center justify-center p-8 min-h-48',
                getBackdropClass(backdrop)
              )}
            >
              {logo.preview && (
                <img
                  src={assetUrl(logo.preview)}
                  alt={`${logo.name} 前景${logo.colorFg} 背景${logo.colorBg}`}
                  className="max-w-full max-h-80 object-contain"
                />
              )}
            </div>

            {/* Downloads */}
            <div className="flex flex-col gap-4 pt-2">
              {logo.layouts.fill && (
                <DownloadRow title="填充版" formats={logo.layouts.fill} />
              )}
              {logo.layouts.padding && (
                <DownloadRow title="独立区域版" formats={logo.layouts.padding} />
              )}
            </div>

            {/* Copy SVG */}
            {svgForCopy && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => copy(svgForCopy)}
                  disabled={copyState === 'copying'}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                    'border transition-colors',
                    copyState === 'done'
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {copyState === 'copying' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : copyState === 'done' ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copyState === 'done'
                    ? '已复制 SVG 代码'
                    : copyState === 'copying'
                    ? '复制中…'
                    : '复制 SVG 代码'}
                </button>
              </div>
            )}
          </div>

          {/* Prev / Next */}
          {(onPrev || onNext) && (
            <div className="flex items-center justify-between px-5 pb-5 gap-4">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={15} /> 上一个
              </button>
              <button
                onClick={onNext}
                disabled={!onNext}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                下一个 <ChevronRight size={15} />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
