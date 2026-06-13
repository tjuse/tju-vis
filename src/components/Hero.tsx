import { Download } from 'lucide-react'

interface Props {
  totalLogos: number
}

export function Hero({ totalLogos }: Props) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-peiyang-500 text-white"
    >
      {/* Subtle mesh gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,70,140,0.0) 0%, rgba(0,46,96,0.5) 100%), ' +
            'radial-gradient(ellipse 40% 60% at 20% 80%, rgba(0,58,119,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20">
              <Download size={11} />
              {totalLogos} 个素材
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20">
              PNG · SVG · PDF
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
            天津大学<br className="sm:hidden" />
            <span className="text-peiyang-200">视觉形象识别系统</span>
          </h1>

          <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 max-w-xl">
            在官方视觉形象识别手册基础上经过校正的校徽、校标完整版本，
            支持 PNG、SVG、PDF 三种格式下载，含填充版与独立区域版。
          </p>

          <a
            href="#gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-peiyang-500 text-sm font-semibold hover:bg-peiyang-50 transition-colors shadow-sm"
          >
            浏览素材
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2L12 7L7 12M2 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative border-t border-white/10 bg-peiyang-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-white/60">
            本项目非天津大学官方项目，图形标志和字体标志的版权归天津大学所有。
          </p>
        </div>
      </div>
    </section>
  )
}
