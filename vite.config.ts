import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'

// BASE_PATH env var lets CI override the base (default: /).
// With a custom domain (vis.tjuse.com) no prefix is needed.
// Set BASE_PATH=/tju-vis/ only if deploying without a custom domain.
const base = process.env.BASE_PATH ?? '/'

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
