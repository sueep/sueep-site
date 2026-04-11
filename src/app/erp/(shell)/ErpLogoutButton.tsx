"use client";

export function ErpLogoutButton() {
  async function logout() {
    await fetch("/api/erp/auth/logout", { method: "POST" });
    window.location.href = "/erp/login";
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="w-full rounded-md border border-zinc-700 px-3 py-2 text-left text-xs text-zinc-400 hover:border-zinc-600 hover:text-white"
    >
      Sign out
    </button>
  );
}
