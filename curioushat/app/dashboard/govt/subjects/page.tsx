'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, TrendingUp, TrendingDown, AlertTriangle, ChevronDown } from 'lucide-react'

const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Language (Marathi/Hindi)']

// State-wide subject performance across districts
const districtSubjectData = [
  { district: 'Pune', math: 74.1, sci: 79.2, eng: 81.3, soc: 83.4, lang: 85.2, rank: 1 },
  { district: 'Nashik', math: 71.3, sci: 77.4, eng: 78.6, soc: 80.1, lang: 82.4, rank: 2 },
  { district: 'Mumbai', math: 70.8, sci: 75.6, eng: 76.4, soc: 78.2, lang: 80.1, rank: 3 },
  { district: 'Thane', math: 69.4, sci: 74.2, eng: 75.8, soc: 77.4, lang: 79.2, rank: 4 },
  { district: 'Aurangabad', math: 64.2, sci: 70.3, eng: 72.8, soc: 74.1, lang: 76.8, rank: 5 },
  { district: 'Nagpur', math: 63.8, sci: 69.8, eng: 71.4, soc: 73.2, lang: 75.4, rank: 6 },
  { district: 'Solapur', math: 60.3, sci: 66.8, eng: 67.9, soc: 69.4, lang: 72.1, rank: 7 },
  { district: 'Nandurbar', math: 52.1, sci: 59.4, eng: 61.2, soc: 63.8, lang: 67.4, rank: 8 },
  { district: 'Gadchiroli', math: 48.3, sci: 55.1, eng: 57.8, soc: 60.2, lang: 64.1, rank: 9 },
]

const subjectInsights = [
  {
    subject: 'Mathematics',
    stateAvg: 64.2,
    passRate: 82.1,
    yoy: -1.2,
    weakDistricts: ['Gadchiroli', 'Nandurbar', 'Solapur', 'Osmanabad'],
    topDistricts: ['Pune', 'Nashik', 'Mumbai'],
    insight: 'Mathematics remains the most challenging subject state-wide. The gap between top and bottom performers is 25.8 percentage points. Gadchiroli and Nandurbar are critical — less than 50% average. AI-based remedial tutoring is recommended for Class 8–10 in 847 flagged schools.',
    color: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  {
    subject: 'Science',
    stateAvg: 69.8,
    passRate: 87.4,
    yoy: +1.8,
    weakDistricts: ['Gadchiroli', 'Nandurbar'],
    topDistricts: ['Pune', 'Nashik', 'Thane'],
    insight: 'Science performance has improved 1.8% YoY, driven by the introduction of lab equipment in 400+ government schools. Practical exam scores are significantly higher than theory. Focus areas: optics (Class 10) and periodic table (Class 9).',
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    subject: 'English',
    stateAvg: 72.1,
    passRate: 89.3,
    yoy: +2.4,
    weakDistricts: ['Gadchiroli', 'Nandurbar'],
    topDistricts: ['Pune', 'Mumbai', 'Nashik'],
    insight: 'English performance shows consistent improvement, largely due to English medium school expansion and digital learning tools. Rural-urban gap is narrowing — tribal area schools show 4.2% improvement this year. Grammar sections still underperform relative to comprehension.',
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    subject: 'Social Science',
    stateAvg: 74.5,
    passRate: 91.2,
    yoy: +0.8,
    weakDistricts: ['Gadchiroli'],
    topDistricts: ['Pune', 'Nashik', 'Kolhapur'],
    insight: 'Social Science continues to be one of the stronger subjects. Maharashtra history component scores highest; Economics and Civics sections need reinforcement. Performance gap between English and Marathi medium schools is 7.2 percentage points.',
    color: 'bg-teal-500',
    lightBg: 'bg-teal-50',
    textColor: 'text-teal-700',
  },
  {
    subject: 'Language',
    stateAvg: 78.3,
    passRate: 93.8,
    yoy: +1.1,
    weakDistricts: [],
    topDistricts: ['Pune', 'Nashik', 'Mumbai'],
    insight: 'Language (Marathi/Hindi) is the best-performing subject state-wide. No district is below 60%. Composition writing scores have improved significantly. Regional dialect differences contribute to minor variations in Northern districts.',
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
]

const yearTrends: Record<string, number[]> = {
  Mathematics: [61.4, 62.8, 63.1, 65.4, 64.2],
  Science: [65.8, 66.4, 67.2, 68.0, 69.8],
  English: [67.2, 68.1, 69.4, 69.7, 72.1],
  'Social Science': [72.8, 73.1, 73.8, 73.7, 74.5],
  'Language (Marathi/Hindi)': [75.4, 76.1, 76.8, 77.2, 78.3],
}
const years = ['2021', '2022', '2023', '2024', '2025']

const scoreColor = (s: number) => s >= 75 ? 'text-emerald-600' : s >= 65 ? 'text-blue-600' : s >= 55 ? 'text-amber-600' : 'text-red-600'
const scoreBg = (s: number) => s >= 75 ? 'bg-emerald-100' : s >= 65 ? 'bg-blue-100' : s >= 55 ? 'bg-amber-100' : 'bg-red-100'
const subjectKey = (s: string) => s === 'Mathematics' ? 'math' : s === 'Science' ? 'sci' : s === 'English' ? 'eng' : s === 'Social Science' ? 'soc' : 'lang'

export default function SubjectAnalysisPage() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const insight = subjectInsights.find(s => s.subject === selectedSubject)!
  const key = subjectKey(selectedSubject) as 'math' | 'sci' | 'eng' | 'soc' | 'lang'
  const trend = yearTrends[selectedSubject] || yearTrends['Mathematics']
  const max = Math.max(...trend)
  const min = Math.min(...trend)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/govt" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-purple-600" /> Subject Analysis
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">State-wide subject performance with district breakdown</p>
        </div>
      </div>

      {/* Subject selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subjectInsights.map(s => (
          <button key={s.subject} onClick={() => setSelectedSubject(s.subject)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${selectedSubject === s.subject ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'}`}>
            <span>{s.subject}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedSubject === s.subject ? 'bg-white/20 text-white' : `${scoreBg(s.stateAvg)} ${scoreColor(s.stateAvg)}`}`}>{s.stateAvg}%</span>
          </button>
        ))}
      </div>

      {/* Subject header card */}
      <div className={`${insight.lightBg} border border-gray-100 rounded-2xl p-6 mb-6`}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className={`text-xl font-black ${insight.textColor} mb-1`}>{insight.subject} — State Analysis</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{insight.insight}</p>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className={`text-3xl font-black ${scoreColor(insight.stateAvg)}`}>{insight.stateAvg}%</div>
              <div className="text-xs text-gray-500">State Avg</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-black ${scoreColor(insight.passRate)}`}>{insight.passRate}%</div>
              <div className="text-xs text-gray-500">Pass Rate</div>
            </div>
            <div className="text-center col-span-2">
              <div className={`flex items-center justify-center gap-1 font-bold text-sm ${insight.yoy >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {insight.yoy >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {insight.yoy >= 0 ? '+' : ''}{insight.yoy}% vs last year
              </div>
            </div>
          </div>
        </div>

        {/* Weak/Strong districts */}
        <div className="flex flex-wrap gap-4 mt-4">
          {insight.weakDistricts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 mb-1">⚠ Weak Districts</p>
              <div className="flex gap-2 flex-wrap">
                {insight.weakDistricts.map(d => (
                  <span key={d} className="text-xs bg-red-100 text-red-700 font-medium px-2.5 py-1 rounded-full">{d}</span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-emerald-600 mb-1">✓ Top Performers</p>
            <div className="flex gap-2 flex-wrap">
              {insight.topDistricts.map(d => (
                <span key={d} className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1 rounded-full">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5-year trend */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="font-bold text-gray-900 mb-4">{selectedSubject} — 5 Year State Trend</h3>
        <div className="flex items-end gap-3 h-32">
          {trend.map((val, i) => {
            const height = ((val - min + 5) / (max - min + 10)) * 100
            return (
              <div key={years[i]} className="flex flex-col items-center gap-1 flex-1">
                <span className={`text-xs font-bold ${scoreColor(val)}`}>{val}%</span>
                <div className="w-full rounded-t-lg" style={{
                  height: `${height}%`,
                  background: val >= 75 ? '#10b981' : val >= 65 ? '#3b82f6' : val >= 55 ? '#f59e0b' : '#ef4444'
                }} />
                <span className="text-xs text-gray-500">{years[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* District breakdown table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">District-wise {selectedSubject} Performance</h3>
        </div>
        <table className="w-full text-sm min-w-[300px] sm:min-w-[500px]">
          <thead className="bg-gray-50">
            <tr>
              {['Rank', 'District', `${selectedSubject} Score`, 'State Avg Comparison', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...districtSubjectData]
              .sort((a, b) => (b[key] as number) - (a[key] as number))
              .map((d, i) => {
                const score = d[key] as number
                const diff = score - insight.stateAvg
                return (
                  <tr key={d.district} className={`hover:bg-gray-50 transition-colors ${score < 55 ? 'bg-red-50/30' : ''}`}>
                    <td className="px-5 py-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i < 3 ? 'bg-amber-100 text-amber-700' : i >= districtSubjectData.length - 2 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{i+1}</span>
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-900">{d.district}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${score >= 75 ? 'bg-emerald-500' : score >= 65 ? 'bg-blue-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${score}%` }} />
                        </div>
                        <span className={`font-black text-sm ${scoreColor(score)}`}>{score}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {score < 55
                        ? <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />Critical</span>
                        : score < 65
                        ? <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded-full">Below Average</span>
                        : score < 75
                        ? <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-full">Average</span>
                        : <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-1 rounded-full">Good</span>}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
