import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ErpDashboardPage() {
  let projectCount: number;
  let commercialCount: number;
  let residentialCount: number;
  let laborCount: number;
  let activeCount: number;

  try {
    [projectCount, commercialCount, residentialCount, laborCount, activeCount] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { segment: "COMMERCIAL" } }),
      prisma.project.count({ where: { segment: "RESIDENTIAL" } }),
      prisma.laborEntry.count(),
      prisma.project.count({ where: { status: "ACTIVE" } }),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return (
      <div className="space-y-4 rounded-lg border border-red-900/60 bg-red-950/40 p-6 text-sm text-red-100">
        <h1 className="text-lg font-semibold text-white">ERP database unavailable</h1>
        <p className="text-red-200/90">
          The dashboard could not reach PostgreSQL. On Vercel, set <code className="text-red-50">DATABASE_URL</code> to a
          hosted database (e.g. Neon), run <code className="text-red-50">prisma migrate deploy</code> on deploy (already
          in <code className="text-red-50">npm run build</code>), then redeploy.
        </p>
        <p className="text-xs text-red-300/80">Details: {msg}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Internal ERP — projects, labor, and cost baselines.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active projects", value: activeCount },
          { label: "All projects", value: projectCount },
          { label: "Labor entries", value: laborCount },
          { label: "Commercial / Residential", value: `${commercialCount} / ${residentialCount}` },
        ].map((card) => (
          <div key={card.label} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-400">
        <p className="font-medium text-zinc-300">Next steps for the product</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
          <li>Add invoicing line items, materials receipts, and Gantt-style milestones.</li>
          <li>Production uses PostgreSQL via <code className="text-zinc-500">DATABASE_URL</code> (e.g. Neon).</li>
          <li>Point DNS <code className="text-pink-400">app.sueep.com</code> at this deployment — middleware rewrites to{" "}
            <code className="text-zinc-500">/erp</code>.</li>
        </ul>
        <Link href="/erp/projects" className="mt-4 inline-block text-sm font-medium text-pink-400 hover:underline">
          Go to projects →
        </Link>
      </div>
    </div>
  );
}
