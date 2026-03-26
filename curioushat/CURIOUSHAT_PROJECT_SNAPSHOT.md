# CuriousHat.ai — Project Snapshot
**Last Updated:** 2026-03-03
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Lucide React
**Path:** `C:\Users\User\Claude\curioushat\`

---

## Project Structure (Key Files)

```
curioushat/
├── app/
│   ├── page.tsx                              ← Homepage
│   ├── api/tutor/route.ts                    ← AI Tutor API (Claude + OpenAI)
│   └── dashboard/
│       ├── student/
│       │   ├── layout.tsx                    ← Student sidebar nav
│       │   ├── page.tsx                      ← Student home
│       │   ├── ai-tutor/page.tsx             ← AI Tutor with model selector
│       │   ├── courses/page.tsx              ← My Courses
│       │   └── library/page.tsx             ← NDL-style Digital Library
│       ├── teacher/
│       │   ├── layout.tsx                    ← Teacher sidebar nav
│       │   ├── page.tsx                      ← Teacher home
│       │   ├── courses/page.tsx              ← Manage Courses
│       │   └── library/page.tsx             ← NDL-style Teaching Library
│       ├── parent/
│       ├── school/
│       └── govt/
├── components/
│   ├── dashboard/DashboardShell.tsx          ← Shared sidebar shell
│   └── marketing/
│       ├── Navbar.tsx                        ← Top nav with Login dropdown
│       └── Footer.tsx                        ← Site footer
└── .env.local                                ← API keys (not committed)
```

---

## Environment Variables (`.env.local`)

```env
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY_HERE
```

---

## Color Theme

All UI uses **violet** (not indigo):
- Primary: `violet-600` / `violet-700`
- Light bg: `violet-50` / `violet-100`
- Text: `violet-600` / `violet-700`

---

## `components/marketing/Navbar.tsx`

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const roles = [
  { label: '🎓 Student', href: '/dashboard/student' },
  { label: '👩‍🏫 Teacher', href: '/dashboard/teacher' },
  { label: '👨‍👩‍👧 Parent', href: '/dashboard/parent' },
  { label: '🏫 School Admin', href: '/dashboard/school' },
  { label: '🏛 State · CBSE · IB · IGCSE', href: '/dashboard/govt' },
]
// ... white nav, border-b border-gray-200, Login dropdown, Get Started Free CTA
```

**Key decisions:**
- Login dropdown has 5 role entries; "Govt. Officer" replaced by `🏛 State · CBSE · IB · IGCSE` (single entry)
- White background, no gradients

---

## `app/page.tsx` — Homepage

### Stats (5 items, grid-cols-3 md:grid-cols-5)
```ts
const stats = [
  { value: '10,000+', label: 'Books in Library' },
  { value: '50K+',    label: 'Students Enrolled' },
  { value: '2,000+',  label: 'Teachers Using AI' },
  { value: '500+',    label: 'Schools Onboarded' },
  { value: '22 · 55', label: 'Indian · Global Languages' },
]
```
Stat card: `text-base sm:text-lg font-black`, `p-3`, `text-center`

### Hero
- H1: `"Learn from the best & latest in the world."`
- Subtitle: `"AI driven Learning Content for Students & Schools, Digital courses library, Complete school management and Automated unbiased grading."`
- Badge: `"Powered by Claude & GPT-4o Vision AI"`
- SVG doodles: Pencil, Atom, Book, Ruler, Globe, Pi, Star (violet/amber, floating)

### Features — split into two sections:
**For Individuals** (white bg, 4 cards):
- AI Tutoring, Digital Library, Progress Tracking, Parent Portal

**For Institutions** (violet-50 bg, 6 cards):
- AI Exam Generator, Automated Unbiased Grading, Attendance System, Course Management, School Administration, Content Management

### Dashboards section
- "Individuals" row: Students, Parents (white cards)
- Dashed divider
- "Institutions" row: Teachers, School Admin (violet-50 cards)

### Other sections
- How It Works (3 steps)
- Testimonials (3 cards)
- Pricing (Starter ₹2,999 / Growth ₹7,999 / Enterprise Custom)
- CTA banner

---

## `app/api/tutor/route.ts` — AI Tutor API

Accepts POST `{ image, mimeType, question, model }`:
- `model: "openai"` → GPT-4o via OpenAI SDK
- Default → Claude claude-opus-4-5-20251101 via Anthropic SDK

Returns JSON: `{ answer, explanation: string[], applications: string[] }`

Both models use the same `SYSTEM_PROMPT` (Indian school tutor, CBSE/ICSE, structured JSON output).

---

## `app/dashboard/student/library/page.tsx` & `app/dashboard/teacher/library/page.tsx`

### Domain Tabs (5 tabs)
```ts
const DOMAINS = [
  'School Education',
  'Higher Education',
  'International Languages',   // ← Added between Higher Ed and Research
  'Research',
  'Vocational'
]
```

### Browse Data
```ts
const BROWSE_DATA = {
  subjects: [20 subjects — Physics, Chemistry, Maths, Biology, Geography, Commerce, History, Vocational Studies, General Science, Economics, The Arts, Computer Science, Political Science, English, Regional Languages, Psychology, Sociology, Physical Education, Fine Arts, Home Science],

  levels: [Class I through XII, JEE Main Preparatory, JEE Advanced Preparatory, NEET (UG) Preparatory, Diploma, Undergraduate, Postgraduate],

  languages: [
    'English','Assamese','Bengali','Bodo','Dogri','Gujarati','Hindi',
    'Kannada','Kashmiri','Konkani','Maithili','Malayalam','Manipuri',
    'Marathi','Nepali','Odia','Punjabi','Sanskrit','Santali','Sindhi',
    'Tamil','Telugu','Urdu'
  ],  // 23 Indian languages

  boards: [CBSE, ICSE + 26 state boards from Andhra Pradesh to West Bengal],
}
```

### Browse Grid (NDL-style, 4 panels in 2×2)
- Subjects · Educational Levels · Contents in Indian Languages · State Boards
- Each panel: 3-col clickable link list, "View More" button

### Left Sidebar Facets (when browseMode=true)
- Subject, Class/Level, Resource Type, Language, Board, Content Provider
- Each facet: expand/collapse, checkbox-style selection

### Book cards: grid or list view toggle (LayoutGrid / List icons)

### All 42 books: Class I–XII NCERT + JEE/NEET reference books

---

## `components/dashboard/DashboardShell.tsx`

- Fixed sidebar `w-56`, `bg-white border-r border-gray-100`
- Active nav item: `bg-violet-600 text-white`
- Role pill: `violet-600` text, `violet-50` bg
- User avatar: `bg-violet-100 text-violet-700`
- No gradients anywhere

---

## `components/marketing/Footer.tsx`

- White bg, `border-t border-gray-200`
- 5-col grid: Brand (col-span-2) + Product, Solutions, Company links
- Social icons: Twitter, LinkedIn, YouTube
- Email: hello@curioushat.ai

---

## Known Icon Fixes (lucide-react version limitations)
- `FilePen` → use `FileEdit` ✓
- `Grid3X3` → use `LayoutGrid` ✓

---

## Pending / Future Work
- Create separate dashboard routes for State / CBSE / IB / IGCSE (currently all → `/dashboard/govt`)
- "International Languages" tab content in library (currently shows same browse grid as other tabs)
- Connect real auth (currently dashboards are accessible without login)
- Hook up real database for books, courses, users
- AI Exam Generator, OCR Grader pages still to be built
