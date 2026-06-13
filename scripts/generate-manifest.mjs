/**
 * generate-manifest.mjs
 *
 * Scans images/{fill,padding}/{png,svg,pdf}/ and official/ to produce
 * src/data/manifest.json. Run via `npm run generate-manifest`.
 *
 * Do NOT hand-edit manifest.json — always regenerate from this script.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─── Token → attribute maps ──────────────────────────────────────────────────

const COLOR_MAP = {
  white: '北洋蓝/白',
  blue: '白/北洋蓝',
  tp: '北洋蓝/透明',
  black: '黑/白',
}

const LANG_MAP = {
  cn: '中文',
  en: '英文',
}

const ORIENT_MAP = {
  vert_ht: '横文纵排',
  vert_vt: '纵文纵排',
  vert: '纵向',
}

// Chinese display names for categories
const CAT = {
  badge: '图形标志',
  text: '字体标志',
  shield: '辅助图形',
  combo: '标准组合',
}

// ─── Parse a basename (without extension) into structured metadata ────────────

function parseName(base) {
  // Strip the leading "tju_" prefix
  const rest = base.replace(/^tju_/, '')

  let category, color, lang, orientation, subtype

  // ── Shields (辅助图形) ────────────────────────────────────────────────────
  if (rest.startsWith('shield_')) {
    category = CAT.shield
    if (rest === 'shield_border') {
      subtype = '边框'; color = COLOR_MAP.white
    } else if (rest === 'shield_border_tp') {
      subtype = '边框'; color = COLOR_MAP.tp
    } else if (rest === 'shield_fill') {
      subtype = '填充'; color = COLOR_MAP.white
    } else if (rest === 'shield_fill_tp') {
      subtype = '填充'; color = COLOR_MAP.tp
    } else {
      subtype = ''; color = ''
    }
    lang = ''
    orientation = ''
    const name = `北洋盾（${subtype}）`
    return { category, color, lang, orientation, name, cardBg: colorToBg(color) }
  }

  // ── Badge / 图形标志（校徽） ──────────────────────────────────────────────
  if (rest.startsWith('badge_')) {
    category = CAT.badge
    const sub = rest.slice('badge_'.length)    // e.g. "white", "blue", "tp"
    color = COLOR_MAP[sub] ?? ''
    lang = ''
    orientation = ''
    const name = '图形标志'
    return { category, color, lang, orientation, name, cardBg: colorToBg(color) }
  }

  // ── Text / 字体标志（校标） ───────────────────────────────────────────────
  if (rest.startsWith('text_')) {
    category = CAT.text
    let sub = rest.slice('text_'.length)        // e.g. "white", "cn_white", "en_black_vert"

    // Extract lang prefix (cn/en) if present
    lang = ''
    if (sub.startsWith('cn_')) { lang = LANG_MAP.cn; sub = sub.slice(3) }
    else if (sub.startsWith('en_')) { lang = LANG_MAP.en; sub = sub.slice(3) }
    // e.g. sub is now "white", "black_vert", "tp"

    // Extract color
    color = ''
    for (const [token, label] of Object.entries(COLOR_MAP)) {
      if (sub === token || sub.startsWith(token + '_')) {
        color = label
        sub = sub.slice(token.length).replace(/^_/, '')
        break
      }
    }
    // sub is now the orientation part e.g. "vert"

    // Extract orientation
    orientation = parseOrientation(sub)

    const nameParts = ['校标']
    const quals = []
    if (lang) quals.push(lang)
    if (orientation && orientation !== '横向') quals.push(orientation)
    if (quals.length) nameParts.push(`（${quals.join('，')}）`)
    const name = nameParts.join('')

    return { category, color, lang, orientation, name, cardBg: colorToBg(color) }
  }

  // ── Standard combos 标准组合（校徽校标） ──────────────────────────────────
  // rest = "white" | "blue" | "tp" | "white_vert_ht" | "white_cn" | "tp_cn_vert" ...
  category = CAT.combo
  let sub = rest

  // Extract color first
  color = ''
  for (const [token, label] of Object.entries(COLOR_MAP)) {
    if (sub === token || sub.startsWith(token + '_')) {
      color = label
      sub = sub.slice(token.length).replace(/^_/, '')
      break
    }
  }
  // sub is now e.g. "" | "vert_ht" | "cn" | "cn_vert" | "en" | "en_vert"

  // Extract lang
  lang = ''
  if (sub.startsWith('cn_') || sub === 'cn') {
    lang = LANG_MAP.cn; sub = sub.slice(sub.startsWith('cn_') ? 3 : 2)
  } else if (sub.startsWith('en_') || sub === 'en') {
    lang = LANG_MAP.en; sub = sub.slice(sub.startsWith('en_') ? 3 : 2)
  }
  // sub is now the orientation part

  orientation = parseOrientation(sub)

  const nameParts = ['校徽校标']
  const quals = []
  if (lang) quals.push(lang)
  if (orientation && orientation !== '横向') quals.push(orientation)
  if (quals.length) nameParts.push(`（${quals.join('，')}）`)
  const name = nameParts.join('')

  return { category, color, lang, orientation, name, cardBg: colorToBg(color) }
}

function parseOrientation(sub) {
  if (!sub) return '横向'
  for (const [token, label] of Object.entries(ORIENT_MAP)) {
    if (sub === token || sub.startsWith(token)) return label
  }
  return '横向'
}

function colorToBg(color) {
  switch (color) {
    case '北洋蓝/白': return 'blue'     // logo is blue on white
    case '白/北洋蓝': return 'white'    // logo is white on blue
    case '北洋蓝/透明': return 'checker'
    case '黑/白': return 'light'
    default: return 'light'
  }
}

// ─── Scan image directories ────────────────────────────────────────────────────

function scanDir(dir) {
  const full = path.join(ROOT, dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full).sort()
}

// Collect all basenames from fill (basenames without extension)
const fillPngFiles = scanDir('images/fill/png')
const fillBases = fillPngFiles.map(f => path.basename(f, '.png'))

// Collect all basenames from padding (strip _padding suffix)
const padPngFiles = scanDir('images/padding/png')
const padBases = padPngFiles.map(f => path.basename(f, '.png').replace(/_padding$/, ''))

// Union of all unique bases
const allBases = [...new Set([...fillBases, ...padBases])].sort()

function hasFile(dir, fmt, base, ispadding) {
  const suffix = ispadding ? `_padding.${fmt}` : `.${fmt}`
  const fpath = path.join(ROOT, `images/${dir}/${fmt}/${base}${suffix}`)
  return fs.existsSync(fpath)
}

function makeFormatPaths(layoutDir, base, ispadding) {
  const formats = ['png', 'svg', 'pdf']
  const result = {}
  for (const fmt of formats) {
    if (hasFile(layoutDir, fmt, base, ispadding)) {
      const suffix = ispadding ? `_padding.${fmt}` : `.${fmt}`
      result[fmt] = `images/${layoutDir}/${fmt}/${base}${suffix}`
    }
  }
  return Object.keys(result).length > 0 ? result : null
}

// ─── Build logo entries ────────────────────────────────────────────────────────

const logos = allBases.map((base, idx) => {
  const hasFill = fillBases.includes(base)
  const hasPad = padBases.includes(base)

  const fill = hasFill ? makeFormatPaths('fill', base, false) : null
  const padding = hasPad ? makeFormatPaths('padding', base, true) : null

  const meta = parseName(base)

  // Best SVG for preview: prefer fill svg, fallback to padding svg
  const previewSvg =
    fill?.svg ??
    (padding ? `images/padding/svg/${base}_padding.svg` : null)

  // Tags for filtering
  const tags = [
    meta.category,
    meta.color,
    meta.lang,
    meta.orientation,
    hasFill ? '填充' : null,
    hasPad ? '独立区域' : null,
  ].filter(Boolean)

  return {
    id: `logo-${idx}-${base}`,
    base,
    name: meta.name,
    category: meta.category,
    color: meta.color,
    lang: meta.lang,
    orientation: meta.orientation,
    cardBg: meta.cardBg,
    preview: previewSvg,
    layouts: {
      ...(fill ? { fill } : {}),
      ...(padding ? { padding } : {}),
    },
    tags: [...new Set(tags)],
  }
})

// ─── Reference materials ──────────────────────────────────────────────────────

const REFERENCE_META = {
  'main_building.jpg': { name: '主楼', type: 'jpg' },
  'peiyang_university.jpg': { name: '北洋大学堂', type: 'jpg' },
  '天津大学标准校徽.jpg': { name: '天津大学标准校徽', type: 'jpg' },
  '校训.jpg': { name: '校训', type: 'jpg' },
  '天津大学视觉形象识别手册_2011.pdf': { name: 'VI 手册（2011 年）', type: 'pdf' },
  '天津大学视觉形象识别系统(TU VI)手册_2012.pdf': { name: 'VI 手册（2012 年）', type: 'pdf' },
  '配色方案.pdf': { name: '配色方案', type: 'pdf' },
}

const officialDir = path.join(ROOT, 'official')
const references = []
if (fs.existsSync(officialDir)) {
  for (const [filename, meta] of Object.entries(REFERENCE_META)) {
    const fpath = path.join(officialDir, filename)
    if (fs.existsSync(fpath)) {
      const stat = fs.statSync(fpath)
      references.push({
        name: meta.name,
        path: `official/${filename}`,
        type: meta.type,
        sizeBytes: stat.size,
      })
    }
  }
}

// ─── Build filter options ─────────────────────────────────────────────────────

function unique(arr) { return [...new Set(arr.filter(Boolean))].sort() }

const categories = unique(logos.map(l => l.category))
const colors = unique(logos.map(l => l.color))
const langs = unique(logos.map(l => l.lang))
const orientations = unique(logos.map(l => l.orientation))

// ─── Write manifest ────────────────────────────────────────────────────────────

const manifest = {
  generated: new Date().toISOString(),
  stats: {
    total: logos.length,
    withFill: logos.filter(l => l.layouts.fill).length,
    withPadding: logos.filter(l => l.layouts.padding).length,
  },
  filterOptions: { categories, colors, langs, orientations },
  logos,
  references,
}

const outPath = path.join(ROOT, 'src/data/manifest.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')

console.log(
  `✓ manifest.json generated — ${logos.length} logos, ${references.length} references`
)
logos.forEach(l => {
  const layouts = Object.keys(l.layouts).join('+')
  const fmts = Object.values(l.layouts)
    .flatMap(f => Object.keys(f))
    .filter((v, i, a) => a.indexOf(v) === i)
    .join('/')
  console.log(`  ${l.base.padEnd(40)} [${layouts}] [${fmts}]`)
})
