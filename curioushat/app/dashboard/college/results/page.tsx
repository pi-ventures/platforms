'use client'
import { useState } from 'react'
import { GraduationCap, Award, TrendingUp, XCircle } from 'lucide-react'

const semesterResults: Record<string, { name: string; roll: string; physics: number; maths: number; chemistry: number; english: number; cs: number; total: number; cgpa: number; result: string }[]> = {
  'Sem 1': [
    { name: 'Aarav Sharma', roll: 'CS2024001', physics: 82, maths: 91, chemistry: 78, english: 85, cs: 94, total: 430, cgpa: 8.6, result: 'Distinction' },
    { name: 'Diya Patel', roll: 'CS2024002', physics: 76, maths: 88, chemistry: 72, english: 80, cs: 85, total: 401, cgpa: 8.0, result: 'Pass' },
    { name: 'Rohan Reddy', roll: 'CS2024003', physics: 92, maths: 95, chemistry: 88, english: 90, cs: 97, total: 462, cgpa: 9.2, result: 'Distinction' },
    { name: 'Sneha Iyer', roll: 'CS2024004', physics: 45, maths: 38, chemistry: 42, english: 55, cs: 60, total: 240, cgpa: 4.8, result: 'Pass' },
    { name: 'Vikram Singh', roll: 'CS2024005', physics: 30, maths: 28, chemistry: 35, english: 40, cs: 42, total: 175, cgpa: 3.5, result: 'Fail' },
    { name: 'Priya Nair', roll: 'CS2024006', physics: 88, maths: 82, chemistry: 90, english: 86, cs: 92, total: 438, cgpa: 8.8, result: 'Distinction' },
    { name: 'Arjun Mehta', roll: 'CS2024007', physics: 65, maths: 72, chemistry: 60, english: 70, cs: 78, total: 345, cgpa: 6.9, result: 'Pass' },
    { name: 'Kavya Gupta', roll: 'CS2024008', physics: 58, maths: 55, chemistry: 50, english: 62, cs: 68, total: 293, cgpa: 5.9, result: 'Pass' },
  ],
  'Sem 2': [
    { name: 'Aarav Sharma', roll: 'CS2024001', physics: 85, maths: 89, chemistry: 80, english: 88, cs: 96, total: 438, cgpa: 8.8, result: 'Distinction' },
    { name: 'Diya Patel', roll: 'CS2024002', physics: 78, maths: 90, chemistry: 75, english: 82, cs: 88, total: 413, cgpa: 8.3, result: 'Pass' },
    { name: 'Rohan Reddy', roll: 'CS2024003', physics: 90, maths: 93, chemistry: 86, english: 92, cs: 95, total: 456, cgpa: 9.1, result: 'Distinction' },
    { name: 'Sneha Iyer', roll: 'CS2024004', physics: 50, maths: 42, chemistry: 48, english: 58, cs: 65, total: 263, cgpa: 5.3, result: 'Pass' },
    { name: 'Vikram Singh', roll: 'CS2024005', physics: 35, maths: 32, chemistry: 38, english: 45, cs: 48, total: 198, cgpa: 4.0, result: 'Fail' },
    { name: 'Priya Nair', roll: 'CS2024006', physics: 90, maths: 85, chemistry: 92, english: 88, cs: 94, total: 449, cgpa: 9.0, result: 'Distinction' },
    { name: 'Arjun Mehta', roll: 'CS2024007', physics: 68, maths: 75, chemistry: 63, english: 72, cs: 80, total: 358, cgpa: 7.2, result: 'Pass' },
    { name: 'Kavya Gupta', roll: 'CS2024008', physics: 60, maths: 58, chemistry: 55, english: 65, cs: 72, total: 310, cgpa: 6.2, result: 'Pass' },
  ],
  'Sem 3': [
    { name: 'Aarav Sharma', roll: 'CS2024001', physics: 80, maths: 93, chemistry: 82, english: 86, cs: 92, total: 433, cgpa: 8.7, result: 'Distinction' },
    { name: 'Diya Patel', roll: 'CS2024002', physics: 74, maths: 85, chemistry: 70, english: 78, cs: 82, total: 389, cgpa: 7.8, result: 'Pass' },
    { name: 'Rohan Reddy', roll: 'CS2024003', physics: 94, maths: 97, chemistry: 90, english: 91, cs: 98, total: 470, cgpa: 9.4, result: 'Distinction' },
    { name: 'Sneha Iyer', roll: 'CS2024004', physics: 52, maths: 45, chemistry: 48, english: 60, cs: 62, total: 267, cgpa: 5.3, result: 'Pass' },
    { name: 'Vikram Singh', roll: 'CS2024005', physics: 40, maths: 35, chemistry: 42, english: 48, cs: 50, total: 215, cgpa: 4.3, result: 'Pass' },
    { name: 'Priya Nair', roll: 'CS2024006', physics: 86, maths: 88, chemistry: 94, english: 84, cs: 90, total: 442, cgpa: 8.8, result: 'Distinction' },
    { name: 'Arjun Mehta', roll: 'CS2024007', physics: 70, maths: 78, chemistry: 66, english: 74, cs: 82, total: 370, cgpa: 7.4, result: 'Pass' },
    { name: 'Kavya Gupta', roll: 'CS2024008', physics: 62, maths: 60, chemistry: 56, english: 68, cs: 74, total: 320, cgpa: 6.4, result: 'Pass' },
  ],
  'Sem 4': [
    { name: 'Aarav Sharma', roll: 'CS2024001', physics: 84, maths: 90, chemistry: 80, english: 87, cs: 95, total: 436, cgpa: 8.7, result: 'Distinction' },
    { name: 'Diya Patel', roll: 'CS2024002', physics: 80, maths: 86, chemistry: 76, english: 84, cs: 90, total: 416, cgpa: 8.3, result: 'Pass' },
    { name: 'Rohan Reddy', roll: 'CS2024003', physics: 91, maths: 96, chemistry: 89, english: 93, cs: 96, total: 465, cgpa: 9.3, result: 'Distinction' },
    { name: 'Sneha Iyer', roll: 'CS2024004', physics: 55, maths: 48, chemistry: 52, english: 62, cs: 66, total: 283, cgpa: 5.7, result: 'Pass' },
    { name: 'Vikram Singh', roll: 'CS2024005', physics: 32, maths: 30, chemistry: 34, english: 42, cs: 45, total: 183, cgpa: 3.7, result: 'Fail' },
    { name: 'Priya Nair', roll: 'CS2024006', physics: 92, maths: 86, chemistry: 88, english: 90, cs: 96, total: 452, cgpa: 9.0, result: 'Distinction' },
    { name: 'Arjun Mehta', roll: 'CS2024007', physics: 66, maths: 74, chemistry: 62, english: 70, cs: 76, total: 348, cgpa: 7.0, result: 'Pass' },
    { name: 'Kavya Gupta', roll: 'CS2024008', physics: 56, maths: 54, chemistry: 50, english: 60, cs: 66, total: 286, cgpa: 5.7, result: 'Pass' },
  ],
  'Sem 5': [
    { name: 'Aarav Sharma', roll: 'CS2024001', physics: 86, maths: 92, chemistry: 84, english: 88, cs: 97, total: 447, cgpa: 8.9, result: 'Distinction' },
    { name: 'Diya Patel', roll: 'CS2024002', physics: 82, maths: 88, chemistry: 78, english: 86, cs: 92, total: 426, cgpa: 8.5, result: 'Distinction' },
    { name: 'Rohan Reddy', roll: 'CS2024003', physics: 93, maths: 98, chemistry: 91, english: 94, cs: 99, total: 475, cgpa: 9.5, result: 'Distinction' },
    { name: 'Sneha Iyer', roll: 'CS2024004', physics: 58, maths: 52, chemistry: 55, english: 64, cs: 70, total: 299, cgpa: 6.0, result: 'Pass' },
    { name: 'Vikram Singh', roll: 'CS2024005', physics: 42, maths: 38, chemistry: 40, english: 50, cs: 55, total: 225, cgpa: 4.5, result: 'Pass' },
    { name: 'Priya Nair', roll: 'CS2024006', physics: 90, maths: 88, chemistry: 92, english: 86, cs: 94, total: 450, cgpa: 9.0, result: 'Distinction' },
    { name: 'Arjun Mehta', roll: 'CS2024007', physics: 72, maths: 80, chemistry: 68, english: 76, cs: 84, total: 380, cgpa: 7.6, result: 'Pass' },
    { name: 'Kavya Gupta', roll: 'CS2024008', physics: 64, maths: 62, chemistry: 58, english: 70, cs: 76, total: 330, cgpa: 6.6, result: 'Pass' },
  ],
  'Sem 6': [
    { name: 'Aarav Sharma', roll: 'CS2024001', physics: 88, maths: 94, chemistry: 86, english: 90, cs: 98, total: 456, cgpa: 9.1, result: 'Distinction' },
    { name: 'Diya Patel', roll: 'CS2024002', physics: 84, maths: 90, chemistry: 80, english: 88, cs: 94, total: 436, cgpa: 8.7, result: 'Distinction' },
    { name: 'Rohan Reddy', roll: 'CS2024003', physics: 95, maths: 99, chemistry: 93, english: 96, cs: 100, total: 483, cgpa: 9.7, result: 'Distinction' },
    { name: 'Sneha Iyer', roll: 'CS2024004', physics: 60, maths: 55, chemistry: 58, english: 66, cs: 72, total: 311, cgpa: 6.2, result: 'Pass' },
    { name: 'Vikram Singh', roll: 'CS2024005', physics: 44, maths: 40, chemistry: 42, english: 52, cs: 58, total: 236, cgpa: 4.7, result: 'Pass' },
    { name: 'Priya Nair', roll: 'CS2024006', physics: 92, maths: 90, chemistry: 94, english: 88, cs: 96, total: 460, cgpa: 9.2, result: 'Distinction' },
    { name: 'Arjun Mehta', roll: 'CS2024007', physics: 74, maths: 82, chemistry: 70, english: 78, cs: 86, total: 390, cgpa: 7.8, result: 'Pass' },
    { name: 'Kavya Gupta', roll: 'CS2024008', physics: 66, maths: 64, chemistry: 60, english: 72, cs: 78, total: 340, cgpa: 6.8, result: 'Pass' },
  ],
}

const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6']

export default function ResultsPage() {
  const [activeSem, setActiveSem] = useState('Sem 1')
  const results = semesterResults[activeSem]

  const appeared = results.length
  const passed = results.filter(r => r.result === 'Pass').length
  const distinction = results.filter(r => r.result === 'Distinction').length
  const failed = results.filter(r => r.result === 'Fail').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-indigo-600" /> Semester Results
        </h1>
        <p className="text-gray-500 mt-1 text-sm">View semester-wise student results and performance summary</p>
      </div>

      {/* Semester Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {semesters.map(sem => (
          <button
            key={sem}
            onClick={() => setActiveSem(sem)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeSem === sem ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {sem}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-medium">Appeared</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{appeared}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Passed</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{passed}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-medium">Distinction</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{distinction}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Failed</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{failed}</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Roll No</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Student Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Physics</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Maths</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Chemistry</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">English</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">CS</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">CGPA</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.map((s, i) => (
                <tr key={s.roll} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{s.roll}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{s.name}</td>
                  <td className={`py-3 px-4 text-center ${s.physics < 40 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{s.physics}</td>
                  <td className={`py-3 px-4 text-center ${s.maths < 40 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{s.maths}</td>
                  <td className={`py-3 px-4 text-center ${s.chemistry < 40 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{s.chemistry}</td>
                  <td className={`py-3 px-4 text-center ${s.english < 40 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{s.english}</td>
                  <td className={`py-3 px-4 text-center ${s.cs < 40 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{s.cs}</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">{s.total}/500</td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-600">{s.cgpa}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      s.result === 'Distinction' ? 'bg-indigo-100 text-indigo-700' :
                      s.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {s.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
