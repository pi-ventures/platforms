import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runEnrichmentCron } from "@/lib/enrichment-worker";

// ─── GET: Enrichment queue status ────────────────────────────────────────────

export async function GET() {
  const [pending, processing, completed, failed] = await Promise.all([
    prisma.enrichmentTask.count({ where: { status: "pending" } }),
    prisma.enrichmentTask.count({ where: { status: "processing" } }),
    prisma.enrichmentTask.count({ where: { status: "completed" } }),
    prisma.enrichmentTask.count({ where: { status: "failed" } }),
  ]);

  return NextResponse.json({
    queue: { pending, processing, completed, failed },
    total: pending + processing + completed + failed,
  });
}

// ─── POST: Trigger enrichment processing ─────────────────────────────────────

export async function POST(req: NextRequest) {
  const processed = await runEnrichmentCron();

  return NextResponse.json({
    ok: true,
    processed,
    message: `Enriched ${processed} contacts`,
  });
}
