import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { liveTools } from "@/lib/tools";
import { toolIcon } from "./toolIcons";

/**
 * "Weitere passende Foto-Tools" block. Pass the full related list from
 * page-plans.md / internal-linking.md – unpublished pages are filtered out and
 * appear automatically once they go live.
 */
export default function RelatedTools({ ids, max = 6 }: { ids: string[]; max?: number }) {
  const tools = liveTools(ids).slice(0, max);
  return (
    <section aria-labelledby="related-heading" className="scroll-mt-24">
      <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
        Weitere passende Foto-Tools
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => {
          const Icon = toolIcon(t.id, t.group);
          return (
            <Link
              key={t.id}
              href={t.path}
              className="group flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-lime-700/60 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-50 text-lime-800">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-zinc-950 group-hover:text-lime-800">{t.name}</h3>
                <p className="mt-1 text-sm leading-snug text-zinc-600">{t.desc}</p>
              </div>
            </Link>
          );
        })}
        <Link
          href="/#tools"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm font-semibold text-zinc-800 transition-colors hover:border-lime-700 hover:text-lime-800"
        >
          Alle Foto-Tools
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
