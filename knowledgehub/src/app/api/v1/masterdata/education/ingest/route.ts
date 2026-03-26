import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/v1/masterdata/education/ingest — Receive education data from IQEdge/CuriousHat
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const data = payload.payload || payload

    await prisma.ingestLog.create({
      data: { source: payload.sourcePlatform || data.source || 'iqedge', dataType: data.dataType || 'education', status: 'received' },
    })

    if (data.dataType === 'admission_funnel' && data.admissionFunnel) {
      await prisma.admissionFunnel.create({
        data: {
          academicYear: data.admissionFunnel.academicYear || '2025-26',
          region: data.region || {},
          totalProfiles: data.admissionFunnel.totalProfiles || 0,
          totalLeadsSent: data.admissionFunnel.totalLeadsSent || 0,
          totalApplications: data.admissionFunnel.totalApplications || 0,
          totalAdmissions: data.admissionFunnel.totalAdmissions || 0,
          conversionRate: data.admissionFunnel.conversionRate || 0,
          topColleges: data.admissionFunnel.topCollegesByLeads || [],
          topCoaching: data.admissionFunnel.topCoachingByEnrollment || [],
          avgLeadCost: data.admissionFunnel.avgLeadCost || 0,
        },
      })
    } else {
      await prisma.educationSnapshot.create({
        data: {
          dataType: data.dataType || 'school_metrics',
          region: data.educationMetrics?.region || data.region || {},
          academicYear: data.educationMetrics?.academicYear || '2025-26',
          board: data.educationMetrics?.board,
          totalStudents: data.educationMetrics?.totalStudents,
          avgBoardScore: data.educationMetrics?.avgBoardScore,
          topStreamDemand: data.educationMetrics?.topStreamDemand,
          topEntranceExams: data.educationMetrics?.topEntranceExams,
          admissionRate: data.educationMetrics?.collegeAdmissionRate,
          coachingPenetration: data.educationMetrics?.coachingPenetration,
          rawPayload: data,
        },
      })
    }

    return NextResponse.json({ success: true, recordsSynced: 1 })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
