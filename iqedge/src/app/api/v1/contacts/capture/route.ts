import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── CAPTURE CONTACT FROM WHATSAPP WEB EXTENSION ─────────────────────────────
// Called by the Chrome extension when user clicks "Save & Enrich"

export async function POST(req: NextRequest) {
  const { name, phone, tags, notes, messages, source } = await req.json();

  if (!name && !phone) {
    return NextResponse.json(
      { error: "Name or phone required" },
      { status: 400 }
    );
  }

  // Queue enrichment task — the worker will:
  // 1. Search across all data sources (contacts, companies, GBP, MSME, voter rolls)
  // 2. Match or create a contact
  // 3. Run external enrichment syncs
  const task = await prisma.enrichmentTask.create({
    data: {
      contactId: "pending", // will be updated after match/create
      source: source || "whatsapp_web",
      phone: phone || null,
      name: name || null,
      email: null,
      status: "pending",
      enrichments: {
        capturedMessages: messages?.length || 0,
        tags: tags || [],
        notes: notes || null,
      },
    },
  });

  return NextResponse.json({
    ok: true,
    taskId: task.id,
    message: "Contact captured. Enrichment queued.",
  });
}
