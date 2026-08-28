// The `pretty-ms` formatting the benchmark page has always used, as much of it
// as a duration under an hour needs. It lives here rather than in
// `package.json` because the sync script runs on a bare Node.js in CI, with
// the site's dependencies deliberately not installed.
//
// Sub-second durations are reported whole, in milliseconds; anything longer is
// reported in seconds with one decimal, truncated rather than rounded, and a
// trailing `.0` dropped — so 1051ms reads as `1s`, not `1.1s`.
export default function prettyMs (milliseconds) {
  if (milliseconds < 1000) {
    return `${Math.trunc(milliseconds)}ms`
  }

  const parts = []
  const minutes = Math.trunc(milliseconds / 60000)
  if (minutes > 0) parts.push(`${minutes}m`)

  const seconds = (milliseconds / 1000) % 60
  // Truncated to one decimal: a number the benchmark measured should never be
  // rounded up into a faster-looking neighbour's territory.
  const truncated = (Math.floor(seconds * 10 + Number.EPSILON) / 10).toFixed(1)
  const secondsString = truncated.replace(/\.0+$/, '')
  if (secondsString !== '0') parts.push(`${secondsString}s`)

  return parts.length > 0 ? parts.join(' ') : '0ms'
}
