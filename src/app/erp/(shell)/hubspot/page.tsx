import Link from "next/link";
import { HubSpotSyncPanel } from "../HubSpotSyncPanel";

export default function ErpHubSpotPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">HubSpot sync</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Import deals from your CRM into ERP projects. After syncing, open{" "}
          <Link href="/erp/projects" className="text-pink-400 hover:underline">
            Projects
          </Link>{" "}
          or{" "}
          <Link href="/erp/schedule" className="text-pink-400 hover:underline">
            Schedule
          </Link>
          .
        </p>
      </div>
      <HubSpotSyncPanel />
    </div>
  );
}
