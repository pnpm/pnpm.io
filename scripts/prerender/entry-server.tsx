// Server-side rendering of the pages the docs plugin doesn't pre-render: the
// homepage and /benchmarks. scripts/postbuild.mjs bundles this file and puts
// the markup into their HTML files, for search engines and a first paint; the
// app then renders over it in the browser.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { PnpmTheme } from '@pnpm/design.pnpm-theme'
import { Homepage } from '../../src/homepage/index.js'
import { BenchmarksPage } from '@pnpm/website.pages.benchmarks-page'

type PageProps =
  | { page: 'home', basePath: string, messages?: Record<string, string> }
  | { page: 'benchmarks', data?: unknown }

export function render (location: string, props: PageProps): string {
  return renderToString(
    <StaticRouter location={location}>
      <PnpmTheme>
        {props.page === 'home'
          ? <Homepage basePath={props.basePath} messages={props.messages} />
          : <BenchmarksPage data={props.data as never} />}
      </PnpmTheme>
    </StaticRouter>
  )
}
