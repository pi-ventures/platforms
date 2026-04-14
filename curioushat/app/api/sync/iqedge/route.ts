import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/sync/iqedge — Push student data to IQEdge.ai
export async function POST(req: NextRequest) {
  const { studentId } = await req.json()

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { name: true } },
      school: { select: { name: true, board: true, city: true, state: true, type: true } },
      scores: { include: { subject: { select: { subjectName: true } } } },
      profileCard: true,
      classes: { include: { class: true }, take: 1 },
      entranceExamPrep: true,
    },
  })

  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  // Get attendance
  const attendance = await prisma.attendance.findMany({ where: { studentId } })
  const total = attendance.length
  const present = attendance.filter((a: any) => a.status === 'PRESENT').length

  // Build payload
  const payload = {
    source: 'curioushat' as const,
    studentId: student.id,
    schoolId: student.schoolId,
    timestamp: new Date().toISOString(),
    student: {
      name: student.user.name,
      grade: student.classes[0]?.class.grade || '',
      section: student.classes[0]?.class.section || '',
      board: student.school.board,
      category: student.category || undefined,
      state: student.school.state,
      pincode: student.pincode || '',
    },
    scores: student.scores.map((s: any) => ({
      subject: s.subject.subjectName,
      examType: s.examType,
      marksObtained: s.marksObtained,
      maxMarks: s.maxMarks,
      percentage: s.percentage,
      grade: s.grade || '',
      term: s.term,
      academicYear: s.academicYear,
    })),
    attendance: {
      totalDays: total,
      present,
      absent: total - present,
      percentage: total > 0 ? Math.round((present / total) * 1000) / 10 : 0,
    },
    profileCard: student.profileCard ? {
      overallPercent: student.profileCard.overallPercent,
      stream: student.profileCard.stream || undefined,
      strengthMap: student.profileCard.strengthMap as Record<string, number>,
      weaknessAreas: (student.profileCard.weaknessAreas as string[]) || [],
      aiCareerRecommendations: ((student.profileCard.aiCareerRec as any[]) || []).map((r: any) => r.career),
      aiStreamRecommendation: student.profileCard.aiStreamRec || undefined,
      entranceScores: student.profileCard.entranceScores as Record<string, number> || undefined,
      isShareable: student.profileCard.isShareable,
    } : {
      overallPercent: 0, strengthMap: {}, weaknessAreas: [], aiCareerRecommendations: [], isShareable: false,
    },
    entranceExamPrep: student.entranceExamPrep.map((e: any) => ({
      examName: e.examName,
      targetYear: e.targetYear,
      mocksTaken: e.mocksTaken,
      bestScore: e.bestScore || 0,
      readinessPercent: e.readinessPercent,
      subjectWise: e.subjectWise as Record<string, number> || {},
    })),
  }

  // Log the sync attempt
  const syncLog = await prisma.syncLog.create({
    data: {
      target: 'iqedge',
      eventType: 'STUDENT_PROFILE_UPDATE',
      payload: payload as any,
      status: 'pending',
    },
  })

  // In production, this would POST to IQEdge.ai API
  // For now, mark as synced locally
  const iqEdgeUrl = process.env.IQEDGE_API_URL
  if (iqEdgeUrl && !iqEdgeUrl.includes('your_')) {
    try {
      const res = await fetch(`${iqEdgeUrl}/v1/education/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.IQEDGE_API_KEY}`,
        },
        body: JSON.stringify(payload),
      })
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: { status: res.ok ? 'synced' : 'failed', responseCode: res.status, syncedAt: new Date() },
      })
    } catch (e) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: { status: 'failed', error: (e as Error).message },
      })
    }
  } else {
    // Local dev — mark as synced
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: { status: 'synced', syncedAt: new Date() },
    })
  }

  // Update student sync timestamp
  await prisma.student.update({
    where: { id: studentId },
    data: { lastSyncedAt: new Date() },
  })

  return NextResponse.json({ success: true, payload, syncLogId: syncLog.id })
}
