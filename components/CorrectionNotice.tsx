import { formatDateIST } from "@/lib/seo";

export interface ArticleCorrection {
  id?: string | number;
  date?: string | null;
  note?: string | null;
  text?: string | null;
}

/**
 * Renders a corrections list when a future `corrections` field is present.
 * With no field and no schema change, this renders nothing.
 */
export function CorrectionNotice({
  corrections,
}: {
  corrections?: ArticleCorrection[] | null;
}) {
  const items = (corrections || []).flatMap((correction, index) => {
    const note = (correction.note || correction.text || "").trim();
    if (!note) return [];
    const when = correction.date
      ? formatDateIST(correction.date, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";
    return [{ key: correction.id ?? index, when, note }];
  });

  if (items.length === 0) return null;

  return (
    <aside
      className="my-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      aria-label="Corrections"
    >
      <p className="mb-2 font-semibold">Corrections</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key}>
            {item.when ? `${item.when}: ` : ""}
            {item.note}
          </li>
        ))}
      </ul>
    </aside>
  );
}
