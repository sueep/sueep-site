import Link from "next/link";
import { NewProjectForm } from "./NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/erp/projects" className="text-xs text-pink-400 hover:underline">
          ← Projects
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New project</h1>
        <p className="mt-1 text-sm text-zinc-400">Match fields from your PM spreadsheet; more modules can layer on later.</p>
      </div>
      <NewProjectForm />
    </div>
  );
}
