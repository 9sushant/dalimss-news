// components/Breadcrumbs.tsx
// Visual breadcrumb trail + BreadcrumbList JSON-LD structured data

import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  navLabel?: string;
}

export function Breadcrumbs({
  items,
  homeLabel = "Home",
  navLabel = "Breadcrumb",
}: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: homeLabel, href: "/" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label={navLabel}
        className="mb-4 flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap text-sm text-gray-500"
      >
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;
          return (
            <span
              key={`${item.href}-${index}`}
              className={`inline-flex items-center gap-1 ${isLast ? "min-w-0" : "shrink-0"}`}
            >
              {index > 0 && (
                <span className="mx-0.5 shrink-0 text-gray-300" aria-hidden="true">
                  ›
                </span>
              )}
              {isLast ? (
                <span className="truncate font-medium text-gray-700">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-red-700 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
