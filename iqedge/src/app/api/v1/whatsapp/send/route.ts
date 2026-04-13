import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── SEND A MESSAGE (manual / from dashboard) ───────────────────────────────

export async function POST(req: NextRequest) {
  const { conversationId, text, templateName, templateParams } = await req.json();

  if (!conversationId || (!text && !templateName)) {
    return NextResponse.json(
      { error: "conversationId and (text or templateName) required" },
      { status: 400 }
    );
  }

  const conversation = await prisma.whatsAppConversation.findUnique({
    where: { id: conversationId },
    include: { account: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const { account } = conversation;

  let result: any;
  let messageType = "text";
  let messageBody = text;

  if (templateName) {
    // Send template message
    result = await sendTemplate(
      account.phoneNumberId,
      account.accessToken,
      conversation.waUserId,
      templateName,
      templateParams || []
    );
    messageType = "template";
    messageBody = `[Template: ${templateName}]`;
  } else {
    // Send text message
    result = await sendText(
      account.phoneNumberId,
      account.accessToken,
      conversation.waUserId,
      text
    );
  }

  if (!result) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  // Store outbound message
  const message = await prisma.whatsAppMessage.create({
    data: {
      conversationId,
      waMessageId: result.messages?.[0]?.id || null,
      direction: "outbound",
      type: messageType,
      body: messageBody,
      templateName: templateName || null,
      status: "sent",
    },
  });

  // Update conversation
  await prisma.whatsAppConversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  return NextResponse.json({ ok: true, messageId: message.id });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function sendText(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string
) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
      }
    );
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

async function sendTemplate(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  templateName: string,
  params: string[]
) {
  const components = params.length
    ? [
        {
          type: "body",
          parameters: params.map((p) => ({ type: "text", text: p })),
        },
      ]
    : [];

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components,
          },
        }),
      }
    );
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
