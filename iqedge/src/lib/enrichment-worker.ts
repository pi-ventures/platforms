import prisma from "./prisma";
import { Pool } from "pg";

// ─── ENRICHMENT WORKER ───────────────────────────────────────────────────────
// Processes EnrichmentTask queue: matches contacts against all data sources,
// fetches external enrichment (Google, WhatsApp verify, LinkedIn, etc.),
// and links the WhatsApp conversation to the matched contact.

const khPool = new Pool({
  connectionString:
    process.env.KNOWLEDGEHUB_DATABASE_URL ||
    "postgresql://postgres:5432@localhost:5432/knowledgehub",
  max: 5,
});

const clusterPool = new Pool({
  connectionString:
    process.env.CLUSTER_DATABASE_URL ||
    "postgresql://postgres:postgres@10.10.4.150:5432/datahub",
  max: 5,
});

// ─── MAIN PROCESSOR ──────────────────────────────────────────────────────────

export async function processEnrichmentQueue(batchSize = 10) {
  const tasks = await prisma.enrichmentTask.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: batchSize,
  });

  if (tasks.length === 0) return 0;

  let processed = 0;

  for (const task of tasks) {
    await prisma.enrichmentTask.update({
      where: { id: task.id },
      data: { status: "processing" },
    });

    try {
      const enrichments: Record<string, any> = {};
      const matchedRecords: Record<string, any> = {};

      // 1. Match against KnowledgeHub contacts (30M)
      if (task.phone) {
        const contactMatch = await matchContact(task.phone, task.name);
        if (contactMatch) {
          matchedRecords.contact = contactMatch;
          enrichments.knowledgehub = contactMatch;
        }
      }

      // 2. Match against companies (11M)
      if (task.name) {
        const companyMatch = await matchCompany(task.name);
        if (companyMatch) {
          matchedRecords.company = companyMatch;
          enrichments.company = companyMatch;
        }
      }

      // 3. Match against GBP places (500M target)
      if (task.phone) {
        const gbpMatch = await matchGBP(task.phone, task.name);
        if (gbpMatch) {
          matchedRecords.gbp = gbpMatch;
          enrichments.gbp = gbpMatch;
        }
      }

      // 4. Match against MSME (18M)
      if (task.name) {
        const msmeMatch = await matchMSME(task.name);
        if (msmeMatch) {
          matchedRecords.msme = msmeMatch;
          enrichments.msme = msmeMatch;
        }
      }

      // 5. Match against voter rolls (7M Telangana)
      if (task.name) {
        const voterMatch = await matchVoterRoll(task.name);
        if (voterMatch) {
          matchedRecords.voter = voterMatch;
          enrichments.voter = voterMatch;
        }
      }

      // 6. External enrichment syncs (Phase 2 — when GPU node is ready)
      // enrichments.google = await googleEnrich(task.email);
      // enrichments.whatsapp = await whatsappVerify(task.phone);
      // enrichments.linkedin = await linkedinEnrich(task.name, task.email);
      // enrichments.gravatar = await gravatarEnrich(task.email);

      // Update task with results
      await prisma.enrichmentTask.update({
        where: { id: task.id },
        data: {
          status: "completed",
          enrichments,
          matchedRecords,
          completedAt: new Date(),
        },
      });

      // Link WhatsApp conversation to matched contact if source is whatsapp
      if (task.source === "whatsapp" && matchedRecords.contact?.id) {
        await prisma.whatsAppConversation.updateMany({
          where: { id: task.contactId }, // contactId temporarily holds conversationId
          data: { contactId: matchedRecords.contact.id },
        });
      }

      if (task.source === "whatsapp" && matchedRecords.company?.id) {
        await prisma.whatsAppConversation.updateMany({
          where: { id: task.contactId },
          data: { companyId: matchedRecords.company.id },
        });
      }

      processed++;
    } catch (err: any) {
      console.error(`[Enrichment] Task ${task.id} failed:`, err.message);
      await prisma.enrichmentTask.update({
        where: { id: task.id },
        data: { status: "failed" },
      });
    }
  }

  return processed;
}

// ─── MATCHERS ────────────────────────────────────────────────────────────────

async function matchContact(phone: string, name: string | null) {
  const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10); // last 10 digits
  const result = await khPool.query(
    `SELECT id, name, phone, email, city, state
     FROM contacts_knowledgehub
     WHERE phone LIKE $1
     LIMIT 1`,
    [`%${cleanPhone}`]
  );
  return result.rows[0] || null;
}

async function matchCompany(name: string) {
  const result = await khPool.query(
    `SELECT id, name, cin, city, state, email, website, type, status
     FROM companies_knowledgehub
     WHERE name ILIKE $1
     LIMIT 5`,
    [`%${name}%`]
  );
  return result.rows[0] || null;
}

async function matchGBP(phone: string, name: string | null) {
  const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

  // Try phone match first
  let result = await clusterPool.query(
    `SELECT place_id, name, phone, address, search_city, search_state,
            website, rating, total_ratings, primary_type
     FROM gbp_raw_results
     WHERE phone LIKE $1
     LIMIT 1`,
    [`%${cleanPhone}`]
  );

  if (result.rows[0]) return result.rows[0];

  // Fall back to name match if phone doesn't hit
  if (name) {
    result = await clusterPool.query(
      `SELECT place_id, name, phone, address, search_city, search_state,
              website, rating, total_ratings, primary_type
       FROM gbp_raw_results
       WHERE name ILIKE $1
       LIMIT 3`,
      [`%${name}%`]
    );
    return result.rows[0] || null;
  }

  return null;
}

async function matchMSME(name: string) {
  const result = await khPool.query(
    `SELECT id, enterprise_name, district, state, address,
            nic_description, registration_date
     FROM msme_udyam
     WHERE enterprise_name ILIKE $1
     LIMIT 3`,
    [`%${name}%`]
  );
  return result.rows[0] || null;
}

async function matchVoterRoll(name: string) {
  const result = await clusterPool.query(
    `SELECT epic_number, voter_name, father_name, age, gender,
            district, ac_name, part_number
     FROM tg_people_voterid
     WHERE voter_name ILIKE $1
     LIMIT 3`,
    [`%${name}%`]
  );
  return result.rows[0] || null;
}

// ─── CRON RUNNER ─────────────────────────────────────────────────────────────
// Call this from a cron job or API endpoint to process the queue

export async function runEnrichmentCron() {
  const start = Date.now();
  let totalProcessed = 0;

  // Process in batches until queue is empty or 60 seconds elapsed
  while (Date.now() - start < 60_000) {
    const processed = await processEnrichmentQueue(20);
    totalProcessed += processed;
    if (processed === 0) break;
  }

  return totalProcessed;
}
