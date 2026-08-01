import { useEffect } from 'react'

/**
 * The settings reference used to be a single page, so deep links such as
 * https://pnpm.io/settings#hoistpattern are printed by pnpm itself and linked
 * from blog posts, issues and third-party articles. A URL fragment never
 * reaches the server, so those links cannot be redirected by the hosting
 * provider — they have to be resolved in the browser.
 *
 * The index of the settings page lists every setting and links it to the page
 * that documents it now, so the rendered index *is* the redirect map. Looking
 * the anchor up in the DOM keeps the map from ever going stale: a setting that
 * is missing here is a setting missing from the index, which is visible.
 */
export default function SettingsAnchorRedirect () {
  useEffect(() => {
    function redirect () {
      const hash = window.location.hash.slice(1)
      if (!hash) return

      // Section anchors (`#store-settings`) still exist on this page. Let the
      // browser scroll to them instead of redirecting.
      if (document.getElementById(hash) != null) return

      const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(hash) : hash
      const links = document.querySelectorAll(`a[href$="#${escaped}"]`)
      for (const link of links) {
        if (link.pathname !== window.location.pathname) {
          window.location.replace(link.href)
          return
        }
      }
    }

    // The page stays mounted when only the fragment changes, so an old link
    // followed from within the site needs the listener as well.
    redirect()
    window.addEventListener('hashchange', redirect)
    return () => window.removeEventListener('hashchange', redirect)
  }, [])

  return null
}
