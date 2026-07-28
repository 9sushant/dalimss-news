export function xmlEscape(value: string | null | undefined): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function cdata(value: string | null | undefined): string {
  return `<![CDATA[${String(value || "").replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}
