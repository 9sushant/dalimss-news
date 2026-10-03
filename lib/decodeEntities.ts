/**
 * Decode common HTML entities to plain text.
 * The result is a string, not HTML. Render it as text so React can escape it.
 * Repeats until the string stops changing, so "&amp;#x27;" becomes an apostrophe.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  lt: "<",
  gt: ">",
  nbsp: "\u00a0",
  rsquo: "\u2019",
  lsquo: "\u2018",
  ldquo: "\u201c",
  rdquo: "\u201d",
  apos: "'",
};

const ENTITY_PATTERN =
  /&(?:#([0-9]{1,7})|#x([0-9a-f]{1,6})|([a-z][a-z0-9]*));/gi;

function characterFromCodePoint(code: number): string | undefined {
  if (!Number.isInteger(code) || code <= 0 || code > 0x10ffff) return undefined;
  if (code >= 0xd800 && code <= 0xdfff) return undefined;
  return String.fromCodePoint(code);
}

function decodeOnce(value: string): string {
  return value.replace(
    ENTITY_PATTERN,
    (match, decimal: string | undefined, hex: string | undefined, name: string | undefined) => {
      if (decimal) {
        return characterFromCodePoint(Number.parseInt(decimal, 10)) ?? match;
      }
      if (hex) {
        return characterFromCodePoint(Number.parseInt(hex, 16)) ?? match;
      }
      if (name) {
        return NAMED_ENTITIES[name.toLowerCase()] ?? match;
      }
      return match;
    }
  );
}

export function decodeEntities(value: string | null | undefined): string {
  if (!value) return "";
  if (!value.includes("&")) return value;

  let current = value;
  let previous = "";
  while (current !== previous) {
    previous = current;
    current = decodeOnce(current);
  }
  return current;
}
