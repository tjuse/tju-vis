import { Github, ExternalLink } from 'lucide-react'

const RELATED_PROJECTS = [
  { name: '中国双一流大学 VI 系统', href: 'https://github.com/wanzhenchn/Visual_Identity_System_Chinese_University' },
  { name: '西安电子科技大学校徽', href: 'https://github.com/note286/xdulogo' },
  { name: '东南大学校徽', href: 'https://github.com/seumxc/SEU-Logo' },
  { name: '重庆大学视觉标识', href: 'https://github.com/CQUtug/CQULogo' },
  { name: '中国科学技术大学 VI', href: 'https://github.com/ustctug/ustclogo' },
]

const OFFICIAL_LINKS = [
  { name: 'VI 手册（2012 年）', href: 'https://f.tju.edu.cn/tp_up/download?path=uploadfiles/news/info/332947607552.pdf&name=%E5%A4%A9%E6%B4%A5%E5%A4%A7%E5%AD%A6%E8%A7%86%E8%A7%89%E5%BD%A2%E8%B1%A1%E8%AF%86%E5%88%AB%E7%B3%BB%E7%BB%9F(TU%20VI)%E6%89%8B%E5%86%8C.pdf' },
  { name: '天大标识（官方）', href: 'https://www.tju.edu.cn/tdgk/tdbs.htm' },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <img src="images/fill/svg/tju_badge_white.svg" alt="" className="w-full h-full" />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                天津大学视觉形象识别系统
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
              非天津大学官方项目。图形标志和字体标志的版权归天津大学所有。
              本项目依据{' '}
              <a
                href="https://github.com/tjuse/tju-vis/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-peiyang-500"
              >
                MIT 协议
              </a>
              {' '}开源，供学习和非商业用途。
            </p>
          </div>

          {/* Official refs */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              官方参考
            </h3>
            <ul className="space-y-2">
              {OFFICIAL_LINKS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-peiyang-500 dark:hover:text-peiyang-400 transition-colors"
                  >
                    {l.name}
                    <ExternalLink size={11} className="opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Related */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              相关项目
            </h3>
            <ul className="space-y-2">
              {RELATED_PROJECTS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-peiyang-500 dark:hover:text-peiyang-400 transition-colors"
                  >
                    {l.name}
                    <ExternalLink size={11} className="opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-600">
          <span>© 2024 tju-vis contributors</span>
          <a
            href="https://github.com/tjuse/tju-vis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Github size={13} /> tjuse/tju-vis
          </a>
        </div>
      </div>
    </footer>
  )
}
