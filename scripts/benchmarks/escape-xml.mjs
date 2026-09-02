/**
 * Makes a string safe to put inside an SVG text node. The versions and the
 * Node.js version are read from the manifest, which crosses a repository
 * boundary, and a `<` or `&` in one of them would otherwise be markup.
 */
export default function escapeXml (value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
