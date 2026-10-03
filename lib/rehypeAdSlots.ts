type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, string>;
  children?: HastNode[];
};

type HastRoot = {
  type?: string;
  children?: HastNode[];
};

/**
 * Insert <ad-slot> markers after selected top-level paragraphs.
 * Only direct children of the root are counted, so paragraphs nested in
 * lists, quotes, or other blocks do not move the slot positions.
 */
export function rehypeAdSlots(options: {
  after: number[];
  minTail?: number;
  minParagraphs?: number;
}) {
  const minTail = options.minTail ?? 2;
  const minParagraphs = options.minParagraphs ?? 5;
  const after = options.after;

  return function rehypeAdSlotsPlugin() {
    return function transformer(tree: HastRoot) {
      const children = tree.children;
      if (!Array.isArray(children)) return;

      const paragraphIndexes: number[] = [];
      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (node.type === "element" && node.tagName === "p") {
          paragraphIndexes.push(i);
        }
      }

      if (paragraphIndexes.length < minParagraphs) return;

      const insertions: { at: number; slotNo: number }[] = [];
      let slotNo = 0;
      for (const n of after) {
        if (!Number.isInteger(n) || n < 1 || n > paragraphIndexes.length) continue;
        if (paragraphIndexes.length - n < minTail) continue;
        slotNo += 1;
        insertions.push({ at: paragraphIndexes[n - 1] + 1, slotNo });
      }

      insertions.sort((a, b) => b.at - a.at || b.slotNo - a.slotNo);
      for (const insertion of insertions) {
        children.splice(insertion.at, 0, {
          type: "element",
          tagName: "ad-slot",
          properties: { index: String(insertion.slotNo) },
          children: [],
        });
      }
    };
  };
}
