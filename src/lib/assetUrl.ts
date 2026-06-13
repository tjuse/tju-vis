/**
 * Prepend the Vite base URL so asset paths work both in dev (base='/')
 * and on GitHub Pages (base='/tju-vis/').
 *
 * Pass a repo-relative path like "images/fill/svg/tju_blue.svg".
 */
export function assetUrl(repoRelativePath: string): string {
  // import.meta.env.BASE_URL is always '/' in dev and '/tju-vis/' in production build
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}/${repoRelativePath}`
}
