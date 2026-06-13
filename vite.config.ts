import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'

// Use /tju-vis/ base when deploying to GitHub Pages (CI sets GITHUB_ACTIONS=true)
// In local dev, use / so that root-relative image paths resolve correctly
const base = process.env.GITHUB_ACTIONS ? '/tju-vis/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'images', dest: '.' },
        { src: 'official', dest: '.' },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
