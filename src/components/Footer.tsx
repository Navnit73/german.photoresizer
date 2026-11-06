import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { GROUPS, liveToolsInGroup } from "@/lib/tools";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  // Only published pages are linked (see CLAUDE.md §3.8).
  const columns = GROUPS.map((g) => ({ label: g.label, tools: liveToolsInGroup(g.id) })).filter((c) => c.tools.length > 0);
  const year = 2026;

  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-700 text-white">
                <ImageIcon aria-hidden className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold tracking-tight text-zinc-950">
                Foto<span className="text-lime-700">Werkzeuge</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600">
              Kostenlose Foto-Tools für den Browser: Bilder verkleinern, komprimieren, zuschneiden, freistellen und
              umwandeln – ohne Anmeldung und ohne Installation. Ihre Bilder werden auf Ihrem Gerät verarbeitet.
            </p>
            <p className="mt-3 text-xs text-zinc-600">Für Deutschland, Österreich und die Schweiz.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.label}>
                <p className="text-sm font-semibold text-zinc-900">{c.label}</p>
                <ul className="mt-2">
                  {c.tools.map((t) => (
                    <li key={t.path}>
                      <Link href={t.path} className="inline-flex min-h-10 items-center text-sm text-zinc-600 hover:text-lime-800">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-sm font-semibold text-zinc-900">Über das Projekt</p>
              <ul className="mt-2">
                <li>
                  <Link href="/ueber-uns/" className="inline-flex min-h-10 items-center text-sm text-zinc-600 hover:text-lime-800">
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link href="/impressum/" className="inline-flex min-h-10 items-center text-sm text-zinc-600 hover:text-lime-800">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz/" className="inline-flex min-h-10 items-center text-sm text-zinc-600 hover:text-lime-800">
                    Datenschutzerklärung
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}
          </p>
          <p>Bildverarbeitung lokal im Browser · Keine Cookies für Tracking</p>
        </div>
      </div>
    </footer>
  );
}
