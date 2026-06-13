import { FileText, Image, Download } from 'lucide-react'
import { assetUrl } from '@/lib/assetUrl'
import { cn } from '@/lib/cn'
import type { Reference } from '@/types'

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

interface Props {
  references: Reference[]
}

export function ReferenceSection({ references }: Props) {
  const pdfs = references.filter(r => r.type === 'pdf')
  const images = references.filter(r => r.type === 'jpg')

  return (
    <section
      id="references"
      className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">参考文档</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            天津大学官方视觉形象识别手册及参考图片
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* PDFs */}
          {pdfs.map(ref => (
            <a
              key={ref.path}
              href={assetUrl(ref.path)}
              download
              className={cn(
                'group flex items-start gap-4 p-4 rounded-xl',
                'border border-gray-200 dark:border-gray-800',
                'bg-white dark:bg-gray-900',
                'hover:border-peiyang-300 dark:hover:border-peiyang-700',
                'hover:shadow-sm transition-all duration-150'
              )}
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                <FileText size={18} className="text-rose-500 dark:text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-peiyang-600 dark:group-hover:text-peiyang-300 transition-colors truncate">
                  {ref.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 uppercase font-medium">PDF</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{formatSize(ref.sizeBytes)}</span>
                </div>
              </div>
              <Download
                size={14}
                className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-peiyang-500 dark:group-hover:text-peiyang-400 transition-colors mt-1"
              />
            </a>
          ))}

          {/* Images */}
          {images.map(ref => (
            <a
              key={ref.path}
              href={assetUrl(ref.path)}
              download
              className={cn(
                'group flex items-start gap-4 p-4 rounded-xl',
                'border border-gray-200 dark:border-gray-800',
                'bg-white dark:bg-gray-900',
                'hover:border-peiyang-300 dark:hover:border-peiyang-700',
                'hover:shadow-sm transition-all duration-150'
              )}
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center">
                <Image size={18} className="text-sky-500 dark:text-sky-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-peiyang-600 dark:group-hover:text-peiyang-300 transition-colors truncate">
                  {ref.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 uppercase font-medium">JPG</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{formatSize(ref.sizeBytes)}</span>
                </div>
              </div>
              <Download
                size={14}
                className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-peiyang-500 dark:group-hover:text-peiyang-400 transition-colors mt-1"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
