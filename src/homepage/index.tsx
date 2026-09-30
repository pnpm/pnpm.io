// Stands in for @pnpm/website.pages.homepage (see `resolve.alias` in
// vite.config.mjs). PnpmWebsite renders the homepage with only its locale and
// translations, so the component falls back to the content it bundles, which
// isn't kept up to date. This passes it the content kept in this repository
// instead: the sponsors of sponsors.json, the testimonials, the OSS projects,
// the star count of pnpm/pnpm, and the translated hero and feature cards.
// A section passed here replaces the package's content for it completely, so
// content.tsx has to set every option the section should show (the feature
// visuals, the hero's announcement). The sections this repository has no
// content for (speed highlights, how it works, comparison, release highlights,
// zero bugs, the closing call to action) are left to the package. Drop this
// once PnpmWebsite takes this content.
import { useEffect, useState } from 'react'
import { Homepage as PackageHomepage } from '@pnpm/website.pages.homepage/dist/index.js'
import type { HomepageProps } from '@pnpm/website.pages.homepage/dist/index.js'
import { features, hero, ossProjects, sponsors, testimonials } from './content.js'

export * from '@pnpm/website.pages.homepage/dist/index.js'

function useGithubStarsCount () {
  const [count, setCount] = useState<number>(33400)
  useEffect(() => {
    fetch('https://api.github.com/repos/pnpm/pnpm')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === 'number') setCount(data.stargazers_count)
      })
      .catch(() => {})
  }, [])
  return count
}

export function Homepage ({ messages = {}, basePath = '', ...props }: HomepageProps) {
  const t = (text: string) => messages[text] || text
  const starsCount = useGithubStarsCount()
  return (
    <PackageHomepage
      hero={hero(t, basePath, starsCount)}
      features={features(t, basePath)}
      sponsors={sponsors(t)}
      testimonials={testimonials}
      ossProjects={ossProjects(t)}
      {...props}
      messages={messages}
      basePath={basePath}
    />
  )
}
