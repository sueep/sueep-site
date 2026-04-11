import { ErpLoginForm } from "./ErpLoginForm";

const MARKETING_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://sueep.com";

export default function ErpLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
        <h1 className="text-center text-xl font-bold text-pink-400">Sueep ERP</h1>
        <p className="mt-2 text-center text-xs text-zinc-500">Internal sign-in</p>
        <ErpLoginForm />
        <p className="mt-6 text-center text-[10px] text-zinc-600">
          Local: set <code className="text-zinc-400">DATABASE_URL</code>,{" "}
          <code className="text-zinc-400">ERP_SESSION_SECRET</code>,{" "}
          <code className="text-zinc-400">ERP_ACCESS_PASSWORD</code> in{" "}
          <code className="text-zinc-400">.env.local</code> — see <code className="text-zinc-400">.env.example</code>.
        </p>
        <p className="mt-4 text-center text-[10px] text-zinc-600">
          <a href={MARKETING_SITE_URL} className="text-pink-400 hover:underline">
            ← Public site
          </a>
        </p>
      </div>
    </div>
  );
}
