# CuriousHat.ai — Full-Stack Next.js 14 Site

## 🚀 Quick Start

```bash
cd curioushat
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

```
curioushat/
├── app/
│   ├── page.tsx                          ← Landing page (homepage)
│   ├── (marketing)/
│   │   ├── features/page.tsx             ← Features page
│   │   ├── pricing/page.tsx              ← Pricing page
│   │   ├── about/page.tsx                ← About page
│   │   └── contact/page.tsx              ← Contact page
│   ├── (auth)/
│   │   ├── login/page.tsx                ← Login (role-based)
│   │   └── signup/page.tsx               ← Signup (2-step role selector)
│   └── (dashboard)/
│       ├── student/                      ← Student Portal
│       │   ├── page.tsx                  ← Student dashboard
│       │   ├── ai-tutor/page.tsx         ← AI Tutor (image Q&A)
│       │   ├── exams/page.tsx            ← Upcoming & past exams
│       │   ├── grades/page.tsx           ← Gradebook view
│       │   └── timetable/page.tsx        ← Class timetable
│       ├── teacher/                      ← Teacher Portal
│       │   ├── page.tsx                  ← Teacher dashboard
│       │   ├── exam-generator/page.tsx   ← AI Exam Paper Generator
│       │   ├── grader/page.tsx           ← AI OCR Answer Grader
│       │   ├── attendance/page.tsx       ← Attendance management
│       │   ├── gradebook/page.tsx        ← Class gradebook
│       │   └── question-bank/page.tsx    ← Question bank
│       ├── parent/                       ← Parent Portal
│       │   ├── page.tsx                  ← Parent dashboard
│       │   └── fees/page.tsx             ← Fee payments & history
│       └── school/                       ← School Admin Portal
│           ├── page.tsx                  ← Admin overview
│           ├── admissions/page.tsx       ← Admissions management
│           ├── staff/page.tsx            ← Staff & HR
│           ├── timetable/page.tsx        ← Timetable builder
│           ├── fees/page.tsx             ← Fee collection & defaulters
│           └── announcements/page.tsx    ← School-wide announcements
├── components/
│   ├── marketing/
│   │   ├── Navbar.tsx                    ← Site navigation
│   │   └── Footer.tsx                    ← Site footer
│   └── dashboard/
│       └── DashboardShell.tsx            ← Shared dashboard layout (sidebar + topbar)
└── lib/
    └── utils.ts                          ← Utility functions (cn)
```

## 🔧 Backend Integration

Connect the FastAPI backend (from previous build):

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📦 Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **AI**: Claude Vision API (Anthropic)
- **Backend**: FastAPI + PostgreSQL + Redis + Celery
- **Payments**: Stripe / Razorpay
- **Email**: SendGrid
