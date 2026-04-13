import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── LIST CONVERSATIONS ──────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const status = params.get("status") || "active";
  const search = params.get("q");
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: any = { status };

  if (search) {
    where.OR = [
      { waUserName: { contains: search, mode: "insensitive" } },
      { waUserId: { contains: search } },
      { tags: { has: search } },
    ];
  }

  const [conversations, total] = await Promise.all([
    prisma.whatsAppConversation.findMany({
      where,
      orderBy: { lastMessageAt: "desc" },
      skip,
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // last message preview
        },
        account: { select: { businessName: true, displayPhone: true } },
      },
    }),
    prisma.whatsAppConversation.count({ where }),
  ]);

  // Shape response
  const items = conversations.map((c) => ({
    id: c.id,
    phone: c.waUserId,
    name: c.waUserName,
    contactId: c.contactId,
    companyId: c.companyId,
    status: c.status,
    unreadCount: c.unreadCount,
    lastMessageAt: c.lastMessageAt,
    lastMessage: c.messages[0]?.body || null,
    lastMessageDirection: c.messages[0]?.direction || null,
    tags: c.tags,
    assignedTo: c.assignedTo,
    account: c.account.businessName,
  }));

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// ─── GET SINGLE CONVERSATION WITH MESSAGES ───────────────────────────────────

export async function POST(req: NextRequest) {
  const { conversationId, markRead } = await req.json();

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  const conversation = await prisma.whatsAppConversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
      },
      account: { select: { businessName: true, displayPhone: true } },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Mark as read if requested
  if (markRead) {
    await prisma.whatsAppConversation.update({
      where: { id: conversationId },
      data: { unreadCount: 0 },
    });
  }

  return NextResponse.json(conversation);
}
