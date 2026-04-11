import { ErpLoginForm } from "./ErpLoginForm";

const MARKETING_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://sueep.com";

function erpEnvReady(): boolean {
  const pw = process.env.ERP_ACCESS_PASSWORD;
  const secret = process.env.ERP_SESSION_SECRET;
  return !!(pw && secret && secret.length >= 16);
}

export default function ErpLoginPage() {
  const configured = erpEnvReady();
  const showProdHint = process.env.NODE_ENV === "production" && !configured;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
        <h1 className="text-center text-xl font-bold text-pink-400">Sueep ERP</h1>
        <p className="mt-2 text-center text-xs text-zinc-500">Internal sign-in</p>
        {showProdHint ? (
          <div
            className="mt-4 rounded-md border border-amber-700/80 bg-amber-950/40 px-3 py-2 text-center text-[11px] leading-snug text-amber-100"
            role="alert"
          >
            ERP auth is not configured on this deployment. In the Vercel project → Settings → Environment Variables,
            add <code className="text-amber-50">ERP_ACCESS_PASSWORD</code> and{" "}
            <code className="text-amber-50">ERP_SESSION_SECRET</code> (min 16 characters), then redeploy. For data
            storage, set <code className="text-amber-50">DATABASE_URL</code> to a hosted database (SQLite file storage
            does not work on Vercel serverless).
          </div>
        ) : null}
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
