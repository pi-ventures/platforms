'use client'
import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, DollarSign, Download, Database } from 'lucide-react'

const MOCK_FEE_SCHEDULE = [
  { installment: 'Term 1 (April)', amount: 18500, dueDate: 'Apr 10, 2025', status: 'paid', paidOn: 'Apr 5, 2025', txnId: 'TXN202504050001' },
  { installment: 'Term 2 (July)', amount: 18500, dueDate: 'Jul 10, 2025', status: 'paid', paidOn: 'Jul 8, 2025', txnId: 'TXN202507080023' },
  { installment: 'Term 3 (October)', amount: 18500, dueDate: 'Oct 10, 2025', status: 'paid', paidOn: 'Oct 7, 2025', txnId: 'TXN202510070011' },
  { installment: 'Term 4 (January)', amount: 18500, dueDate: 'Jan 10, 2026', status: 'paid', paidOn: 'Jan 9, 2026', txnId: 'TXN202601090005' },
  { installment: 'Annual Day / Activity', amount: 3500, dueDate: 'Feb 1, 2026', status: 'paid', paidOn: 'Jan 30, 2026', txnId: 'TXN202601300008' },
  { installment: 'Mar Miscellaneous', amount: 2000, dueDate: 'Mar 15, 2026', status: 'due', paidOn: null, txnId: null },
]

export default function FeesPage() {
  const [feeSchedule, setFeeSchedule] = useState(MOCK_FEE_SCHEDULE)
  const [source, setSource] = useState<'db' | 'mock'>('mock')

  useEffect(() => {
    async function load() {
      try {
        // schoolId=1 as default — in prod this comes from auth context
        const res = await fetch('/api/fees/school/1')
        if (!res.ok) throw new Error('fees fetch failed')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setFeeSchedule(data)
          setSource('db')
        } else if (data.fees && Array.isArray(data.fees) && data.fees.length > 0) {
          setFeeSchedule(data.fees)
          setSource('db')
        }
      } catch {
        // Fall back to mock data (already set as default)
      }
    }
    load()
  }, [])

  const total = feeSchedule.reduce((acc, f) => acc + f.amount, 0)
  const paid = feeSchedule.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0)
  const due = total - paid
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Fees & Payments</h1>
        <p className="text-gray-500 mt-1">Om Aditya Raghuvanshi · Class 10-A · Session 2025–26</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Fees</p>
          <p className="text-2xl font-black text-gray-900">₹{total.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
          <p className="text-xs text-emerald-600 mb-1">Paid</p>
          <p className="text-2xl font-black text-emerald-700">₹{paid.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl p-5 border shadow-sm ${due > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
          <p className={`text-xs mb-1 ${due > 0 ? 'text-red-600' : 'text-gray-500'}`}>Outstanding</p>
          <p className={`text-2xl font-black ${due > 0 ? 'text-red-600' : 'text-gray-400'}`}>₹{due.toLocaleString()}</p>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Fee Schedule</h2>
          <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
            <Download className="w-4 h-4" /> Download All Receipts
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {feeSchedule.map(f => (
            <div key={f.installment} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${f.status === 'paid' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {f.status === 'paid' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-red-500" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{f.installment}</p>
                  <p className="text-xs text-gray-400">{f.status === 'paid' ? `Paid on ${f.paidOn}` : `Due: ${f.dueDate}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">₹{f.amount.toLocaleString()}</span>
                {f.status === 'paid' ? (
                  <button className="text-xs text-indigo-600 hover:underline">Receipt</button>
                ) : (
                  <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">Pay Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
