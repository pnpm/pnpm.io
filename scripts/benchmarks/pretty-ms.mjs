// The `pretty-ms` formatting the benchmark page has always used, as much of it
// as a duration under an hour needs. It lives here rather than in
// `package.json` because the sync script runs on a bare Node.js in CI, with
// the site's dependencies deliberately not installed.
//
// Sub-second durations are reported whole, in milliseconds; anything longer is
// reported in seconds with one decimal, truncated rather than rounded, and a
// trailing `.0` dropped — so 1051ms reads as `1s`, not `1.1s`.
//
// The seconds are taken from the integer remainder rather than from
// `ms / 1000 % 60`, which is where `pretty-ms` itself gets them. That
// expression is inexact above a minute — 62400 comes back as 2.3999999999999986
// — and truncating it publishes `1m 2.3s` for a duration of 62.4 seconds. No
// number on the page crosses a minute today, so this changes nothing that is
// currently published; it is simply not worth reproducing a rounding bug in
// order to match a dependency we no longer have.
export default function prettyMs (milliseconds) {
  if (milliseconds < 1000) {
    return `${Math.trunc(milliseconds)}ms`
  }

  const parts = []
  const minutes = Math.trunc(milliseconds / 60000)
  if (minutes > 0) parts.push(`${minutes}m`)

  const seconds = (milliseconds % 60000) / 1000
  // Truncated to one decimal: a number the benchmark measured should never be
  // rounded up into a faster-looking neighbour's territory.
  const truncated = (Math.floor(seconds * 10 + Number.EPSILON) / 10).toFixed(1)
  const secondsString = truncated.replace(/\.0+$/, '')
  if (secondsString !== '0') parts.push(`${secondsString}s`)

  return parts.length > 0 ? parts.join(' ') : '0ms'
}
