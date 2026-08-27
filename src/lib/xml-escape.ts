// Minimal, generic XML text escaping — used by the couple of routes that
// hand-build an XML document for their own page's data.
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
