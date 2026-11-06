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
      <div className="mt-6 grid grid-cols-1 gap-x-8 border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => {
          const Icon = toolIcon(t.id, t.group);
          return (
            <Link
              key={t.id}
              href={t.path}
              className="group flex gap-3 border-b border-zinc-200 py-4"
            >
              <span className="mt-0.5 shrink-0 text-lime-700">
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
          className="group flex min-h-12 items-center gap-2 border-b border-zinc-200 py-4 text-sm font-semibold text-lime-800 hover:text-lime-900"
        >
          Alle Foto-Tools
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
