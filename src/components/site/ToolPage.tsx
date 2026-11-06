import Link from "next/link";
import { Upload } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import Faq from "./Faq";
import JsonLd from "./JsonLd";
import RelatedTools from "./RelatedTools";
import { getTool } from "@/lib/tools";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  toolCrumbs,
  webApplicationSchema,
  type FaqItem,
} from "@/lib/seo";

/**
 * Layout for every tool page (CLAUDE.md §3.3):
 * H1 + widget above the fold → content sections (children) → FAQ → related tools → CTA.
 */
export default function ToolPage({
  toolId,
  h1,
  lead,
  widget,
  appName,
  description,
  faqTitle,
  faqs,
  related,
  children,
}: {
  toolId: string;
  h1: string;
  /** One sentence value proposition containing the primary keyword. */
  lead: React.ReactNode;
  widget: React.ReactNode;
  /** WebApplication schema name (German). */
  appName: string;
  /** Meta description – reused for the WebApplication schema. */
  description: string;
  faqTitle: string;
  faqs: FaqItem[];
  /** Related tool ids from page-plans.md (unpublished ones are hidden). */
  related: string[];
  children: React.ReactNode;
}) {
  const tool = getTool(toolId);
  const crumbs = toolCrumbs(tool);
  return (
    <main id="main" className="flex-1 bg-white">
      <JsonLd
        data={graph(
          webApplicationSchema(appName, tool.path, description),
          breadcrumbSchema(crumbs),
          faqSchema(faqs, tool.path),
        )}
      />

      {/* Above the fold: breadcrumb, H1, value proposition, tool */}
      <section className="border-b border-zinc-200 bg-zinc-50/80">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="mt-3 text-[1.7rem] font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
            {h1}
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-zinc-700 sm:text-base">{lead}</p>
          <div id="tool" className="mt-5 scroll-mt-24">
            {widget}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="content">{children}</article>
      </div>

      <div className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Faq title={faqTitle} items={faqs} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <RelatedTools ids={related} />

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl bg-zinc-950 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-lg font-bold text-white">{tool.name} – direkt loslegen</p>
            <p className="mt-1 text-sm text-zinc-300">Kostenlos, ohne Anmeldung, Verarbeitung lokal in Ihrem Browser.</p>
          </div>
          <Link
            href="#tool"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-lime-600 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-lime-500"
          >
            <Upload aria-hidden className="h-4 w-4" />
            Jetzt Bild hochladen
          </Link>
        </div>
      </div>
    </main>
  );
}
