import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/v1/education/ingest — Receive student/school data from CuriousHat
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const { sourcePlatform, eventType } = payload

    // Log ingest
    await prisma.ingestLog.create({
      data: { source: sourcePlatform || 'curioushat', eventType: eventType || 'STUDENT_PROFILE_UPDATE', status: 'received' },
    })

    const data = payload.payload || payload

    if (data.student && data.scores) {
      // Student data ingest
      const snapshot = await prisma.studentSnapshot.upsert({
        where: { curioushatId: data.studentId },
        update: {
          name: data.student.name,
          grade: data.student.grade,
          section: data.student.section,
          board: data.student.board,
          category: data.student.category,
          state: data.student.state,
          pincode: data.student.pincode,
          scores: data.scores,
          attendance: data.attendance,
          profileCard: data.profileCard,
          entrancePrep: data.entranceExamPrep,
        },
        create: {
          curioushatId: data.studentId,
          schoolId: data.schoolId,
          name: data.student.name,
          grade: data.student.grade,
          section: data.student.section,
          board: data.student.board,
          category: data.student.category,
          state: data.student.state,
          pincode: data.student.pincode,
          scores: data.scores,
          attendance: data.attendance,
          profileCard: data.profileCard,
          entrancePrep: data.entranceExamPrep,
        },
      })

      // Compute analytics
      const scores = data.scores as Array<{ subject: string; percentage: number }>
      const subjectStrength: Record<string, number> = {}
      const bySubject: Record<string, number[]> = {}
      for (const s of scores) {
        if (!bySubject[s.subject]) bySubject[s.subject] = []
        bySubject[s.subject].push(s.percentage)
      }
      for (const [subj, pcts] of Object.entries(bySubject)) {
        subjectStrength[subj] = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
      }

      const allPcts = scores.map(s => s.percentage)
      const avgPct = allPcts.length > 0 ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length : 0
      const predictedBoard = Math.round(avgPct * 0.95) // conservative estimate
      const collegeReadiness = Math.min(100, Math.round(avgPct * 1.05))

      await prisma.studentAnalytics.upsert({
        where: { studentSnapshotId: snapshot.id },
        update: {
          subjectStrength,
          predictedBoardScore: predictedBoard,
          collegeReadinessScore: collegeReadiness,
          careerFitScores: data.profileCard?.aiCareerRecommendations || [],
          computedAt: new Date(),
        },
        create: {
          studentSnapshotId: snapshot.id,
          performanceTrend: [{ month: new Date().toISOString().slice(0, 7), avgPercent: Math.round(avgPct) }],
          subjectStrength,
          predictedBoardScore: predictedBoard,
          collegeReadinessScore: collegeReadiness,
          careerFitScores: data.profileCard?.aiCareerRecommendations || [],
          scholarshipEligibility: data.profileCard?.isShareable ? ['NSP Merit', 'State Merit'] : [],
        },
      })

      return NextResponse.json({ success: true, snapshotId: snapshot.id, recordsSynced: 1 })
    }

    if (data.school && data.metrics) {
      // School data ingest
      const snapshot = await prisma.schoolSnapshot.upsert({
        where: { curioushatId: data.schoolId },
        update: {
          name: data.school.name,
          type: data.school.type,
          board: data.school.board,
          city: data.school.city,
          state: data.school.state,
          pincode: data.school.pincode,
          studentCount: data.school.studentCount,
          teacherCount: data.school.teacherCount,
          metrics: data.metrics,
          govtSchemes: data.govtSchemes,
        },
        create: {
          curioushatId: data.schoolId,
          name: data.school.name,
          type: data.school.type,
          board: data.school.board,
          udiseCode: data.school.udiseCode,
          city: data.school.city,
          state: data.school.state,
          pincode: data.school.pincode,
          studentCount: data.school.studentCount,
          teacherCount: data.school.teacherCount,
          metrics: data.metrics,
          govtSchemes: data.govtSchemes,
        },
      })

      return NextResponse.json({ success: true, snapshotId: snapshot.id, recordsSynced: 1 })
    }

    return NextResponse.json({ success: false, error: 'Unknown payload format' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
