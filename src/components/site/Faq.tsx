import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/seo";

/**
 * Server-rendered FAQ. Every answer is in the HTML (native <details>), and the
 * same array feeds the FAQPage JSON-LD, so schema text always equals visible text.
 */
export default function Faq({
  title,
  items,
  headingLevel = 3,
}: {
  title: string;
  items: FaqItem[];
  /** Heading level for questions (H3 under the FAQ H2 by default). */
  headingLevel?: 3 | 4;
}) {
  const Q = `h${headingLevel}` as "h3" | "h4";
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24">
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {items.map((item, i) => (
          <details key={item.q} className="group" open={i === 0}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
              <Q className="text-base font-semibold text-zinc-900">{item.q}</Q>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-transform group-open:rotate-180 group-open:bg-lime-50 group-open:text-lime-800">
                <ChevronDown aria-hidden className="h-4 w-4" />
              </span>
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-relaxed text-zinc-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
