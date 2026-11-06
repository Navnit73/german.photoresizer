import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { GROUPS, liveToolsInGroup } from "@/lib/tools";
import { SITE_NAME } from "@/lib/site";
import HeaderNav, { type NavGroup } from "./HeaderNav";

export default function Header() {
  // Only published pages appear in navigation.
  const groups: NavGroup[] = GROUPS.map((g) => ({
    label: g.label,
    tools: liveToolsInGroup(g.id).map((t) => ({ name: t.name, path: t.path })),
  })).filter((g) => g.tools.length > 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow"
      >
        Zum Inhalt springen
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${SITE_NAME} – Startseite`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-700 text-white shadow-sm transition-transform group-hover:scale-105">
            <ImageIcon aria-hidden className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-zinc-950">
              Foto<span className="text-lime-700">Werkzeuge</span>
            </span>
            <span className="mt-1 hidden text-[11px] font-medium text-zinc-600 sm:block">
              Kostenlose Foto-Tools im Browser
            </span>
          </span>
        </Link>
        <HeaderNav groups={groups} />
      </div>
    </header>
  );
}
