import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { RELATIONS } from '@/lib/indian-relations'

// ─────────────────────────────────────────────────────────────────────────────
// KnowledgeHub Graph Sync API
//
// POST /api/v1/graph/sync — Receive relationship data from any vertical
// GET  /api/v1/graph/sync?vertical=curioushat&since=2026-03-01 — Pull relationships for a vertical
// ─────────────────────────────────────────────────────────────────────────────

// ── INBOUND: Verticals push relationship data to KnowledgeHub ────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, persons, connections } = body

    if (!source) return NextResponse.json({ error: 'source vertical required' }, { status: 400 })

    let personsUpserted = 0
    let connectionsCreated = 0

    // Upsert persons
    if (persons && Array.isArray(persons)) {
      for (const p of persons) {
        const verticalIds = { [source]: p.externalId, ...(p.verticalIds || {}) }

        await prisma.person.upsert({
          where: { goldenRecordId: `${source}:${p.externalId}` },
          update: {
            name: p.name,
            gender: p.gender,
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
            city: p.city,
            state: p.state,
            phone: p.phone,
            email: p.email,
            headline: p.headline,
            verticalIds,
          },
          create: {
            goldenRecordId: `${source}:${p.externalId}`,
            name: p.name,
            gender: p.gender,
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
            city: p.city,
            state: p.state,
            phone: p.phone,
            email: p.email,
            headline: p.headline,
            verticalIds,
          },
        })
        personsUpserted++
      }
    }

    // Upsert connections
    if (connections && Array.isArray(connections)) {
      for (const c of connections) {
        // Resolve person IDs
        const fromPerson = await prisma.person.findFirst({
          where: { goldenRecordId: `${source}:${c.fromExternalId}` },
        })
        const toPerson = await prisma.person.findFirst({
          where: { goldenRecordId: `${source}:${c.toExternalId}` },
        })

        if (!fromPerson || !toPerson) continue

        // Check if connection exists
        const existing = await prisma.connection.findFirst({
          where: { fromId: fromPerson.id, toId: toPerson.id, label: c.label },
        })

        if (!existing) {
          // Auto-resolve all language labels from the relation key
          const relationKey = c.relationKey || c.label.toLowerCase().replace(/\s+/g, '_')
          const relation = RELATIONS.find(r => r.key === relationKey)
          const allLabels = relation?.terms || null
          const hindiTerm = relation?.terms?.hindi

          await prisma.connection.create({
            data: {
              fromId: fromPerson.id,
              toId: toPerson.id,
              type: c.type || 'family',
              label: c.label,
              labelHindi: c.labelHindi || hindiTerm?.script || null,
              labels: allLabels as any, // all 15+ language labels auto-populated
              relationKey,
              degree: c.degree || 1,
              side: c.side || null,
              since: c.since ? new Date(c.since) : null,
              isVerified: c.isVerified || false,
              source,
              verticals: c.verticals || [source],
              heirClass: c.heirClass || null,
            },
          })
          connectionsCreated++
        }
      }
    }

    // Log ingest
    await prisma.ingestLog.create({
      data: { source, dataType: 'relationships', recordCount: personsUpserted + connectionsCreated, status: 'received' },
    })

    return NextResponse.json({
      success: true,
      personsUpserted,
      connectionsCreated,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

// ── OUTBOUND: Verticals pull relationship data from KnowledgeHub ─────────────
export async function GET(req: NextRequest) {
  const vertical = req.nextUrl.searchParams.get('vertical')
  const since = req.nextUrl.searchParams.get('since')
  const personId = req.nextUrl.searchParams.get('personId')
  const language = req.nextUrl.searchParams.get('language') || 'hindi'

  if (!vertical) return NextResponse.json({ error: 'vertical param required' }, { status: 400 })

  // If personId specified, return that person's graph
  if (personId) {
    const person = await prisma.person.findFirst({
      where: { goldenRecordId: `${vertical}:${personId}` },
      include: {
        connectionsFrom: { include: { to: true }, where: { isActive: true } },
        connectionsTo: { include: { from: true }, where: { isActive: true } },
      },
    })

    if (!person) return NextResponse.json({ error: 'Person not found' }, { status: 404 })

    const connections = [
      ...person.connectionsFrom.map(c => ({
        personId: c.to.goldenRecordId,
        personName: c.to.name,
        label: c.label,
        labelHindi: c.labelHindi,
        type: c.type,
        degree: c.degree,
        side: c.side,
        verticals: c.verticals,
        heirClass: c.heirClass,
      })),
      ...person.connectionsTo.map(c => ({
        personId: c.from.goldenRecordId,
        personName: c.from.name,
        label: c.label,
        labelHindi: c.labelHindi,
        type: c.type,
        degree: c.degree,
        side: c.side,
        verticals: c.verticals,
        heirClass: c.heirClass,
      })),
    ]

    return NextResponse.json({
      person: {
        goldenRecordId: person.goldenRecordId,
        name: person.name,
        verticalIds: person.verticalIds,
      },
      connections,
      total: connections.length,
    })
  }

  // Otherwise, return all persons + connections relevant to this vertical (since date)
  const where: Record<string, unknown> = {}
  if (since) {
    where.createdAt = { gte: new Date(since) }
  }

  // Get all persons that have this vertical in their verticalIds
  const persons = await prisma.person.findMany({
    where: {
      ...where,
      verticalIds: { path: [vertical], not: null } as any, // JSON query
    },
    take: 1000,
  })

  // Get connections where verticals array contains this vertical
  const connections = await prisma.connection.findMany({
    where: {
      ...where,
      verticals: { has: vertical },
      isActive: true,
    },
    include: {
      from: { select: { goldenRecordId: true, name: true } },
      to: { select: { goldenRecordId: true, name: true } },
    },
    take: 5000,
  })

  return NextResponse.json({
    vertical,
    since: since || 'all',
    persons: persons.map(p => ({
      goldenRecordId: p.goldenRecordId,
      name: p.name,
      verticalIds: p.verticalIds,
    })),
    connections: connections.map(c => ({
      from: { id: c.from.goldenRecordId, name: c.from.name },
      to: { id: c.to.goldenRecordId, name: c.to.name },
      label: c.label,
      labelHindi: c.labelHindi,
      type: c.type,
      degree: c.degree,
      heirClass: c.heirClass,
    })),
    totalPersons: persons.length,
    totalConnections: connections.length,
  })
}
