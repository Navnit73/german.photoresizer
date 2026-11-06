import type { Metadata } from "next";
import Link from "next/link";
import { LIVE_TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: { absolute: "Seite nicht gefunden" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="flex-1 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-sm font-semibold text-lime-800">Fehler 404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Diese Seite gibt es nicht</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-700">
          Vielleicht hat sich die Adresse geändert. Hier finden Sie alle verfügbaren Foto-Tools:
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {LIVE_TOOLS.map((t) => (
            <li key={t.id}>
              <Link href={t.path} className="flex min-h-12 items-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-900 hover:border-lime-700 hover:text-lime-800">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-lime-700 px-5 text-sm font-semibold text-white hover:bg-lime-800">
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
