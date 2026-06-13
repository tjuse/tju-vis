import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Apply theme before first paint to avoid flash
const stored = localStorage.getItem('tju-vis-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (stored === 'dark' || (!stored && prefersDark)) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
