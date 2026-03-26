import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as crypto from 'crypto'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

function hash(pw: string) { return crypto.createHash('sha256').update(pw).digest('hex') }

async function main() {
  console.log('Seeding CuriousHat.ai database...')

  // ── School ──────────────────────────────────────────────────────────────
  const school = await prisma.school.create({
    data: {
      name: 'Delhi Public School — RK Puram',
      type: 'PRIVATE',
      board: 'CBSE',
      affiliationNo: '2730006',
      address: 'Sector 4, R.K. Puram',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110022',
      phone: '+91-11-26172516',
      email: 'info@dpsrkp.net',
      website: 'https://dpsrkp.net',
      principalName: 'Dr. Vandana Kumar',
      latitude: 28.5614,
      longitude: 77.1798,
      studentCount: 1200,
      teacherCount: 85,
      isGovt: false,
    },
  })

  const govtSchool = await prisma.school.create({
    data: {
      name: 'Kendriya Vidyalaya No.1 — Delhi Cantt',
      type: 'CENTRAL',
      board: 'CBSE',
      udiseCode: '07030100301',
      address: 'Delhi Cantonment',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110010',
      phone: '+91-11-25692124',
      principalName: 'Sh. Rajesh Gupta',
      studentCount: 900,
      teacherCount: 55,
      isGovt: true,
    },
  })

  // ── Classes ─────────────────────────────────────────────────────────────
  const class10A = await prisma.schoolClass.create({
    data: { schoolId: school.id, grade: 'Class X', section: 'A', academicYear: '2025-26', roomNumber: '210' },
  })
  const class12Sci = await prisma.schoolClass.create({
    data: { schoolId: school.id, grade: 'Class XII', section: 'A', academicYear: '2025-26', roomNumber: '312' },
  })
  const class5A = await prisma.schoolClass.create({
    data: { schoolId: school.id, grade: 'Class V', section: 'A', academicYear: '2025-26', roomNumber: '105' },
  })

  // ── Teachers ────────────────────────────────────────────────────────────
  const teacherUsers = [
    { name: 'Ms. Priya Gupta', email: 'priya.gupta@dpsrkp.net', subjects: ['Physics'], exp: 12, spec: 'Physics', classTeacher: true },
    { name: 'Mr. Rajesh Sharma', email: 'rajesh.sharma@dpsrkp.net', subjects: ['Mathematics'], exp: 15, spec: 'Mathematics' },
    { name: 'Ms. Anita Iyer', email: 'anita.iyer@dpsrkp.net', subjects: ['Chemistry'], exp: 10, spec: 'Chemistry' },
    { name: 'Ms. Fatima Khan', email: 'fatima.khan@dpsrkp.net', subjects: ['English'], exp: 8, spec: 'English' },
    { name: 'Ms. Deepa Nair', email: 'deepa.nair@dpsrkp.net', subjects: ['Biology'], exp: 9, spec: 'Biology' },
    { name: 'Mr. Suresh Menon', email: 'suresh.menon@dpsrkp.net', subjects: ['Hindi'], exp: 14, spec: 'Hindi' },
    { name: 'Mr. Vikram Joshi', email: 'vikram.joshi@dpsrkp.net', subjects: ['Computer Science'], exp: 6, spec: 'Computer Science' },
    { name: 'Ms. Shalini Das', email: 'shalini.das@dpsrkp.net', subjects: ['History', 'Social Science'], exp: 11, spec: 'Social Science' },
  ]

  const teachers: { id: string; name: string }[] = []
  for (const t of teacherUsers) {
    const user = await prisma.user.create({
      data: {
        email: t.email, passwordHash: hash('teacher123'), name: t.name, role: 'TEACHER',
        teacher: {
          create: {
            schoolId: school.id, subjects: t.subjects, experience: t.exp,
            specialization: t.spec, isClassTeacher: t.classTeacher || false,
            qualification: 'M.Sc., B.Ed.', joinDate: new Date('2020-04-01'),
          },
        },
      },
      include: { teacher: true },
    })
    teachers.push({ id: user.teacher!.id, name: t.name })
  }

  // ── Class Subjects ──────────────────────────────────────────────────────
  const subjects10 = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Science', 'Computer Science']
  const subjectRecords10: Record<string, string> = {}
  for (let i = 0; i < subjects10.length; i++) {
    const cs = await prisma.classSubject.create({
      data: { classId: class10A.id, subjectName: subjects10[i], teacherId: teachers[i % teachers.length].id },
    })
    subjectRecords10[subjects10[i]] = cs.id
  }

  const subjects12 = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science']
  const subjectRecords12: Record<string, string> = {}
  for (let i = 0; i < subjects12.length; i++) {
    const cs = await prisma.classSubject.create({
      data: { classId: class12Sci.id, subjectName: subjects12[i], teacherId: teachers[i % teachers.length].id },
    })
    subjectRecords12[subjects12[i]] = cs.id
  }

  // ── Students ────────────────────────────────────────────────────────────
  const studentData = [
    { name: 'Om Aditya Raghuvanshi', email: 'om@student.dpsrkp.net', roll: 1, gender: 'Male', father: 'Mr. Raghuvanshi', category: 'General', dob: '2010-06-15', classId: class10A.id, grade: 'Class X' },
    { name: 'Bhavna Sharma', email: 'bhavna@student.dpsrkp.net', roll: 2, gender: 'Female', father: 'Mr. Sharma', category: 'General', dob: '2010-08-22', classId: class10A.id, grade: 'Class X' },
    { name: 'Chirag Patel', email: 'chirag@student.dpsrkp.net', roll: 3, gender: 'Male', father: 'Mr. Patel', category: 'OBC', dob: '2010-03-10', classId: class10A.id, grade: 'Class X' },
    { name: 'Deepa Nair', email: 'deepa.s@student.dpsrkp.net', roll: 4, gender: 'Female', father: 'Mr. Nair', category: 'General', dob: '2010-11-05', classId: class10A.id, grade: 'Class X' },
    { name: 'Ekta Joshi', email: 'ekta@student.dpsrkp.net', roll: 5, gender: 'Female', father: 'Mr. Joshi', category: 'General', dob: '2010-01-17', classId: class10A.id, grade: 'Class X' },
    { name: 'Farhan Sheikh', email: 'farhan@student.dpsrkp.net', roll: 6, gender: 'Male', father: 'Mr. Sheikh', category: 'General', dob: '2010-07-30', classId: class10A.id, grade: 'Class X' },
    { name: 'Gauri Mahajan', email: 'gauri@student.dpsrkp.net', roll: 7, gender: 'Female', father: 'Mr. Mahajan', category: 'General', dob: '2010-04-12', classId: class10A.id, grade: 'Class X' },
    { name: 'Harsh Vardhan', email: 'harsh@student.dpsrkp.net', roll: 8, gender: 'Male', father: 'Mr. Vardhan', category: 'SC', dob: '2010-09-25', classId: class10A.id, grade: 'Class X' },
    { name: 'Isha Reddy', email: 'isha@student.dpsrkp.net', roll: 9, gender: 'Female', father: 'Mr. Reddy', category: 'General', dob: '2010-12-08', classId: class10A.id, grade: 'Class X' },
    { name: 'Jayant Mishra', email: 'jayant@student.dpsrkp.net', roll: 10, gender: 'Male', father: 'Mr. Mishra', category: 'General', dob: '2010-02-20', classId: class10A.id, grade: 'Class X' },
  ]

  // Score data matching mock (from teacher/gradebook: ut1/40, ut2/40, mid/80, ut3/40, pre/80)
  const scoresByRoll: Record<number, Record<string, number[]>> = {
    1: { Mathematics: [38,35,72,36,78], Physics: [34,37,68,35,74], Chemistry: [40,38,76,39,82], Biology: [30,33,64,32,68], English: [37,39,78,38,80], Hindi: [35,36,70,34,72], 'Social Science': [32,34,66,33,70], 'Computer Science': [39,37,74,38,79] },
    2: { Mathematics: [42,40,82,41,85], Physics: [38,40,76,39,80], Chemistry: [39,37,74,38,78], Biology: [44,42,84,43,88], English: [41,43,84,42,86], Hindi: [40,38,78,39,80], 'Social Science': [37,39,76,38,78], 'Computer Science': [43,41,80,42,84] },
    3: { Mathematics: [28,32,58,30,62], Physics: [25,28,52,27,56], Chemistry: [30,33,64,31,66], Biology: [22,25,48,24,52], English: [33,35,68,34,70], Hindi: [30,32,62,31,64], 'Social Science': [28,30,58,29,60], 'Computer Science': [35,33,66,34,68] },
    4: { Mathematics: [45,43,88,44,90], Physics: [42,44,86,43,88], Chemistry: [44,42,84,43,87], Biology: [46,45,90,44,92], English: [43,45,88,44,90], Hindi: [41,43,84,42,86], 'Social Science': [40,42,82,41,85], 'Computer Science': [44,43,86,43,89] },
    5: { Mathematics: [33,36,68,35,70], Physics: [30,32,62,31,65], Chemistry: [35,37,72,36,74], Biology: [28,31,60,30,63], English: [36,38,74,37,76], Hindi: [34,35,70,35,72], 'Social Science': [31,33,64,32,66], 'Computer Science': [37,35,70,36,73] },
    6: { Mathematics: [36,34,70,35,73], Physics: [33,35,66,34,70], Chemistry: [37,39,76,38,78], Biology: [31,33,64,32,67], English: [38,40,78,39,81], Hindi: [35,37,72,36,74], 'Social Science': [33,35,68,34,70], 'Computer Science': [38,36,72,37,75] },
    7: { Mathematics: [40,38,78,39,80], Physics: [37,39,74,38,77], Chemistry: [41,40,80,40,82], Biology: [43,41,82,42,85], English: [39,41,80,40,83], Hindi: [38,40,78,39,80], 'Social Science': [36,38,74,37,76], 'Computer Science': [41,39,78,40,81] },
    8: { Mathematics: [25,28,52,27,55], Physics: [22,25,48,24,50], Chemistry: [27,30,58,29,60], Biology: [20,23,44,22,48], English: [30,32,64,31,66], Hindi: [28,30,60,29,62], 'Social Science': [26,28,54,27,56], 'Computer Science': [32,30,62,31,64] },
    9: { Mathematics: [43,41,82,42,86], Physics: [40,42,80,41,84], Chemistry: [42,40,80,41,84], Biology: [45,43,86,44,89], English: [42,44,86,43,88], Hindi: [40,42,82,41,84], 'Social Science': [38,40,78,39,82], 'Computer Science': [43,41,82,42,85] },
    10: { Mathematics: [35,33,68,34,71], Physics: [32,34,66,33,68], Chemistry: [36,38,74,37,76], Biology: [29,32,62,31,64], English: [37,39,76,38,79], Hindi: [34,36,70,35,72], 'Social Science': [32,34,66,33,68], 'Computer Science': [38,36,72,37,74] },
  }

  const examTypes = ['UT1', 'UT2', 'MID', 'UT3', 'PRE_BOARD']
  const maxMarks = [40, 40, 80, 40, 80]

  for (const sd of studentData) {
    const user = await prisma.user.create({
      data: {
        email: sd.email, passwordHash: hash('student123'), name: sd.name, role: 'STUDENT',
        student: {
          create: {
            schoolId: school.id, rollNumber: sd.roll, gender: sd.gender,
            fatherName: sd.father, category: sd.category,
            dateOfBirth: new Date(sd.dob), admissionDate: new Date('2022-04-01'),
            address: 'New Delhi', pincode: '110022',
          },
        },
      },
      include: { student: true },
    })

    const student = user.student!

    // Enroll in class
    await prisma.studentClass.create({
      data: { studentId: student.id, classId: sd.classId, rollNumber: sd.roll },
    })

    // Insert scores
    const scores = scoresByRoll[sd.roll]
    if (scores) {
      for (const [subject, marks] of Object.entries(scores)) {
        const subjectId = subjectRecords10[subject]
        if (!subjectId) continue
        for (let i = 0; i < examTypes.length; i++) {
          const pct = (marks[i] / maxMarks[i]) * 100
          await prisma.score.create({
            data: {
              studentId: student.id, subjectId, examType: examTypes[i],
              academicYear: '2025-26', term: i < 2 ? 'Term 1' : 'Term 2',
              marksObtained: marks[i], maxMarks: maxMarks[i], percentage: Math.round(pct * 10) / 10,
              grade: pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F',
              gradedBy: teachers[0].id,
              gradedAt: new Date(),
            },
          })
        }
      }
    }

    // Insert attendance (last 30 days)
    const today = new Date()
    for (let d = 1; d <= 30; d++) {
      const date = new Date(today)
      date.setDate(date.getDate() - d)
      if (date.getDay() === 0 || date.getDay() === 6) continue // skip weekends
      const isPresent = Math.random() > 0.08 // 92% attendance
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status: isPresent ? 'PRESENT' : 'ABSENT',
          markedBy: teachers[0].id,
          period: 'FULL_DAY',
        },
      })
    }

    // Create profile card for Om (first student)
    if (sd.roll === 1) {
      const avgPct = Object.values(scores).map(marks => {
        const total = marks.reduce((a, b) => a + b, 0)
        const max = maxMarks.reduce((a, b) => a + b, 0)
        return (total / max) * 100
      })
      const overallPct = Math.round(avgPct.reduce((a, b) => a + b, 0) / avgPct.length * 10) / 10

      const strengthMap: Record<string, number> = {}
      Object.entries(scores).forEach(([subj, marks]) => {
        const total = marks.reduce((a, b) => a + b, 0)
        const max = maxMarks.reduce((a, b) => a + b, 0)
        strengthMap[subj] = Math.round((total / max) * 100)
      })

      await prisma.studentProfileCard.create({
        data: {
          studentId: student.id,
          overallPercent: overallPct,
          board: 'CBSE',
          stream: 'Science',
          subjects: Object.entries(strengthMap).map(([name, pct]) => ({ name, marks: pct, grade: pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : 'B' })),
          strengthMap,
          weaknessAreas: ['Trigonometry', 'Organic Chemistry'],
          extracurricular: ['NCC', 'Debate Club', 'Science Olympiad'],
          achievements: ['District Science Fair — Gold', 'SOF IMO — School Topper'],
          aiCareerRec: [
            { career: 'B.Tech Computer Science', fitPercent: 88 },
            { career: 'B.Tech ECE', fitPercent: 82 },
            { career: 'B.Sc Data Science', fitPercent: 78 },
            { career: 'B.Sc Physics', fitPercent: 75 },
            { career: 'CA (Chartered Accountancy)', fitPercent: 70 },
            { career: 'BBA + MBA', fitPercent: 65 },
          ],
          aiStreamRec: 'Science — PCM with Computer Science',
          isShareable: true,
        },
      })

      // Entrance exam prep
      await prisma.entranceExamPrep.create({
        data: { studentId: student.id, examName: 'JEE Main', targetYear: 2027, mocksTaken: 8, bestScore: 185, avgScore: 162, readinessPercent: 65, subjectWise: { Physics: 58, Chemistry: 72, Mathematics: 65 } },
      })
      await prisma.entranceExamPrep.create({
        data: { studentId: student.id, examName: 'CUET', targetYear: 2027, mocksTaken: 3, bestScore: 420, avgScore: 385, readinessPercent: 72, subjectWise: { English: 80, Mathematics: 68, 'General Test': 70 } },
      })
    }
  }

  // ── Parent ──────────────────────────────────────────────────────────────
  const parentUser = await prisma.user.create({
    data: {
      email: 'raghuvanshi.parent@gmail.com', passwordHash: hash('parent123'), name: 'Mr. Raghuvanshi', role: 'PARENT',
      parent: { create: {} },
    },
    include: { parent: true },
  })

  const omStudent = await prisma.student.findFirst({ where: { rollNumber: 1 } })
  if (omStudent && parentUser.parent) {
    await prisma.parentStudent.create({
      data: { parentId: parentUser.parent.id, studentId: omStudent.id, relation: 'Father' },
    })
  }

  // ── School Admin ────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'admin@dpsrkp.net', passwordHash: hash('admin123'), name: 'Dr. Vandana Kumar', role: 'SCHOOL_ADMIN',
      schoolAdmin: { create: { schoolId: school.id, role: 'principal' } },
    },
  })

  // ── Govt Officer ────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'deo.south@delhi.gov.in', passwordHash: hash('govt123'), name: 'Sh. Amit Kumar Verma', role: 'GOVT_OFFICER',
      govtOfficer: { create: { designation: 'DEO', district: 'South Delhi', state: 'Delhi', jurisdiction: 'District' } },
    },
  })

  // ── College Admin ───────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'admissions@iitd.ac.in', passwordHash: hash('college123'), name: 'Prof. Ramesh Garg', role: 'COLLEGE_ADMIN',
      collegeAdmin: {
        create: {
          collegeName: 'IIT Delhi', collegeType: 'Engineering', city: 'New Delhi', state: 'Delhi',
          affiliatedTo: 'IIT Delhi (Autonomous)', naacGrade: 'A++', nbaAccredited: true,
          seatsTotal: 1000, websiteUrl: 'https://iitd.ac.in',
        },
      },
    },
  })

  // ── Coaching Admin ──────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'center@allen.ac.in', passwordHash: hash('coaching123'), name: 'Mr. Naveen Maheshwari', role: 'COACHING_ADMIN',
      coachingAdmin: {
        create: {
          instituteName: 'ALLEN Career Institute — Delhi', targetExams: ['JEE Main', 'JEE Advanced', 'NEET'],
          city: 'New Delhi', state: 'Delhi', batchCount: 15, studentCount: 2500, successRate: 72,
          websiteUrl: 'https://allen.ac.in',
        },
      },
    },
  })

  // ── University Admin ────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'registrar@du.ac.in', passwordHash: hash('uni123'), name: 'Prof. Yogesh Singh', role: 'UNIVERSITY_ADMIN',
      universityAdmin: {
        create: {
          universityName: 'University of Delhi', type: 'Central', city: 'New Delhi', state: 'Delhi',
          ugcRecognized: true, naacGrade: 'A+', affiliatedColleges: 86, websiteUrl: 'https://du.ac.in',
        },
      },
    },
  })

  // ── Fee Structure ───────────────────────────────────────────────────────
  await prisma.feeStructure.create({
    data: {
      schoolId: school.id, grade: 'Class X', academicYear: '2025-26',
      tuitionFee: 72000, examFee: 3000, labFee: 5000, libraryFee: 2000, transportFee: 18000, totalAnnual: 100000,
    },
  })

  // ── Fee Payment (Om) ───────────────────────────────────────────────────
  if (omStudent) {
    await prisma.feePayment.create({
      data: { studentId: omStudent.id, schoolId: school.id, amount: 25000, feeType: 'Tuition', term: 'Q1', academicYear: '2025-26', status: 'paid', paidAt: new Date('2025-04-15'), receiptNo: 'RCP-2025-0001', paymentMode: 'UPI' },
    })
    await prisma.feePayment.create({
      data: { studentId: omStudent.id, schoolId: school.id, amount: 25000, feeType: 'Tuition', term: 'Q2', academicYear: '2025-26', status: 'paid', paidAt: new Date('2025-07-10'), receiptNo: 'RCP-2025-0156', paymentMode: 'UPI' },
    })
    await prisma.feePayment.create({
      data: { studentId: omStudent.id, schoolId: school.id, amount: 25000, feeType: 'Tuition', term: 'Q3', academicYear: '2025-26', status: 'paid', paidAt: new Date('2025-10-05'), receiptNo: 'RCP-2025-0312', paymentMode: 'Card' },
    })
    await prisma.feePayment.create({
      data: { studentId: omStudent.id, schoolId: school.id, amount: 25000, feeType: 'Tuition', term: 'Q4', academicYear: '2025-26', status: 'pending' },
    })
  }

  // ── Govt Scheme Tracking ────────────────────────────────────────────────
  const schemes = ['PM POSHAN', 'Samagra Shiksha Abhiyan', 'PM SHRI Schools', 'NIPUN Bharat', 'Vidyanjali']
  for (const schemeName of schemes) {
    await prisma.govtSchemeTracking.create({
      data: { schoolId: govtSchool.id, schemeName, compliancePercent: 60 + Math.random() * 35, status: 'active' },
    })
  }

  // ── Timetable (Class X-A, Monday) ───────────────────────────────────────
  const periods = [
    { period: 1, start: '08:00', end: '08:45', subject: 'Mathematics' },
    { period: 2, start: '08:45', end: '09:30', subject: 'English' },
    { period: 3, start: '09:45', end: '10:30', subject: 'Physics' },
    { period: 4, start: '10:30', end: '11:15', subject: 'Chemistry' },
    { period: 5, start: '11:30', end: '12:15', subject: 'Hindi' },
    { period: 6, start: '12:15', end: '13:00', subject: 'Computer Science' },
    { period: 7, start: '13:45', end: '14:30', subject: 'Biology' },
    { period: 8, start: '14:30', end: '15:15', subject: 'Social Science' },
  ]
  for (const p of periods) {
    await prisma.timetable.create({
      data: { schoolId: school.id, classId: class10A.id, day: 'Monday', period: p.period, startTime: p.start, endTime: p.end, subject: p.subject },
    })
  }

  // ── Sample Books ────────────────────────────────────────────────────────
  const books = [
    { title: 'Mathematics (Ganit Prakash)', subject: 'Mathematics', classLevel: 'Class V', author: 'NCERT', pages: 260, domain: 'K-12 School', sourceType: 'NCERT', isSample: true, tags: ['NCERT', 'Sample', 'Class V'] },
    { title: 'Mathematics Part I', subject: 'Mathematics', classLevel: 'Class X', author: 'NCERT', pages: 332, domain: 'K-12 School', sourceType: 'NCERT' },
    { title: 'Science', subject: 'General Science', classLevel: 'Class X', author: 'NCERT', pages: 265, domain: 'K-12 School', sourceType: 'NCERT' },
    { title: 'Physics Part I', subject: 'Physics', classLevel: 'Class XI', author: 'NCERT', pages: 296, domain: 'K-12 School', sourceType: 'NCERT' },
    { title: 'Physics Part I', subject: 'Physics', classLevel: 'Class XII', author: 'NCERT', pages: 334, domain: 'K-12 School', sourceType: 'NCERT' },
    { title: 'Chemistry Part I', subject: 'Chemistry', classLevel: 'Class XI', author: 'NCERT', pages: 264, domain: 'K-12 School', sourceType: 'NCERT' },
    { title: 'Biology', subject: 'Biology', classLevel: 'Class XI', author: 'NCERT', pages: 408, domain: 'K-12 School', sourceType: 'NCERT' },
    { title: 'Concepts of Physics Vol 1', subject: 'Physics', classLevel: 'JEE Main Preparatory', author: 'H.C. Verma', pages: 468, domain: 'Competitive Exams', sourceType: 'Reference' },
    { title: 'Organic Chemistry', subject: 'Chemistry', classLevel: 'JEE Advanced Preparatory', author: 'O.P. Tandon', pages: 512, domain: 'Competitive Exams', sourceType: 'Reference' },
    { title: 'Objective Biology (NEET)', subject: 'Biology', classLevel: 'NEET (UG) Preparatory', author: 'Dinesh', pages: 620, domain: 'Competitive Exams', sourceType: 'Reference' },
    { title: 'Indian Polity', subject: 'Political Science', classLevel: 'UPSC Preparatory', author: 'M. Laxmikanth', pages: 896, domain: 'Government Jobs', sourceType: 'Reference' },
    { title: 'Quantitative Aptitude', subject: 'Mathematics', classLevel: 'SSC/Banking Preparatory', author: 'R.S. Aggarwal', pages: 752, domain: 'Government Jobs', sourceType: 'Reference' },
  ]

  for (const b of books) {
    await prisma.book.create({
      data: {
        title: b.title, subject: b.subject, classLevel: b.classLevel, author: b.author,
        pages: b.pages, domain: b.domain, sourceType: b.sourceType,
        board: 'CBSE', language: 'English', isInterpreted: true,
        isSample: b.isSample || false, tags: b.tags || [],
        attribution: `Source: ${b.sourceType} · Interpreted by CuriousHat AI`,
      },
    })
  }

  // ── Announcements ───────────────────────────────────────────────────────
  await prisma.announcement.create({
    data: {
      schoolId: school.id, title: 'Pre-Board Examinations — Schedule Released',
      content: 'Pre-Board examinations for Class X and XII will commence from March 1, 2026. Detailed schedule has been shared with class teachers. Students are advised to collect their admit cards from the office.',
      audience: ['students', 'teachers', 'parents'], priority: 'important', createdBy: 'admin',
    },
  })
  await prisma.announcement.create({
    data: {
      schoolId: school.id, title: 'Annual Sports Day — March 15',
      content: 'The Annual Sports Day will be held on March 15, 2026. Interested students should register with their PE teacher by March 5.',
      audience: ['students', 'teachers'], priority: 'normal', createdBy: 'admin',
    },
  })

  // ── Print summary ───────────────────────────────────────────────────────
  const counts = {
    users: await prisma.user.count(),
    students: await prisma.student.count(),
    teachers: await prisma.teacher.count(),
    schools: await prisma.school.count(),
    classes: await prisma.schoolClass.count(),
    scores: await prisma.score.count(),
    attendance: await prisma.attendance.count(),
    books: await prisma.book.count(),
    profileCards: await prisma.studentProfileCard.count(),
    feePayments: await prisma.feePayment.count(),
    announcements: await prisma.announcement.count(),
  }

  console.log('\n✅ Seed complete!\n')
  console.table(counts)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
