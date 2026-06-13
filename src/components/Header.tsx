import { Moon, Sun, Github } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function Header({ theme, onToggle }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="天津大学视觉形象识别系统"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img
              src="images/fill/svg/tju_badge_white.svg"
              alt="天津大学校徽"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="hidden sm:block text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-peiyang-500 dark:group-hover:text-peiyang-300 transition-colors">
            天津大学视觉形象识别系统
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <a
            href="#gallery"
            className="hover:text-peiyang-500 dark:hover:text-peiyang-300 transition-colors"
          >
            素材下载
          </a>
          <a
            href="#references"
            className="hover:text-peiyang-500 dark:hover:text-peiyang-300 transition-colors"
          >
            参考文档
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/tjuse/tju-vis"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-2 rounded-lg text-gray-500 dark:text-gray-400',
              'hover:text-gray-900 dark:hover:text-gray-100',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors'
            )}
            aria-label="在 GitHub 上查看"
          >
            <Github size={18} />
          </a>
          <button
            onClick={onToggle}
            className={cn(
              'p-2 rounded-lg text-gray-500 dark:text-gray-400',
              'hover:text-gray-900 dark:hover:text-gray-100',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors'
            )}
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
