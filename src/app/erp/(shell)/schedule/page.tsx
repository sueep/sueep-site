import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { ScheduleProject } from "@/lib/erp/schedule";
import { SchedulePlanner } from "./SchedulePlanner";

export const metadata: Metadata = {
  title: "Schedule",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SchedulePage() {
  const rows = await prisma.project.findMany({
    orderBy: [{ projectDate: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      jobTitle: true,
      segment: true,
      status: true,
      projectDate: true,
      projectEndDate: true,
      createdAt: true,
      percentDone: true,
    },
  });

  const projects: ScheduleProject[] = rows.map((r) => ({
    id: r.id,
    jobTitle: r.jobTitle,
    segment: r.segment,
    status: r.status,
    projectDate: r.projectDate ? r.projectDate.toISOString() : null,
    projectEndDate: r.projectEndDate ? r.projectEndDate.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    percentDone: r.percentDone,
  }));

  return <SchedulePlanner projects={projects} />;
}
