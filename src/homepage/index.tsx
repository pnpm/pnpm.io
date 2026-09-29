// Stands in for @pnpm/website.pages.homepage (see `resolve.alias` in
// vite.config.mjs). PnpmWebsite renders the homepage with only its locale and
// translations, so the component falls back to the content it bundles, which
// isn't kept up to date. This passes it the content kept in this repository
// instead: the sponsors of sponsors.json, the testimonials, the OSS projects and
// the star count of pnpm/pnpm. Drop it once PnpmWebsite takes this content.
import { useEffect, useState } from 'react'
import { Homepage as PackageHomepage } from '@pnpm/website.pages.homepage/dist/index.js'
import type { HomepageProps } from '@pnpm/website.pages.homepage/dist/index.js'
import { features, hero, ossProjects, sponsors, testimonials } from './content.js'

export * from '@pnpm/website.pages.homepage/dist/index.js'

function useGithubStarsCount () {
  const [count, setCount] = useState<number | string>('33.4K')
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
