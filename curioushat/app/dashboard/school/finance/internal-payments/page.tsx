'use client'
import { useState } from 'react'
import { Search, Filter, Download, CheckCircle2, Clock, AlertCircle, Users, Banknote, Calendar, ChevronDown, Eye } from 'lucide-react'

type PaymentStatus = 'paid' | 'pending' | 'processing' | 'failed'
type StaffCategory = 'all' | 'teaching' | 'non-teaching' | 'admin' | 'contract'

interface StaffPayment {
  id: string
  name: string
  role: string
  category: StaffCategory
  department: string
  basicSalary: number
  hra: number
  da: number
  special: number
  pf: number
  tds: number
  professionalTax: number
  netPay: number
  status: PaymentStatus
  payDate: string
  bankAccount: string
  panCard: string
}

const staffPayments: StaffPayment[] = [
  { id: 'EMP001', name: 'Mr. Rajesh Sharma', role: 'HOD - Mathematics', category: 'teaching', department: 'Science & Maths', basicSalary: 62000, hra: 12400, da: 6200, special: 5000, pf: 7440, tds: 5200, professionalTax: 200, netPay: 72760, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'HDFC ****4521', panCard: 'ABCPS****K' },
  { id: 'EMP002', name: 'Ms. Priya Gupta', role: 'PGT - Physics', category: 'teaching', department: 'Science & Maths', basicSalary: 55000, hra: 11000, da: 5500, special: 3000, pf: 6600, tds: 4100, professionalTax: 200, netPay: 63600, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'SBI ****7890', panCard: 'DEFPG****L' },
  { id: 'EMP003', name: 'Mr. Suresh Kumar', role: 'TGT - Computer Science', category: 'teaching', department: 'Technology', basicSalary: 45000, hra: 9000, da: 4500, special: 2000, pf: 5400, tds: 2800, professionalTax: 200, netPay: 52100, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'ICICI ****3456', panCard: 'GHIJK****M' },
  { id: 'EMP004', name: 'Ms. Fatima Khan', role: 'TGT - English', category: 'teaching', department: 'Languages', basicSalary: 48000, hra: 9600, da: 4800, special: 2500, pf: 5760, tds: 3200, professionalTax: 200, netPay: 55740, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'Axis ****6789', panCard: 'LMNOP****N' },
  { id: 'EMP005', name: 'Mr. Arun Iyer', role: 'Lab Assistant', category: 'non-teaching', department: 'Science Lab', basicSalary: 28000, hra: 5600, da: 2800, special: 1000, pf: 3360, tds: 800, professionalTax: 200, netPay: 33040, status: 'processing', payDate: '—', bankAccount: 'BOB ****1234', panCard: 'QRSTU****P' },
  { id: 'EMP006', name: 'Mrs. Kavita Patil', role: 'Office Manager', category: 'admin', department: 'Administration', basicSalary: 38000, hra: 7600, da: 3800, special: 2000, pf: 4560, tds: 1800, professionalTax: 200, netPay: 44840, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'PNB ****5678', panCard: 'VWXYZ****Q' },
  { id: 'EMP007', name: 'Mr. Deepak Verma', role: 'Security Supervisor', category: 'non-teaching', department: 'Security', basicSalary: 22000, hra: 4400, da: 2200, special: 500, pf: 2640, tds: 0, professionalTax: 200, netPay: 26260, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'UCO ****9012', panCard: 'ABCDE****R' },
  { id: 'EMP008', name: 'Ms. Anita Das', role: 'School Nurse', category: 'non-teaching', department: 'Medical', basicSalary: 32000, hra: 6400, da: 3200, special: 1500, pf: 3840, tds: 1200, professionalTax: 200, netPay: 37860, status: 'pending', payDate: '—', bankAccount: 'Kotak ****3456', panCard: 'FGHIJ****S' },
  { id: 'EMP009', name: 'Mr. Rahul Tiwari', role: 'Bus Driver', category: 'contract', department: 'Transport', basicSalary: 20000, hra: 0, da: 2000, special: 1500, pf: 0, tds: 0, professionalTax: 200, netPay: 23300, status: 'paid', payDate: '22 Mar 2026', bankAccount: 'SBI ****7812', panCard: 'KLMNO****T' },
  { id: 'EMP010', name: 'Mrs. Geeta Joshi', role: 'Librarian', category: 'non-teaching', department: 'Library', basicSalary: 35000, hra: 7000, da: 3500, special: 1500, pf: 4200, tds: 1500, professionalTax: 200, netPay: 41100, status: 'failed', payDate: '—', bankAccount: 'IDBI ****2345', panCard: 'PQRST****U' },
]

const bonuses = [
  { name: 'Diwali Bonus (Oct 2025)', staff: 78, amount: 1560000, status: 'Disbursed', date: '12 Oct 2025' },
  { name: 'Performance Bonus Q3', staff: 24, amount: 480000, status: 'Disbursed', date: '15 Jan 2026' },
  { name: 'Annual Increment (Apr 2026)', staff: 78, amount: 0, status: 'Upcoming', date: '01 Apr 2026' },
]

const stipends = [
  { name: 'B.Ed Trainee — Ms. Renu Arora', amount: 15000, months: 'Jan–Mar 2026', status: 'Active' },
  { name: 'B.Ed Trainee — Mr. Sanjay Mehra', amount: 15000, months: 'Jan–Mar 2026', status: 'Active' },
  { name: 'IT Intern — Akash Reddy', amount: 10000, months: 'Feb–Apr 2026', status: 'Active' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

const statusConfig: Record<PaymentStatus, { label: string; bg: string; icon: typeof CheckCircle2 }> = {
  paid: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-700', icon: Clock },
  processing: { label: 'Processing', bg: 'bg-blue-50 text-blue-700', icon: Clock },
  failed: { label: 'Failed', bg: 'bg-red-50 text-red-700', icon: AlertCircle },
}

export default function InternalPaymentsPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<StaffCategory>('all')
  const [selectedPayslip, setSelectedPayslip] = useState<StaffPayment | null>(null)

  const filtered = staffPayments.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter
    return matchSearch && matchCat
  })

  const totalDisbursed = staffPayments.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.netPay, 0)
  const totalPending = staffPayments.filter(s => s.status !== 'paid').reduce((sum, s) => sum + s.netPay, 0)
  const totalStaff = staffPayments.length

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2"><Users className="w-4 h-4" /> Total Staff</div>
          <p className="text-2xl font-black text-gray-900">{totalStaff}</p>
          <p className="text-xs text-gray-400 mt-1">Teaching + Non-teaching + Contract</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2"><Banknote className="w-4 h-4" /> March Payroll</div>
          <p className="text-2xl font-black text-gray-900">{fmt(totalDisbursed + totalPending)}</p>
          <p className="text-xs text-gray-400 mt-1">Gross disbursement</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium mb-2"><CheckCircle2 className="w-4 h-4" /> Paid</div>
          <p className="text-2xl font-black text-emerald-700">{fmt(totalDisbursed)}</p>
          <p className="text-xs text-emerald-600 mt-1">{staffPayments.filter(s => s.status === 'paid').length} staff members</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-medium mb-2"><Clock className="w-4 h-4" /> Pending / Failed</div>
          <p className="text-2xl font-black text-amber-700">{fmt(totalPending)}</p>
          <p className="text-xs text-amber-600 mt-1">{staffPayments.filter(s => s.status !== 'paid').length} staff members</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'teaching', 'non-teaching', 'admin', 'contract'] as StaffCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'All Staff' : cat.replace('-', '-')}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Salary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">March 2026 — Staff Salary Register</h2>
          <button className="flex items-center gap-2 text-xs text-indigo-600 font-medium hover:underline"><Download className="w-3.5 h-3.5" /> Download Payroll</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Staff Name', 'Role', 'Department', 'Basic', 'Additions', 'Deductions', 'Net Pay', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => {
                const sc = statusConfig[s.status]
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.role}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.department}</td>
                    <td className="px-4 py-3 text-gray-700">₹{s.basicSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-emerald-600 text-xs">+₹{(s.hra + s.da + s.special).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-500 text-xs">-₹{(s.pf + s.tds + s.professionalTax).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{s.netPay.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg}`}>
                        <sc.icon className="w-3 h-3" /> {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedPayslip(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="View Payslip">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPayslip(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Payslip — March 2026</h3>
              <button onClick={() => setSelectedPayslip(null)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
            </div>
            <div className="border-b border-gray-100 pb-4 mb-4">
              <p className="font-semibold text-gray-900">{selectedPayslip.name}</p>
              <p className="text-sm text-gray-500">{selectedPayslip.role} · {selectedPayslip.department}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {selectedPayslip.id} · PAN: {selectedPayslip.panCard} · {selectedPayslip.bankAccount}</p>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Earnings</p>
              <div className="flex justify-between"><span className="text-gray-600">Basic Salary</span><span className="font-medium">₹{selectedPayslip.basicSalary.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">HRA</span><span className="font-medium">₹{selectedPayslip.hra.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">DA</span><span className="font-medium">₹{selectedPayslip.da.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Special Allowance</span><span className="font-medium">₹{selectedPayslip.special.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between font-semibold border-t border-gray-100 pt-2"><span>Gross</span><span>₹{(selectedPayslip.basicSalary + selectedPayslip.hra + selectedPayslip.da + selectedPayslip.special).toLocaleString('en-IN')}</span></div>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deductions</p>
              <div className="flex justify-between"><span className="text-gray-600">PF (12%)</span><span className="text-red-500">-₹{selectedPayslip.pf.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">TDS</span><span className="text-red-500">-₹{selectedPayslip.tds.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Professional Tax</span><span className="text-red-500">-₹{selectedPayslip.professionalTax.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center">
              <span className="font-bold text-indigo-900">Net Pay</span>
              <span className="text-2xl font-black text-indigo-700">₹{selectedPayslip.netPay.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bonuses & Stipends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Bonuses & Increments</h2>
          <div className="space-y-3">
            {bonuses.map(b => (
              <div key={b.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.staff} staff · {b.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{b.amount > 0 ? fmt(b.amount) : '—'}</p>
                  <span className={`text-xs font-medium ${b.status === 'Disbursed' ? 'text-emerald-600' : 'text-amber-600'}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Stipends & Trainee Payments</h2>
          <div className="space-y-3">
            {stipends.map(s => (
              <div key={s.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.months}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{s.amount.toLocaleString('en-IN')}/mo</p>
                  <span className="text-xs font-medium text-emerald-600">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
