import { Check, Info, AlertTriangle } from "lucide-react";

/**
 * Building blocks for page copy inside <article className="content">.
 * Plain <h2>/<h3>/<h4>/<p>/<ul>/<table> are styled by `.content` in globals.css.
 */

export function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="not-content my-6 grid list-none gap-3 p-0 sm:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-700 text-sm font-bold text-white">
            {i + 1}
          </span>
          <h3 className="mt-3 text-base font-semibold leading-snug text-zinc-950">{s.title}</h3>
          <div className="mt-1.5 text-sm leading-relaxed text-zinc-700">{s.body}</div>
        </li>
      ))}
    </ol>
  );
}

export function TrustList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="not-content my-6 grid list-none gap-2 rounded-2xl border border-lime-700/20 bg-lime-50/60 p-5 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-snug text-zinc-800">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lime-700" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const Icon = tone === "warn" ? AlertTriangle : Info;
  return (
    <div className="not-content my-6 flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
      <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lime-700" />
      <div>{children}</div>
    </div>
  );
}
