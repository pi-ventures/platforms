import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── META WEBHOOK VERIFICATION (GET) ────────────────────────────────────────
// Meta sends a GET request to verify the webhook URL during setup.
// We respond with the challenge token if the verify_token matches.

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token) {
    // Look up account by verify token
    const account = await prisma.whatsAppAccount.findFirst({
      where: { webhookVerifyToken: token, isActive: true },
    });

    if (account && challenge) {
      console.log("[WhatsApp Webhook] Verified for account:", account.businessName);
      return new NextResponse(challenge, { status: 200 });
    }
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ─── INCOMING MESSAGES (POST) ────────────────────────────────────────────────
// Meta sends a POST request for every incoming message, status update, etc.

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Meta sends a body with object: "whatsapp_business_account"
  if (body.object !== "whatsapp_business_account") {
    return NextResponse.json({ error: "Not a WhatsApp event" }, { status: 400 });
  }

  // Process each entry (usually 1)
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "messages") continue;

      const value = change.value;
      const phoneNumberId = value.metadata?.phone_number_id;

      if (!phoneNumberId) continue;

      // Find the connected account
      const account = await prisma.whatsAppAccount.findUnique({
        where: { phoneNumberId },
      });

      if (!account) {
        console.warn("[WhatsApp] Unknown phone_number_id:", phoneNumberId);
        continue;
      }

      // Process incoming messages
      for (const msg of value.messages || []) {
        await handleIncomingMessage(account.id, msg, value.contacts?.[0]);
      }

      // Process status updates (delivered, read, etc.)
      for (const status of value.statuses || []) {
        await handleStatusUpdate(status);
      }
    }
  }

  // Always return 200 quickly — Meta will retry on failure
  return NextResponse.json({ status: "ok" });
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────

async function handleIncomingMessage(
  accountId: string,
  msg: any,
  contact: any
) {
  const waUserId = msg.from; // sender's phone number (e.g. 919876543210)
  const waUserName = contact?.profile?.name || null;
  const timestamp = new Date(parseInt(msg.timestamp) * 1000);

  // Upsert conversation
  const conversation = await prisma.whatsAppConversation.upsert({
    where: {
      accountId_waUserId: { accountId, waUserId },
    },
    update: {
      waUserName: waUserName || undefined,
      lastMessageAt: timestamp,
      unreadCount: { increment: 1 },
    },
    create: {
      accountId,
      waUserId,
      waUserName,
      lastMessageAt: timestamp,
      unreadCount: 1,
    },
  });

  // Extract message content based on type
  const { body, mediaUrl, mediaType, latitude, longitude } = extractMessageContent(msg);

  // Store the message
  const message = await prisma.whatsAppMessage.create({
    data: {
      conversationId: conversation.id,
      waMessageId: msg.id,
      direction: "inbound",
      type: msg.type || "text",
      body,
      mediaUrl,
      mediaType,
      latitude,
      longitude,
      metadata: msg.interactive || msg.button || null,
      createdAt: timestamp,
    },
  });

  // Auto-create contact if not linked yet
  if (!conversation.contactId) {
    await autoCreateContact(conversation.id, waUserId, waUserName);
  }

  // Route to AI agent for processing
  await routeToAgent(accountId, conversation.id, message.id);
}

// ─── STATUS UPDATE HANDLER ───────────────────────────────────────────────────

async function handleStatusUpdate(status: any) {
  const waMessageId = status.id;
  const newStatus = status.status; // sent, delivered, read, failed

  if (!waMessageId) return;

  await prisma.whatsAppMessage.updateMany({
    where: { waMessageId },
    data: { status: newStatus },
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function extractMessageContent(msg: any) {
  let body: string | null = null;
  let mediaUrl: string | null = null;
  let mediaType: string | null = null;
  let latitude: number | null = null;
  let longitude: number | null = null;

  switch (msg.type) {
    case "text":
      body = msg.text?.body || null;
      break;
    case "image":
      mediaUrl = msg.image?.id || null; // Media ID — needs download via API
      mediaType = msg.image?.mime_type || "image/jpeg";
      body = msg.image?.caption || null;
      break;
    case "document":
      mediaUrl = msg.document?.id || null;
      mediaType = msg.document?.mime_type || null;
      body = msg.document?.caption || msg.document?.filename || null;
      break;
    case "audio":
      mediaUrl = msg.audio?.id || null;
      mediaType = msg.audio?.mime_type || "audio/ogg";
      break;
    case "video":
      mediaUrl = msg.video?.id || null;
      mediaType = msg.video?.mime_type || "video/mp4";
      body = msg.video?.caption || null;
      break;
    case "location":
      latitude = msg.location?.latitude || null;
      longitude = msg.location?.longitude || null;
      body = msg.location?.name || msg.location?.address || null;
      break;
    case "contacts":
      body = JSON.stringify(msg.contacts);
      break;
    case "interactive":
      body =
        msg.interactive?.button_reply?.title ||
        msg.interactive?.list_reply?.title ||
        null;
      break;
    case "button":
      body = msg.button?.text || null;
      break;
  }

  return { body, mediaUrl, mediaType, latitude, longitude };
}

// ─── AUTO-CREATE CONTACT ─────────────────────────────────────────────────────
// Creates a contact in KnowledgeHub and queues enrichment

async function autoCreateContact(
  conversationId: string,
  phone: string,
  name: string | null
) {
  // Format phone: 919876543210 → +91-9876543210
  const formattedPhone = `+${phone.slice(0, 2)}-${phone.slice(2)}`;

  // Queue enrichment task — the enrichment worker will:
  // 1. Search existing contacts DB for matches
  // 2. Hit external enrichment syncs (Google, LinkedIn, etc.)
  // 3. Link the conversation to the matched/created contact
  const task = await prisma.enrichmentTask.create({
    data: {
      contactId: conversationId, // temporary — updated after match/create
      source: "whatsapp",
      phone: formattedPhone,
      name,
      status: "pending",
    },
  });

  console.log(`[WhatsApp] Enrichment queued for ${formattedPhone} (task: ${task.id})`);
}

// ─── ROUTE TO AI AGENT ───────────────────────────────────────────────────────
// Determines which AI agent should handle this message and triggers processing

async function routeToAgent(
  accountId: string,
  conversationId: string,
  messageId: string
) {
  // Get the message
  const message = await prisma.whatsAppMessage.findUnique({
    where: { id: messageId },
  });

  if (!message?.body) return; // Skip non-text messages for now

  const text = message.body.toLowerCase();

  // Get all active agents for this account
  const agents = await prisma.whatsAppAgent.findMany({
    where: { accountId, isActive: true },
  });

  // Find matching agent by keywords
  let matchedAgent = agents.find((agent) =>
    agent.triggerKeywords.some((kw) => text.includes(kw.toLowerCase()))
  );

  // Fall back to default agent
  if (!matchedAgent) {
    matchedAgent = agents.find((a) => a.isDefault);
  }

  if (!matchedAgent) return; // No agent configured

  // Update message with agent assignment
  await prisma.whatsAppMessage.update({
    where: { id: messageId },
    data: { agentId: matchedAgent.id },
  });

  // Process with AI agent (async — don't block webhook response)
  // This will be handled by the agent processor worker
  await processWithAgent(accountId, conversationId, messageId, matchedAgent);
}

// ─── AI AGENT PROCESSOR ──────────────────────────────────────────────────────
// Processes a message with the assigned AI agent and sends a response

async function processWithAgent(
  accountId: string,
  conversationId: string,
  messageId: string,
  agent: any
) {
  const message = await prisma.whatsAppMessage.findUnique({
    where: { id: messageId },
  });

  if (!message?.body) return;

  // Get conversation history for context (last 10 messages)
  const history = await prisma.whatsAppMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Detect intent
  const intent = detectIntent(message.body);

  // Update message with intent
  await prisma.whatsAppMessage.update({
    where: { id: messageId },
    data: {
      aiIntent: intent.type,
      aiConfidence: intent.confidence,
    },
  });

  // Generate AI response based on agent's system prompt + conversation history
  const response = await generateAgentResponse(agent, message.body, history, intent);

  if (response) {
    // Send reply via WhatsApp
    const account = await prisma.whatsAppAccount.findUnique({
      where: { id: accountId },
    });

    const conversation = await prisma.whatsAppConversation.findUnique({
      where: { id: conversationId },
    });

    if (account && conversation) {
      const sent = await sendWhatsAppMessage(
        account.phoneNumberId,
        account.accessToken,
        conversation.waUserId,
        response
      );

      // Store outbound message
      await prisma.whatsAppMessage.create({
        data: {
          conversationId,
          agentId: agent.id,
          waMessageId: sent?.messages?.[0]?.id || null,
          direction: "outbound",
          type: "text",
          body: response,
          aiResponse: response,
          aiIntent: intent.type,
          status: sent ? "sent" : "failed",
        },
      });
    }
  }
}

// ─── INTENT DETECTION ────────────────────────────────────────────────────────
// Simple keyword-based intent detection. Will be replaced by LLM on GPU node.

function detectIntent(text: string): { type: string; confidence: number } {
  const lower = text.toLowerCase();

  const patterns: [string, RegExp][] = [
    ["greeting", /^(hi|hello|hey|good morning|good evening|namaste)/],
    ["price_inquiry", /(price|cost|rate|kitna|kya rate|how much)/],
    ["product_inquiry", /(product|item|stock|available|do you have)/],
    ["complaint", /(complaint|issue|problem|not working|broken|bad)/],
    ["order_status", /(order|delivery|tracking|where is my|status)/],
    ["appointment", /(appointment|book|schedule|slot|available time)/],
    ["location", /(address|location|where|directions|map|near)/],
    ["hours", /(open|close|timing|hours|working hours|kab tak)/],
    ["lead", /(interested|want to buy|looking for|need|requirement)/],
    ["support", /(help|support|assist|guide|how to)/],
    ["thanks", /(thank|thanks|dhanyavaad|shukriya)/],
  ];

  for (const [intent, pattern] of patterns) {
    if (pattern.test(lower)) {
      return { type: intent, confidence: 0.8 };
    }
  }

  return { type: "general", confidence: 0.5 };
}

// ─── AI RESPONSE GENERATOR ──────────────────────────────────────────────────
// Generates a response using the agent's system prompt.
// Phase 1: Template-based. Phase 2: Local Gemma 4 on GPU.

async function generateAgentResponse(
  agent: any,
  userMessage: string,
  history: any[],
  intent: { type: string; confidence: number }
): Promise<string | null> {
  // Phase 1: Simple template responses based on intent
  // Phase 2: This will call local Gemma 4 on PI0's GPU
  const templates: Record<string, string> = {
    greeting:
      "Hello! Welcome to {business}. How can I help you today?",
    price_inquiry:
      "I'd be happy to help with pricing. Could you tell me which product or service you're interested in?",
    product_inquiry:
      "Let me check that for you. Could you share more details about what you're looking for?",
    complaint:
      "I'm sorry to hear about this issue. Let me connect you with our support team right away. Could you describe the problem?",
    order_status:
      "Let me look up your order. Could you share your order number or the phone number used for the order?",
    appointment:
      "I can help you book an appointment. What date and time works for you?",
    location:
      "I'll share our location details with you shortly.",
    hours:
      "Let me get our working hours for you.",
    lead:
      "Great to hear you're interested! Let me get some details so we can help you better. What specifically are you looking for?",
    support:
      "I'm here to help! Please describe what you need assistance with.",
    thanks:
      "You're welcome! Is there anything else I can help you with?",
    general:
      "Thanks for reaching out! How can I assist you today?",
  };

  const template = templates[intent.type] || templates.general;

  // Replace {business} placeholder — will be enriched from account data
  return template.replace("{business}", "our business");
}

// ─── SEND WHATSAPP MESSAGE ───────────────────────────────────────────────────
// Sends a text message via Meta Cloud API

async function sendWhatsAppMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string
): Promise<any> {
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

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp Send] Error:", data);
      return null;
    }

    return data;
  } catch (err) {
    console.error("[WhatsApp Send] Failed:", err);
    return null;
  }
}
