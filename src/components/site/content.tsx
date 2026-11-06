import { Check, Info, AlertTriangle } from "lucide-react";

/**
 * Building blocks for page copy inside <article className="content">.
 * Plain <h2>/<h3>/<h4>/<p>/<ul>/<table> are styled by `.content` in globals.css.
 */

export function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="not-content my-8 grid list-none gap-x-8 gap-y-6 p-0 sm:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.title} className="border-t-2 border-lime-700 pt-4">
          <span className="font-mono text-sm font-semibold text-lime-800">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-zinc-950">{s.title}</h3>
          <div className="mt-1.5 text-sm leading-relaxed text-zinc-700">{s.body}</div>
        </li>
      ))}
    </ol>
  );
}

export function TrustList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="not-content my-6 grid list-none gap-x-8 gap-y-2.5 p-0 sm:grid-cols-2">
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
    <div className="not-content my-6 flex gap-3 border-l-2 border-lime-700 py-1 pl-4 text-sm leading-relaxed text-zinc-700">
      <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lime-700" />
      <div>{children}</div>
    </div>
  );
}
