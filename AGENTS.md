# AGENTS.md — TJU Visual Identity Gallery

This file is a reference for contributors, code-review agents, and LLM-powered editors working
on the **天津大学视觉形象识别系统** web gallery (`tjuse/tju-vis`).

---

## 1. Project purpose

Convert the repository's asset collection (corrected TJU logos) into a polished static web
gallery where users can browse, filter, preview, and download every logo in PNG / SVG / PDF.
The original `README.md` tables remain as repository documentation; the website is the primary
end-user interface.

---

## 2. Repository layout

```
tju-vis/
├── images/
│   ├── fill/         # logos without clear-space (填充)
│   │   ├── png/
│   │   ├── svg/
│   │   └── pdf/
│   └── padding/      # logos with mandatory clear-space (独立区域)
│       ├── png/
│       ├── svg/
│       └── pdf/
├── official/         # reference materials (VI manuals, reference photos)
│   ├── main_building.jpg
│   ├── peiyang_university.jpg
│   ├── 天津大学标准校徽.jpg
│   ├── 校训.jpg
│   ├── 天津大学视觉形象识别手册_2011.pdf
│   ├── 天津大学视觉形象识别系统(TU VI)手册_2012.pdf
│   └── 配色方案.pdf
├── assets/           # SVG icons used in the old README (color swatches, badges)
├── scripts/
│   └── generate-manifest.mjs   # build-time manifest generator (run before dev/build)
├── src/
│   ├── data/
│   │   └── manifest.json       # AUTO-GENERATED — do not edit by hand
│   ├── components/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages CI/CD
```

**Golden rule:** `manifest.json` is always generated from the file tree. Never hand-edit it.
When you add, remove, or rename an asset, re-run `npm run generate-manifest`.

---

## 3. Filename convention & metadata model

All logo basenames follow the pattern:

```
tju_<element>_<color>[_<lang>][_<orientation>][_padding]
```

### 3.1 Token → attribute mapping

| Token in filename | Attribute | Chinese value |
|---|---|---|
| `badge` in element | `category` | 图形标志（校徽） |
| `text` in element | `category` | 字体标志（校标） |
| `shield_border` / `shield_fill` | `category` | 辅助图形（北洋盾） |
| *(bare `tju_<color>` or `tju_<color>_<lang>` or `tju_<color>_vert*`)* | `category` | 标准组合（校徽校标） |
| `white` | `color` | 北洋蓝/白（标准） |
| `blue` | `color` | 白/北洋蓝（反白） |
| `tp` | `color` | 北洋蓝/透明 |
| `black` | `color` | 黑/白 |
| `cn` | `lang` | 中文 |
| `en` | `lang` | 英文 |
| *(absent)* | `lang` | 中英文 |
| *(absent orientation)* | `orientation` | 横向 |
| `vert` on text logos | `orientation` | 纵向 |
| `vert_ht` | `orientation` | 横文纵排 |
| `vert_vt` | `orientation` | 纵文纵排 |
| `_padding` suffix | `layout` | 独立区域 |
| *(absent)* | `layout` | 填充 |

### 3.2 Manifest schema (`src/data/manifest.json`)

```ts
interface LogoEntry {
  id: string;           // basename without layout suffix, e.g. "tju_badge_white"
  name: string;         // Chinese display name, e.g. "图形标志（校徽）北洋蓝/白"
  category: string;     // 图形标志 | 字体标志 | 辅助图形 | 标准组合
  color: string;        // 北洋蓝/白 | 白/北洋蓝 | 北洋蓝/透明 | 黑/白
  lang: string;         // 中英文 | 中文 | 英文 | ""
  orientation: string;  // 横向 | 纵向 | 横文纵排 | 纵文纵排 | ""
  preview: string;      // relative path to the SVG for preview rendering
  layouts: {
    fill?: { png: string; svg: string; pdf: string };
    padding?: { png: string; svg: string; pdf: string };
  };
  tags: string[];       // union of category, color, lang, orientation, layout labels
}

interface Reference {
  name: string;         // Chinese display name
  path: string;         // relative path from repo root
  type: 'pdf' | 'jpg';
  sizeBytes: number;
}

interface Manifest {
  logos: LogoEntry[];
  references: Reference[];
}
```

---

## 4. Adding a new logo

1. Drop the files into `images/fill/{png,svg,pdf}/` and/or `images/padding/{png,svg,pdf}/`,
   following the naming convention in §3.
2. Run `npm run generate-manifest` (or let `npm run dev` / `npm run build` do it automatically).
3. If the new name introduces a token not yet handled by `scripts/generate-manifest.mjs`,
   add it to the token maps in that script. See the `OVERRIDES` table for irregular names.
4. Commit all changed files including the regenerated `src/data/manifest.json`.

---

## 5. Tech stack & scripts

| Command | What it does |
|---|---|
| `npm run generate-manifest` | Scan assets, write `src/data/manifest.json` |
| `npm run dev` | `generate-manifest` then Vite dev server on port 5173 |
| `npm run build` | `generate-manifest` then Vite production build → `dist/` |
| `npm run preview` | Preview production build locally |

**Dependencies:**
- **Vite 6** — bundler/dev server
- **React 19 + TypeScript** — UI framework
- **Tailwind CSS v4** — utility-first styling, `class` dark-mode strategy
- **Framer Motion** — animations (stagger grid, layout transitions, modal spring)
- **lucide-react** — icon set
- **clsx + tailwind-merge** — conditional class utilities
- **vite-plugin-static-copy** — copies `images/` and `official/` into `dist/` at build time

---

## 6. Design system rules

| Rule | Detail |
|---|---|
| **Primary color** | 北洋蓝 `#00468c`; Tailwind token `primary`. Never approximate with a different blue. |
| **Dark mode** | `class` strategy on `<html>`; toggled by `useTheme`; defaults to `prefers-color-scheme`. |
| **Animations** | Framer Motion only. No CSS `@keyframes` for UI motion. Always check `prefers-reduced-motion`. |
| **Icons** | `lucide-react` throughout. Do not add a second icon library. |
| **Font** | Inter for Latin; `PingFang SC, Microsoft YaHei, Noto Sans SC` for CJK (system stack). |
| **Language** | UI is Chinese only. Do not add English UI strings without a full i18n strategy. |
| **Checkerboard** | Transparent-background logos must be shown on a checkerboard pattern, not plain white. |
| **Logo preview** | Always render the SVG file via `<img>` (not inline) in cards; use inline SVG only in the Lightbox for the "copy SVG code" feature (fetched on demand). |

---

## 7. GitHub Pages constraint

`vite.config.ts` sets `base: '/tju-vis/'`. All absolute URL construction **must** use
`import.meta.env.BASE_URL` (via the `assetUrl()` helper in `src/lib/assetUrl.ts`).
Never hard-code `/images/` or `/official/` paths without the base prefix.

The GitHub Actions workflow at `.github/workflows/deploy.yml` runs on every push to `main`
and deploys `dist/` via `actions/deploy-pages`. The `generate-manifest` script runs as part
of the CI build step.

---

## 8. What this project is NOT

- Not an official TJU project. The site carries a non-affiliation disclaimer.
- Not a server — everything is a static file. No backend, no API.
- Not an image editor — do not modify the source asset files.
