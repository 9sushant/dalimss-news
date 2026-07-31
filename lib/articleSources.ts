export interface ArticleSource {
  label: string;
  url: string;
}

export function normalizeArticleSources(value: unknown): ArticleSource[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const label = "label" in item ? String(item.label).trim() : "";
      const url = "url" in item ? String(item.url).trim() : "";

      if (!label || !url) return null;

      try {
        const parsedUrl = new URL(url);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) return null;
      } catch {
        return null;
      }

      return { label, url };
    })
    .filter((source): source is ArticleSource => source !== null);
}

export function sourcesToEditorText(value: unknown): string {
  return normalizeArticleSources(value)
    .map(({ label, url }) => `${label} | ${url}`)
    .join("\n");
}

export function editorTextToSources(value: string): ArticleSource[] {
  return value
    .split("\n")
    .map((line) => {
      const separatorIndex = line.lastIndexOf("|");
      if (separatorIndex === -1) return null;

      return {
        label: line.slice(0, separatorIndex).trim(),
        url: line.slice(separatorIndex + 1).trim(),
      };
    })
    .filter(
      (source): source is ArticleSource =>
        source !== null && Boolean(source.label) && Boolean(source.url)
    );
}
