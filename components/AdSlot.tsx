import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdFormat = "auto" | "fluid" | "autorelaxed";

export interface AdSlotProps {
  slot: string | undefined;
  name: string;
  minHeight?: number;
  format?: AdFormat;
  layout?: "in-article";
  label?: string;
}

export default function AdSlot(props: AdSlotProps) {
  const {
    slot,
    name,
    minHeight = 280,
    format = "fluid",
    label = "Advertisement",
  } = props;
  // An omitted layout defaults to in-article. Passing layout={undefined}
  // (the below-article unit) leaves data-ad-layout unset.
  const layout = Object.prototype.hasOwnProperty.call(props, "layout")
    ? props.layout
    : "in-article";

  const asideRef = useRef<HTMLElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [active, setActive] = useState(false);
  const pushedSlot = useRef<string | null>(null);

  useEffect(() => {
    if (!slot) return;
    const target = asideRef.current;
    if (!target) return;

    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [slot]);

  useEffect(() => {
    if (!active || !slot) return;
    const ins = insRef.current;
    const aside = asideRef.current;
    if (!ins || !aside) return;

    if (pushedSlot.current !== slot) {
      pushedSlot.current = slot;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense can throw when the script is blocked or the unit is rejected.
      }
    }

    const hideIfUnfilled = () => {
      if (ins.getAttribute("data-ad-status") === "unfilled") {
        aside.style.display = "none";
      }
    };

    hideIfUnfilled();
    const observer = new MutationObserver(hideIfUnfilled);
    observer.observe(ins, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });
    return () => observer.disconnect();
  }, [active, slot]);

  if (!slot) return null;

  return (
    <aside
      ref={asideRef}
      aria-label={label}
      data-ad-name={name}
      className="my-8 clear-both"
      style={{ minHeight: minHeight + 28 }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: "11px",
          lineHeight: "28px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ minHeight }}>
        {active ? (
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-client="ca-pub-7477796529453554"
            data-ad-slot={slot}
            data-ad-format={format}
            {...(layout ? { "data-ad-layout": layout } : {})}
            {...(format === "auto"
              ? { "data-full-width-responsive": "true" }
              : {})}
          />
        ) : null}
      </div>
    </aside>
  );
}
