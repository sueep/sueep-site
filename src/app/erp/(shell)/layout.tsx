import Link from "next/link";
import { ErpLogoutButton } from "./ErpLogoutButton";

/** Neon cold start / Prisma can exceed default on first request after idle. */
export const maxDuration = 60;

const nav = [
  { href: "/erp", label: "Dashboard" },
  { href: "/erp/projects", label: "Projects" },
  { href: "/erp/projects/new", label: "New project" },
];

export default function ErpShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 p-4">
          <Link href="/erp" className="text-lg font-bold tracking-tight text-pink-400">
            Sueep ERP
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">Internal</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-3">
          <ErpLogoutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
