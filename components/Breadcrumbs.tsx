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
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1"
      >
        {fullItems.map((item, index) => (
          <span key={item.href} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-gray-300 mx-1" aria-hidden="true">
                ›
              </span>
            )}
            {index === fullItems.length - 1 ? (
              <span className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-red-600 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
