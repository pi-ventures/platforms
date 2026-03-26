import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/sync/relationships — Push parent-student relationships to KnowledgeHub
// Called when: parent links to student, teacher assigned to class, etc.
export async function POST(req: NextRequest) {
  try {
    // Gather all parent-student relationships
    const parentLinks = await prisma.parentStudent.findMany({
      include: {
        parent: { include: { user: true } },
        student: { include: { user: true, school: true } },
      },
    })

    const persons: Array<Record<string, unknown>> = []
    const connections: Array<Record<string, unknown>> = []
    const seenIds = new Set<string>()

    for (const link of parentLinks) {
      // Parent person
      if (!seenIds.has(link.parent.userId)) {
        seenIds.add(link.parent.userId)
        persons.push({
          externalId: link.parent.userId,
          name: link.parent.user.name,
          email: link.parent.user.email,
          headline: `Parent at ${link.student.school.name}`,
        })
      }

      // Student person
      if (!seenIds.has(link.student.userId)) {
        seenIds.add(link.student.userId)
        persons.push({
          externalId: link.student.userId,
          name: link.student.user.name,
          email: link.student.user.email,
          gender: link.student.gender,
          city: link.student.school.city,
          state: link.student.school.state,
          headline: `Student at ${link.student.school.name}`,
        })
      }

      // Connection
      const relationType = link.relation.toLowerCase() // "Father", "Mother", "Guardian"
      connections.push({
        fromExternalId: link.parent.userId,
        toExternalId: link.student.userId,
        type: 'family',
        label: link.relation,
        relationKey: relationType,
        degree: 1,
        side: relationType === 'father' ? 'paternal' : relationType === 'mother' ? 'maternal' : null,
        verticals: ['curioushat', 'mywills', 'myvault'],
      })
    }

    // Also gather teacher-student relationships
    const teachers = await prisma.teacher.findMany({
      include: { user: true, classSubjects: { include: { class: true } } },
    })

    for (const teacher of teachers) {
      if (!seenIds.has(teacher.userId)) {
        seenIds.add(teacher.userId)
        persons.push({
          externalId: teacher.userId,
          name: teacher.user.name,
          email: teacher.user.email,
          headline: `Teacher — ${teacher.subjects.join(', ')}`,
        })
      }
    }

    // Push to KnowledgeHub
    const khUrl = process.env.KNOWLEDGEHUB_API_URL
    let synced = false

    if (khUrl && !khUrl.includes('your_')) {
      try {
        const res = await fetch(`${khUrl}/v1/graph/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.KNOWLEDGEHUB_API_KEY}`,
          },
          body: JSON.stringify({
            source: 'curioushat',
            persons,
            connections,
          }),
        })

        if (res.ok) {
          synced = true
          const result = await res.json()
          // Log sync
          await prisma.syncLog.create({
            data: {
              target: 'knowledgehub',
              eventType: 'RELATIONSHIP_SYNC',
              payload: { persons: persons.length, connections: connections.length } as any,
              status: 'synced',
              syncedAt: new Date(),
            },
          })
          return NextResponse.json({ success: true, synced: true, ...result })
        }
      } catch (e) {
        await prisma.syncLog.create({
          data: {
            target: 'knowledgehub',
            eventType: 'RELATIONSHIP_SYNC',
            payload: { persons: persons.length, connections: connections.length } as any,
            status: 'failed',
            error: (e as Error).message,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      personsReady: persons.length,
      connectionsReady: connections.length,
      note: synced ? 'Pushed to KnowledgeHub' : 'KnowledgeHub not reachable — data ready for manual sync',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
