import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/seo";

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Brotkrümelnavigation" className="text-xs text-zinc-600">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="font-medium text-zinc-800">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="rounded px-0.5 py-1 hover:text-lime-800 hover:underline">
                    {c.name}
                  </Link>
                  <ChevronRight aria-hidden className="h-3 w-3 text-zinc-400" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
