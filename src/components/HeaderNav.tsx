"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ShieldCheck } from "lucide-react";

export interface NavGroup {
  label: string;
  tools: { name: string; path: string }[];
}

export default function HeaderNav({ groups }: { groups: NavGroup[] }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on navigation – adjusting state during render instead of an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setToolsOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!toolsOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setToolsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setToolsOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkCls = "rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950";

  return (
    <>
      <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 md:flex">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            aria-expanded={toolsOpen}
            aria-controls="tools-menu"
            onClick={() => setToolsOpen((v) => !v)}
            className={`${linkCls} inline-flex items-center gap-1`}
          >
            Foto-Tools
            <ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
          </button>
          {toolsOpen && (
            <div
              id="tools-menu"
              className="absolute right-0 top-full mt-2 grid w-[min(92vw,640px)] grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl"
            >
              {groups.map((g) => (
                <div key={g.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{g.label}</p>
                  <ul className="mt-2 space-y-0.5">
                    {g.tools.map((t) => (
                      <li key={t.path}>
                        <Link
                          href={t.path}
                          aria-current={pathname === t.path ? "page" : undefined}
                          className="block rounded-lg px-2 py-1.5 text-sm text-zinc-800 hover:bg-lime-50 hover:text-lime-900 aria-[current=page]:font-semibold aria-[current=page]:text-lime-800"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link href="/#tools" className="col-span-2 border-t border-zinc-100 pt-3 text-sm font-semibold text-lime-800 hover:underline">
                Alle Foto-Tools ansehen →
              </Link>
            </div>
          )}
        </div>
        <Link href="/#editor" className={linkCls}>
          Foto-Editor
        </Link>
        <Link href="/#anleitung" className={linkCls}>
          So funktioniert&apos;s
        </Link>
        <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-lime-700/20 bg-lime-50 px-3 py-1 text-xs font-semibold text-lime-900 lg:inline-flex">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-lime-700" />
          Verarbeitung im Browser
        </span>
      </nav>

      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-800 md:hidden"
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-zinc-200 bg-white px-4 pb-10 pt-4 md:hidden">
          <nav aria-label="Mobile Navigation">
            <Link href="/#editor" className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-zinc-900 hover:bg-zinc-100">
              Foto-Editor
            </Link>
            {groups.map((g) => (
              <div key={g.label} className="mt-4">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">{g.label}</p>
                <ul className="mt-1">
                  {g.tools.map((t) => (
                    <li key={t.path}>
                      <Link
                        href={t.path}
                        aria-current={pathname === t.path ? "page" : undefined}
                        className="flex min-h-12 items-center rounded-xl px-3 text-base text-zinc-800 hover:bg-lime-50 aria-[current=page]:font-semibold aria-[current=page]:text-lime-800"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-6 border-t border-zinc-200 pt-4">
              <Link href="/#tools" className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-lime-800">
                Alle Foto-Tools
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
