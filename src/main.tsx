import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PnpmTheme, useThemeController } from '@pnpm/design.pnpm-theme'
import { PnpmWebsite } from '@pnpm/website.pnpm-website'
import './main.css'

// The key Docusaurus kept the color mode under, so that returning visitors keep theirs.
const THEME_KEY = 'theme'

type ThemeMode = 'light' | 'dark'

// The mode picked with the toggle, or else the one of the operating system.
function initialTheme (): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function RememberTheme () {
  const { themeMode } = useThemeController()
  const initial = useRef(themeMode)
  useEffect(() => {
    // Only a mode picked with the toggle is kept, so that the site keeps
    // following the operating system until someone picks one.
    if (themeMode === initial.current) return
    initial.current = themeMode
    try {
      localStorage.setItem(THEME_KEY, themeMode)
    } catch {}
  }, [themeMode])
  return null
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <PnpmTheme initialTheme={initialTheme()}>
      <RememberTheme />
      <PnpmWebsite />
    </PnpmTheme>
  </BrowserRouter>
)
