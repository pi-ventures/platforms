import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { resolveRelationship } from '@/lib/indian-relations'

// POST /api/v1/graph/path — Find how two people are connected
// Body: { fromPersonId, toPersonId, maxDepth?: 6 }
//
// Example: "How am I connected to Vikram?"
// Result: You → Amit (cousin) → Sneha (wife) → Priya (daughter) → Vikram (husband)
//         5th degree | "2nd cousin's wife's daughter's husband"

export async function POST(req: NextRequest) {
  const { fromPersonId, toPersonId, maxDepth = 6 } = await req.json()

  if (!fromPersonId || !toPersonId) {
    return NextResponse.json({ error: 'fromPersonId and toPersonId required' }, { status: 400 })
  }

  // BFS traversal through the connection graph
  type Node = { personId: string; path: { personId: string; personName: string; label: string; labelHindi: string | null; type: string }[] }

  const visited = new Set<string>()
  const queue: Node[] = [{ personId: fromPersonId, path: [] }]
  visited.add(fromPersonId)

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current.path.length >= maxDepth) continue

    // Get all connections from this person (both directions)
    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ fromId: current.personId }, { toId: current.personId }],
        isActive: true,
      },
      include: {
        from: { select: { id: true, name: true } },
        to: { select: { id: true, name: true } },
      },
    })

    for (const conn of connections) {
      const nextPersonId = conn.fromId === current.personId ? conn.toId : conn.fromId
      const nextPerson = conn.fromId === current.personId ? conn.to : conn.from

      // Determine the label from this person's perspective
      let label = conn.label
      // Reverse labels for bidirectional relations viewed from other side
      if (conn.fromId !== current.personId) {
        label = reverseLabel(conn.label)
      }

      if (nextPersonId === toPersonId) {
        // Found the target!
        const fullPath = [
          ...current.path,
          { personId: nextPersonId, personName: nextPerson.name, label, labelHindi: conn.labelHindi, type: conn.type },
        ]

        const chainDescription = buildChainDescription(fullPath)
        const degree = fullPath.length
        const labels = fullPath.map(p => p.label)
        const resolved = resolveRelationship(labels)

        return NextResponse.json({
          found: true,
          degree,
          degreeLabel: degree <= 3 ? `${ordinal(degree)} degree` : `${degree}th degree`,
          chain: fullPath,
          description: chainDescription,
          // Indian shortcut name (e.g. "Mausera Bhai" instead of "Mausa's son")
          indianShortcut: resolved.shortcut ? {
            hindi: resolved.shortcut.hindi,
            hindiScript: resolved.shortcut.hindiScript,
            english: resolved.shortcut.english,
          } : null,
          // Step-by-step resolution showing which parts collapsed
          resolvedChain: resolved.resolvedChain,
          indianDescription: buildIndianDescription(fullPath),
        })
      }

      if (!visited.has(nextPersonId)) {
        visited.add(nextPersonId)
        queue.push({
          personId: nextPersonId,
          path: [
            ...current.path,
            { personId: nextPersonId, personName: nextPerson.name, label, labelHindi: conn.labelHindi, type: conn.type },
          ],
        })
      }
    }
  }

  return NextResponse.json({
    found: false,
    degree: null,
    description: 'No connection found within ' + maxDepth + ' degrees',
  })
}

function reverseLabel(label: string): string {
  const reverseMap: Record<string, string> = {
    'Father': 'Son', 'Mother': 'Son', 'Son': 'Father', 'Daughter': 'Father',
    'Husband': 'Wife', 'Wife': 'Husband', 'Spouse': 'Spouse',
    'Brother': 'Brother', 'Sister': 'Sister',
    'Chacha': 'Nephew', 'Tau': 'Nephew', 'Mama': 'Nephew',
    'Bua': 'Nephew', 'Mausi': 'Nephew',
    'Nephew': 'Uncle', 'Niece': 'Uncle',
    'Dada': 'Grandson', 'Dadi': 'Grandson', 'Nana': 'Grandson', 'Nani': 'Grandson',
    'Grandson': 'Grandfather', 'Granddaughter': 'Grandfather',
    'Father-in-law': 'Son-in-law', 'Mother-in-law': 'Son-in-law',
    'Son-in-law': 'Father-in-law', 'Daughter-in-law': 'Mother-in-law',
    'Devar': 'Bhabhi', 'Bhabhi': 'Devar',
    'Jeth': 'Bhabhi', 'Nanad': 'Bhabhi',
    'Sala': 'Jija', 'Sali': 'Jija',
    'Damaad': 'Father-in-law', 'Bahu': 'Mother-in-law',
    // Professional
    'Employer': 'Employee', 'Employee': 'Employer',
    'Teacher': 'Student', 'Student': 'Teacher',
    'Mentor': 'Mentee', 'Mentee': 'Mentor',
    // Default: same label
  }
  return reverseMap[label] || label
}

function buildChainDescription(path: { personName: string; label: string }[]): string {
  if (path.length === 0) return ''
  if (path.length === 1) return `Your ${path[0].label}`

  // "Your cousin's wife's daughter's husband"
  const parts = path.map((p, i) => {
    if (i === 0) return `Your ${p.label.toLowerCase()}`
    return `${p.label.toLowerCase()}`
  })

  return parts.join("'s ")
}

function buildIndianDescription(path: { personName: string; label: string; labelHindi: string | null }[]): string {
  if (path.length === 0) return ''

  // Use Hindi labels if available: "आपके चाचा की पत्नी की बेटी के पति"
  const hindiParts = path.map((p, i) => {
    const label = p.labelHindi || p.label
    if (i === 0) return `आपके ${label}`
    return label
  })

  return hindiParts.join(' के/की ')
}

function ordinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}
