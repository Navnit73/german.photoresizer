"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

export interface SearchTool {
  name: string;
  path: string;
  desc: string;
  keywords: string;
}

/** "Was möchten Sie tun?" combobox – lists published tools only. */
export default function ToolSearch({ tools }: { tools: SearchTool[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const id = useId();

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return tools.slice(0, 6);
    const terms = n.split(/\s+/);
    return tools.filter((t) => terms.every((term) => `${t.name} ${t.desc} ${t.keywords}`.toLowerCase().includes(term)));
  }, [q, tools]);

  return (
    <div className="relative mx-auto w-full max-w-xl text-left">
      <label htmlFor={id} className="sr-only">
        Was möchten Sie tun?
      </label>
      <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Was möchten Sie tun? z. B. „HEIC“"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(results.length - 1, a + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            router.push(results[active].path);
          } else if (e.key === "Escape") setOpen(false);
        }}
        className="h-14 w-full rounded-xl border border-zinc-300 bg-white pl-12 pr-4 text-base text-zinc-900 placeholder:text-zinc-500 focus:border-lime-700 focus:outline-none"
      />
      {open && (
        <ul id={`${id}-list`} role="listbox" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-zinc-600">Kein passendes Tool gefunden.</li>
          ) : (
            results.map((t, i) => (
              <li key={t.path} role="option" aria-selected={i === active}>
                <Link
                  href={t.path}
                  onMouseEnter={() => setActive(i)}
                  className={`block px-4 py-2.5 ${i === active ? "bg-lime-50" : ""}`}
                >
                  <span className="block text-sm font-semibold text-zinc-950">{t.name}</span>
                  <span className="block text-xs text-zinc-600">{t.desc}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
