import { useCallback, useState } from 'react'
import { assetUrl } from './assetUrl'

export type CopyState = 'idle' | 'copying' | 'done' | 'error'

/**
 * Fetch an SVG file and copy its text content to the clipboard.
 * Returns the current copy state and a trigger function.
 */
export function useCopySvg() {
  const [state, setState] = useState<CopyState>('idle')

  const copy = useCallback(async (svgPath: string) => {
    setState('copying')
    try {
      const url = assetUrl(svgPath)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setState('done')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }, [])

  return { state, copy }
}
