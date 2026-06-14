import { useEffect, useState } from 'react'

const BREAKPOINTS = [
  { query: '(min-width: 1024px)', cols: 4 },
  { query: '(min-width: 768px)',  cols: 3 },
] as const

function resolveColumns(): number {
  for (const { query, cols } of BREAKPOINTS) {
    if (typeof window !== 'undefined' && window.matchMedia(query).matches) return cols
  }
  return 2 // mobile default
}

/** Returns the active masonry column count, updating on viewport resize. */
export function useColumnCount(): number {
  const [cols, setCols] = useState<number>(resolveColumns)

  useEffect(() => {
    const mqs = BREAKPOINTS.map(({ query, cols: n }) => {
      const mq = window.matchMedia(query)
      const handler = () => setCols(resolveColumns())
      mq.addEventListener('change', handler)
      return { mq, handler }
    })
    return () => {
      mqs.forEach(({ mq, handler }) => mq.removeEventListener('change', handler))
    }
  }, [])

  return cols
}
