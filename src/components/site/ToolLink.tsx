import Link from "next/link";
import { getTool } from "@/lib/tools";

/**
 * In-text link to another tool page. Renders a real link only when the target
 * page is live; otherwise the anchor text is rendered as plain text. When the
 * target goes live (`live: true` in src/lib/tools.ts) the link appears
 * automatically – this is the internal-link backfill mechanism.
 */
export default function ToolLink({ id, children }: { id: string; children?: React.ReactNode }) {
  const tool = getTool(id);
  const label = children ?? tool.name;
  if (!tool.live) return <>{label}</>;
  return (
    <Link href={tool.path} className="font-medium text-lime-800 underline decoration-lime-700/40 underline-offset-2 hover:decoration-lime-700">
      {label}
    </Link>
  );
}
