import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GROUPS, liveToolsInGroup } from "@/lib/tools";
import { toolIcon } from "./site/toolIcons";

/**
 * Homepage directory: H3 per theme group, H4 per tool tile (homepage-strategy.md).
 * Only published tools are listed – groups without live tools are omitted.
 */
export default function ToolDirectory() {
  const groups = GROUPS.map((g) => ({ ...g, tools: liveToolsInGroup(g.id) })).filter((g) => g.tools.length > 0);
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <div key={g.id} id={`gruppe-${g.id}`}>
          <h3 className="text-lg font-bold text-zinc-950">{g.homeHeading}</h3>
          <div className="mt-3 grid grid-cols-1 gap-x-8 border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            {g.tools.map((t) => {
              const Icon = toolIcon(t.id, t.group);
              return (
                <Link
                  key={t.id}
                  href={t.path}
                  className="group flex items-start gap-3 border-b border-zinc-200 py-4"
                >
                  <span className="mt-0.5 shrink-0 text-lime-700">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="flex items-center justify-between gap-2 text-base font-semibold text-zinc-950 group-hover:text-lime-800">
                      {t.name}
                      <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:text-lime-700" />
                    </h4>
                    <p className="mt-1 text-sm leading-snug text-zinc-600">{t.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
