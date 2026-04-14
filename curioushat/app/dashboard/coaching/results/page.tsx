'use client'

import { useState } from 'react'
import { Trophy, TrendingUp, TrendingDown, Clock, Target, BarChart3, ChevronDown, Medal } from 'lucide-react'

const exams = [
  'JEE Mock Test 3 — Apr 2026',
  'NEET Mock Test 2 — Mar 2026',
  'JEE Mock Test 2 — Mar 2026',
  'CLAT Mock 1 — Feb 2026',
  'NDA Mock 1 — Feb 2026',
  'CA Foundation Mock 1 — Jan 2026',
]

const resultsData: Record<string, { totalMarks: number; passPercent: number; students: { rank: number; name: string; batch: string; marks: number; percentile: number; timeTaken: string; improvement: number }[] }> = {
  'JEE Mock Test 3 — Apr 2026': {
    totalMarks: 300,
    passPercent: 65,
    students: [
      { rank: 1, name: 'Arjun Reddy', batch: 'JEE 2027 Kota', marks: 267, percentile: 99.2, timeTaken: '2h 38m', improvement: 12 },
      { rank: 2, name: 'Sneha Patel', batch: 'JEE 2027 Kota', marks: 254, percentile: 98.5, timeTaken: '2h 45m', improvement: 8 },
      { rank: 3, name: 'Rohan Sharma', batch: 'JEE 2027 Dropper', marks: 248, percentile: 97.8, timeTaken: '2h 52m', improvement: -3 },
      { rank: 4, name: 'Priya Menon', batch: 'JEE 2027 Kota', marks: 231, percentile: 95.1, timeTaken: '2h 55m', improvement: 15 },
      { rank: 5, name: 'Karthik Iyer', batch: 'JEE 2027 Dropper', marks: 224, percentile: 93.6, timeTaken: '2h 48m', improvement: 6 },
      { rank: 6, name: 'Ananya Singh', batch: 'JEE 2027 Kota', marks: 218, percentile: 91.2, timeTaken: '2h 58m', improvement: -5 },
      { rank: 7, name: 'Vikram Joshi', batch: 'JEE 2027 Dropper', marks: 205, percentile: 87.4, timeTaken: '2h 50m', improvement: 11 },
      { rank: 8, name: 'Meera Nair', batch: 'JEE 2027 Kota', marks: 198, percentile: 84.3, timeTaken: '2h 59m', improvement: 2 },
      { rank: 9, name: 'Aditya Kulkarni', batch: 'JEE 2027 Dropper', marks: 187, percentile: 79.8, timeTaken: '2h 42m', improvement: -8 },
      { rank: 10, name: 'Divya Gupta', batch: 'JEE 2027 Kota', marks: 176, percentile: 74.1, timeTaken: '2h 56m', improvement: 4 },
      { rank: 11, name: 'Rahul Yadav', batch: 'JEE 2027 Dropper', marks: 162, percentile: 68.5, timeTaken: '2h 35m', improvement: -2 },
      { rank: 12, name: 'Nisha Verma', batch: 'JEE 2027 Kota', marks: 143, percentile: 58.2, timeTaken: '2h 47m', improvement: 7 },
    ],
  },
  'NEET Mock Test 2 — Mar 2026': {
    totalMarks: 720,
    passPercent: 60,
    students: [
      { rank: 1, name: 'Kavya Krishnan', batch: 'NEET 2027', marks: 658, percentile: 99.4, timeTaken: '2h 50m', improvement: 18 },
      { rank: 2, name: 'Siddharth Rao', batch: 'NEET 2027', marks: 641, percentile: 98.7, timeTaken: '2h 55m', improvement: 5 },
      { rank: 3, name: 'Riya Agarwal', batch: 'NEET 2027 Dropper', marks: 623, percentile: 97.5, timeTaken: '3h 02m', improvement: -4 },
      { rank: 4, name: 'Harsh Pandey', batch: 'NEET 2027', marks: 598, percentile: 94.8, timeTaken: '2h 48m', improvement: 22 },
      { rank: 5, name: 'Pooja Deshmukh', batch: 'NEET 2027 Dropper', marks: 576, percentile: 91.3, timeTaken: '2h 58m', improvement: 9 },
      { rank: 6, name: 'Aman Tiwari', batch: 'NEET 2027', marks: 554, percentile: 87.6, timeTaken: '3h 05m', improvement: -7 },
      { rank: 7, name: 'Shruti Mishra', batch: 'NEET 2027', marks: 531, percentile: 83.2, timeTaken: '2h 52m', improvement: 14 },
      { rank: 8, name: 'Nikhil Saxena', batch: 'NEET 2027 Dropper', marks: 508, percentile: 78.1, timeTaken: '3h 10m', improvement: 3 },
      { rank: 9, name: 'Tanvi Kapoor', batch: 'NEET 2027', marks: 487, percentile: 72.5, timeTaken: '2h 45m', improvement: -11 },
      { rank: 10, name: 'Rajat Bhatt', batch: 'NEET 2027 Dropper', marks: 465, percentile: 66.8, timeTaken: '2h 55m', improvement: 6 },
      { rank: 11, name: 'Ishita Jain', batch: 'NEET 2027', marks: 438, percentile: 59.4, timeTaken: '3h 00m', improvement: -2 },
      { rank: 12, name: 'Deepak Chauhan', batch: 'NEET 2027 Dropper', marks: 412, percentile: 52.1, timeTaken: '2h 40m', improvement: 8 },
    ],
  },
}

const medalColors: Record<number, string> = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-amber-700',
}

const medalBg: Record<number, string> = {
  1: 'bg-yellow-50 border-yellow-200',
  2: 'bg-gray-50 border-gray-200',
  3: 'bg-amber-50 border-amber-200',
}

export default function ResultsPage() {
  const [selectedExam, setSelectedExam] = useState(exams[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const data = resultsData[selectedExam]
  const students = data?.students ?? []
  const totalMarks = data?.totalMarks ?? 300

  const topperScore = students.length > 0 ? students[0].marks : 0
  const avg = students.length > 0 ? Math.round(students.reduce((s, r) => s + r.marks, 0) / students.length) : 0
  const sorted = [...students].sort((a, b) => a.marks - b.marks)
  const median = students.length > 0
    ? students.length % 2 === 0
      ? Math.round((sorted[students.length / 2 - 1].marks + sorted[students.length / 2].marks) / 2)
      : sorted[Math.floor(students.length / 2)].marks
    : 0
  const passRate = students.length > 0
    ? Math.round((students.filter(s => (s.marks / totalMarks) * 100 >= (data?.passPercent ?? 50)).length / students.length) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-violet-600" /> Results & Rankings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Test results, batch rankings, and leaderboards</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 px-4 py-2.5 rounded-xl hover:border-violet-300 transition-colors min-w-[260px] justify-between"
          >
            {selectedExam}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1">
              {exams.map(e => (
                <button
                  key={e}
                  onClick={() => { setSelectedExam(e); setDropdownOpen(false) }}
                  className={`block w-full text-left text-sm px-4 py-2.5 hover:bg-violet-50 transition-colors ${e === selectedExam ? 'text-violet-700 font-semibold bg-violet-50' : 'text-gray-700'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-semibold">Topper Score</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{topperScore}<span className="text-sm font-medium text-gray-400">/{totalMarks}</span></p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-semibold">Average Score</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{avg}<span className="text-sm font-medium text-gray-400">/{totalMarks}</span></p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-semibold">Median Score</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{median}<span className="text-sm font-medium text-gray-400">/{totalMarks}</span></p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-semibold">Pass Rate</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{passRate}<span className="text-sm font-medium text-gray-400">%</span></p>
        </div>
      </div>

      {/* Results Table */}
      {students.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3 text-right">Marks</th>
                  <th className="px-5 py-3 text-right">Percentile</th>
                  <th className="px-5 py-3 text-right">Time</th>
                  <th className="px-5 py-3 text-right">vs Last Test</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => (
                  <tr key={s.rank} className={`hover:bg-gray-50 transition-colors ${s.rank <= 3 ? medalBg[s.rank] : ''}`}>
                    <td className="px-5 py-3.5 font-bold text-gray-900 flex items-center gap-2">
                      {s.rank <= 3 ? (
                        <Medal className={`w-5 h-5 ${medalColors[s.rank]}`} />
                      ) : (
                        <span className="w-5 text-center text-gray-400">#{s.rank}</span>
                      )}
                      {s.rank <= 3 && <span>#{s.rank}</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold ${s.rank <= 3 ? 'text-gray-900' : 'text-gray-700'}`}>{s.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-100 text-violet-700">{s.batch}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">{s.marks}<span className="text-gray-400 font-normal">/{totalMarks}</span></td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-700">{s.percentile}%</td>
                    <td className="px-5 py-3.5 text-right text-gray-500 flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5" />{s.timeTaken}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${s.improvement > 0 ? 'text-emerald-600' : s.improvement < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {s.improvement > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : s.improvement < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                        {s.improvement > 0 ? '+' : ''}{s.improvement} marks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">No results available for this exam yet</p>
        </div>
      )}
    </div>
  )
}
