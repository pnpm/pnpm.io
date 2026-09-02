// Characters XML 1.0 forbids in text altogether: no entity can carry them, so
// escaping can't help and the only honest outcome is a refused render.
const FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/

/**
 * Makes a string safe to put inside an SVG text node. The versions and the
 * Node.js version are read from the manifest, which crosses a repository
 * boundary, and a `<` or `&` in one of them would otherwise be markup.
 */
export default function escapeXml (value) {
  const text = String(value)
  const forbidden = text.match(FORBIDDEN)
  if (forbidden) {
    const codePoint = forbidden[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')
    throw new Error(`${JSON.stringify(text)} contains U+${codePoint}, which XML text cannot carry.`)
  }
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
