import { DollarSign, TrendingUp, AlertCircle, Download, CheckCircle2 } from 'lucide-react'

const feeCollections = [
  { class: '6', total: 125, paid: 122, pending: 3, amount: '₹22,57,500', collected: '₹22,02,000' },
  { class: '7', total: 132, paid: 130, pending: 2, amount: '₹23,76,000', collected: '₹23,40,000' },
  { class: '8', total: 168, paid: 161, pending: 7, amount: '₹30,24,000', collected: '₹28,98,000' },
  { class: '9', total: 175, paid: 168, pending: 7, amount: '₹31,50,000', collected: '₹30,24,000' },
  { class: '10', total: 180, paid: 174, pending: 6, amount: '₹32,40,000', collected: '₹31,32,000' },
]

const defaulters = [
  { name: 'Ramesh Patel (Cl.8)', due: '₹9,000', since: 'Feb 2026', contact: '98765 43210' },
  { name: 'Sunita Roy (Cl.10)', due: '₹18,500', since: 'Jan 2026', contact: '87654 32109' },
  { name: 'Arjun Singh (Cl.9)', due: '₹9,000', since: 'Feb 2026', contact: '76543 21098' },
  { name: 'Pooja Yadav (Cl.7)', due: '₹18,500', since: 'Jan 2026', contact: '65432 10987' },
]

export default function FeesPage() {
  const totalCollected = 13596000
  const totalDue = 1850000
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Fee Management</h1>
          <p className="text-gray-500 mt-1">March 2026 Collection Summary</p>
        </div>
        <button className="flex items-center gap-2 border border-indigo-200 text-indigo-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <p className="text-emerald-200 text-sm mb-1">Total Collected</p>
          <p className="text-3xl font-black">₹1.36 Cr</p>
          <p className="text-emerald-200 text-xs mt-1">92% of target</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Outstanding</p>
          <p className="text-3xl font-black text-red-600">₹11.4L</p>
          <p className="text-gray-400 text-xs mt-1">25 defaulters</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Today's Collection</p>
          <p className="text-3xl font-black text-gray-900">₹1.2L</p>
          <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 47 payments</p>
        </div>
      </div>

      {/* Class-wise */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Class-wise Collection</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Class', 'Total Students', 'Paid', 'Pending', 'Billed', 'Collected', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {feeCollections.map(f => (
                <tr key={f.class} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-bold text-gray-900">Class {f.class}</td>
                  <td className="px-5 py-4 text-gray-700">{f.total}</td>
                  <td className="px-5 py-4"><span className="text-emerald-600 font-semibold">{f.paid}</span></td>
                  <td className="px-5 py-4"><span className={f.pending > 5 ? 'text-red-500 font-semibold' : 'text-amber-600 font-semibold'}>{f.pending}</span></td>
                  <td className="px-5 py-4 text-gray-700">{f.amount}</td>
                  <td className="px-5 py-4 font-bold text-gray-900">{f.collected}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(f.paid/f.total)*100}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{Math.round((f.paid/f.total)*100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defaulters */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-red-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h2 className="font-bold text-gray-900">Fee Defaulters</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {defaulters.map(d => (
            <div key={d.name} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-gray-900 text-sm">{d.name}</p>
                <p className="text-xs text-gray-400">Outstanding since {d.since} · {d.contact}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-red-600">{d.due}</span>
                <button className="text-xs bg-red-50 text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">Send Reminder</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
