import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// ─── CONTACT SEARCH API ──────────────────────────────────────────────────────
// Searches across all data sources: contacts, companies, GBP, MSME, voter rolls
// This connects directly to KnowledgeHub PostgreSQL for 500M record search

const pool = new Pool({
  connectionString:
    process.env.KNOWLEDGEHUB_DATABASE_URL ||
    "postgresql://postgres:5432@localhost:5432/knowledgehub",
  max: 10,
});

const clusterPool = new Pool({
  connectionString:
    process.env.CLUSTER_DATABASE_URL ||
    "postgresql://postgres:postgres@10.10.4.150:5432/datahub",
  max: 5,
});

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q");
  const type = params.get("type"); // person, company, place, all
  const limit = Math.min(parseInt(params.get("limit") || "20"), 100);
  const offset = parseInt(params.get("offset") || "0");

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  const searchType = type || "all";
  const results: any[] = [];

  try {
    // Search contacts (people)
    if (searchType === "all" || searchType === "person") {
      const contacts = await pool.query(
        `SELECT id, name, phone, email, city, state, 'contact' as source
         FROM contacts_knowledgehub
         WHERE name ILIKE $1 OR phone LIKE $2 OR email ILIKE $1
         ORDER BY name
         LIMIT $3 OFFSET $4`,
        [`%${q}%`, `%${q}%`, limit, offset]
      );
      results.push(...contacts.rows);
    }

    // Search companies
    if (searchType === "all" || searchType === "company") {
      const companies = await pool.query(
        `SELECT id, name, cin, city, state, email, website, 'company' as source
         FROM companies_knowledgehub
         WHERE name ILIKE $1 OR cin ILIKE $1
         ORDER BY name
         LIMIT $3 OFFSET $4`,
        [`%${q}%`, `%${q}%`, limit, offset]
      );
      results.push(...companies.rows);
    }

    // Search GBP places
    if (searchType === "all" || searchType === "place") {
      const places = await clusterPool.query(
        `SELECT place_id as id, name, phone, address, search_city as city,
                search_state as state, website, rating, 'gbp' as source
         FROM gbp_raw_results
         WHERE name ILIKE $1 OR phone LIKE $2 OR address ILIKE $1
         ORDER BY total_ratings DESC NULLS LAST
         LIMIT $3 OFFSET $4`,
        [`%${q}%`, `%${q}%`, limit, offset]
      );
      results.push(...places.rows);
    }

    // Search MSME
    if (searchType === "all" || searchType === "company") {
      const msme = await pool.query(
        `SELECT id, enterprise_name as name, district as city, state,
                address, nic_description as industry, 'msme' as source
         FROM msme_udyam
         WHERE enterprise_name ILIKE $1 OR address ILIKE $1
         ORDER BY enterprise_name
         LIMIT $3 OFFSET $4`,
        [`%${q}%`, `%${q}%`, limit, offset]
      );
      results.push(...msme.rows);
    }

    // Count totals per source
    const counts: Record<string, number> = {};
    for (const r of results) {
      counts[r.source] = (counts[r.source] || 0) + 1;
    }

    return NextResponse.json({
      query: q,
      total: results.length,
      counts,
      results: results.slice(0, limit),
    });
  } catch (err: any) {
    console.error("[Contact Search] Error:", err.message);
    return NextResponse.json(
      { error: "Search failed", detail: err.message },
      { status: 500 }
    );
  }
}
