import Link from "next/link";
import { listingPath } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  pathname: string;
  labels?: {
    summary?: string;
    previous?: string;
    next?: string;
    nav?: string;
  };
}

export function Pagination({
  page,
  totalPages,
  pathname,
  labels,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const summary = labels?.summary || `Page ${page} of ${totalPages}`;
  const previousLabel = labels?.previous || "Previous";
  const nextLabel = labels?.next || "Next";

  return (
    <nav aria-label={labels?.nav || "Pagination"} className="mt-10">
      <p className="mb-3 text-sm text-gray-500">{summary}</p>
      <div className="flex flex-wrap items-center gap-2">
        {page > 1 && (
          <Link
            href={listingPath(pathname, page - 1)}
            rel="prev"
            className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600"
          >
            {previousLabel}
          </Link>
        )}
        {pages.map((number) => (
          <Link
            key={number}
            href={listingPath(pathname, number)}
            aria-current={number === page ? "page" : undefined}
            className={
              number === page
                ? "rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                : "rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600"
            }
          >
            {number}
          </Link>
        ))}
        {page < totalPages && (
          <Link
            href={listingPath(pathname, page + 1)}
            rel="next"
            className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600"
          >
            {nextLabel}
          </Link>
        )}
      </div>
    </nav>
  );
}
