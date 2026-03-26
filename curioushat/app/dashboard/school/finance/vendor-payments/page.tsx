'use client'
import { useState } from 'react'
import { Search, Download, CheckCircle2, Clock, AlertCircle, Truck, FileText, Plus, IndianRupee, Calendar, Building2, Phone, Mail } from 'lucide-react'

type VendorStatus = 'active' | 'inactive'
type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'disputed'

interface Vendor {
  id: string
  name: string
  category: string
  gstin: string
  contact: string
  email: string
  status: VendorStatus
  totalPaid: number
  pendingAmount: number
  lastPayment: string
}

interface Invoice {
  id: string
  vendorName: string
  vendorId: string
  description: string
  amount: number
  gst: number
  total: number
  invoiceDate: string
  dueDate: string
  status: InvoiceStatus
  paymentMode: string
}

const vendors: Vendor[] = [
  { id: 'VND001', name: 'Navneet Suppliers Pvt Ltd', category: 'Lab Equipment', gstin: '27AABCN1234F1Z5', contact: '98765 43210', email: 'sales@navneet-lab.in', status: 'active', totalPaid: 845000, pendingAmount: 145000, lastPayment: '18 Mar 2026' },
  { id: 'VND002', name: 'Blue Star Ltd', category: 'AC & HVAC Maintenance', gstin: '27AAACB0123K1ZX', contact: '87654 32109', email: 'service@bluestar.com', status: 'active', totalPaid: 520000, pendingAmount: 65000, lastPayment: '14 Mar 2026' },
  { id: 'VND003', name: 'Ajanta Paper Works', category: 'Stationery & Printing', gstin: '27AADCA4567P1Z2', contact: '76543 21098', email: 'orders@ajantapaper.in', status: 'active', totalPaid: 312000, pendingAmount: 32000, lastPayment: '10 Mar 2026' },
  { id: 'VND004', name: 'Sodexo India Pvt Ltd', category: 'Canteen Services', gstin: '27AABCS7890R1Z4', contact: '65432 10987', email: 'contract@sodexo.in', status: 'active', totalPaid: 960000, pendingAmount: 80000, lastPayment: '05 Mar 2026' },
  { id: 'VND005', name: 'Eureka Forbes Ltd', category: 'Water Purifiers', gstin: '27AAACE1234H1Z7', contact: '54321 09876', email: 'b2b@eurekaforbes.com', status: 'active', totalPaid: 175000, pendingAmount: 0, lastPayment: '28 Feb 2026' },
  { id: 'VND006', name: 'Schneider Electric India', category: 'Electrical & UPS', gstin: '27AABCS5678E1Z1', contact: '43210 98765', email: 'support@se.com', status: 'active', totalPaid: 280000, pendingAmount: 42000, lastPayment: '22 Feb 2026' },
  { id: 'VND007', name: 'Clean India Services', category: 'Housekeeping', gstin: '27AADCC8901K1Z3', contact: '32109 87654', email: 'ops@cleanindia.co.in', status: 'active', totalPaid: 720000, pendingAmount: 60000, lastPayment: '01 Mar 2026' },
  { id: 'VND008', name: 'Future Tech Solutions', category: 'IT & Software', gstin: '27AABCF2345T1Z6', contact: '21098 76543', email: 'support@futuretech.in', status: 'inactive', totalPaid: 185000, pendingAmount: 0, lastPayment: '15 Dec 2025' },
]

const invoices: Invoice[] = [
  { id: 'INV-4892', vendorName: 'Navneet Suppliers Pvt Ltd', vendorId: 'VND001', description: 'Chemistry lab reagents & glassware — Q4 order', amount: 122881, gst: 22119, total: 145000, invoiceDate: '12 Mar 2026', dueDate: '26 Mar 2026', status: 'pending', paymentMode: '—' },
  { id: 'INV-4871', vendorName: 'Sodexo India Pvt Ltd', vendorId: 'VND004', description: 'Canteen operations — March 2026', amount: 67797, gst: 12203, total: 80000, invoiceDate: '01 Mar 2026', dueDate: '25 Mar 2026', status: 'overdue', paymentMode: '—' },
  { id: 'INV-4856', vendorName: 'Blue Star Ltd', vendorId: 'VND002', description: 'Annual MC — admin block + science wing', amount: 55085, gst: 9915, total: 65000, invoiceDate: '10 Mar 2026', dueDate: '31 Mar 2026', status: 'pending', paymentMode: '—' },
  { id: 'INV-4840', vendorName: 'Clean India Services', vendorId: 'VND007', description: 'Housekeeping contract — March 2026', amount: 50847, gst: 9153, total: 60000, invoiceDate: '01 Mar 2026', dueDate: '15 Mar 2026', status: 'paid', paymentMode: 'NEFT' },
  { id: 'INV-4835', vendorName: 'Schneider Electric India', vendorId: 'VND006', description: 'UPS battery replacement — server room', amount: 35593, gst: 6407, total: 42000, invoiceDate: '18 Feb 2026', dueDate: '04 Mar 2026', status: 'paid', paymentMode: 'NEFT' },
  { id: 'INV-4820', vendorName: 'Ajanta Paper Works', vendorId: 'VND003', description: 'Board exam answer sheets & stationery', amount: 27119, gst: 4881, total: 32000, invoiceDate: '05 Mar 2026', dueDate: '20 Mar 2026', status: 'paid', paymentMode: 'Cheque' },
  { id: 'INV-4801', vendorName: 'Navneet Suppliers Pvt Ltd', vendorId: 'VND001', description: 'Physics lab oscilloscopes (5 units)', amount: 169492, gst: 30508, total: 200000, invoiceDate: '15 Feb 2026', dueDate: '01 Mar 2026', status: 'paid', paymentMode: 'RTGS' },
  { id: 'INV-4790', vendorName: 'Sodexo India Pvt Ltd', vendorId: 'VND004', description: 'Canteen operations — Feb 2026', amount: 67797, gst: 12203, total: 80000, invoiceDate: '01 Feb 2026', dueDate: '25 Feb 2026', status: 'paid', paymentMode: 'NEFT' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

const invStatusConfig: Record<InvoiceStatus, { label: string; bg: string }> = {
  paid: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-700' },
  overdue: { label: 'Overdue', bg: 'bg-red-50 text-red-700' },
  disputed: { label: 'Disputed', bg: 'bg-purple-50 text-purple-700' },
}

export default function VendorPaymentsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'invoices' | 'vendors'>('invoices')

  const totalPending = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + i.total, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0)
  const totalPaidThisMonth = invoices.filter(i => i.status === 'paid' && i.invoiceDate.includes('Mar')).reduce((s, i) => s + i.total, 0)

  const filteredInvoices = invoices.filter(i => i.vendorName.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2"><Truck className="w-4 h-4" /> Active Vendors</div>
          <p className="text-2xl font-black text-gray-900">{vendors.filter(v => v.status === 'active').length}</p>
          <p className="text-xs text-gray-400 mt-1">{vendors.length} total registered</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2"><FileText className="w-4 h-4" /> Open Invoices</div>
          <p className="text-2xl font-black text-gray-900">{invoices.filter(i => i.status !== 'paid').length}</p>
          <p className="text-xs text-gray-400 mt-1">{fmt(totalPending)} total value</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
          <div className="flex items-center gap-2 text-red-600 text-xs font-medium mb-2"><AlertCircle className="w-4 h-4" /> Overdue</div>
          <p className="text-2xl font-black text-red-700">{fmt(totalOverdue)}</p>
          <p className="text-xs text-red-500 mt-1">{invoices.filter(i => i.status === 'overdue').length} invoice(s)</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium mb-2"><CheckCircle2 className="w-4 h-4" /> Paid (Mar)</div>
          <p className="text-2xl font-black text-emerald-700">{fmt(totalPaidThisMonth)}</p>
          <p className="text-xs text-emerald-600 mt-1">{invoices.filter(i => i.status === 'paid' && i.invoiceDate.includes('Mar')).length} invoices cleared</p>
        </div>
      </div>

      {/* Toggle + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setTab('invoices')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'invoices' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Invoices</button>
          <button onClick={() => setTab('vendors')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'vendors' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Vendor Directory</button>
        </div>
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={tab === 'invoices' ? 'Search invoices...' : 'Search vendors...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> {tab === 'invoices' ? 'Record Invoice' : 'Add Vendor'}
        </button>
      </div>

      {/* Invoices Table */}
      {tab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Invoices & Purchase Orders</h2>
            <button className="flex items-center gap-2 text-xs text-indigo-600 font-medium hover:underline"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Invoice #', 'Vendor', 'Description', 'Amount', 'GST', 'Total', 'Due Date', 'Status', 'Mode'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInvoices.map(inv => {
                  const sc = invStatusConfig[inv.status]
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-medium">{inv.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{inv.vendorName}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{inv.description}</td>
                      <td className="px-4 py-3 text-gray-700">₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">₹{inv.gst.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">₹{inv.total.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{inv.dueDate}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg}`}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{inv.paymentMode}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendor Directory */}
      {tab === 'vendors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVendors.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{v.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{v.category} · GSTIN: {v.gstin}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${v.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {v.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {v.contact}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {v.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Total Paid</p>
                  <p className="font-bold text-gray-900 text-sm">{fmt(v.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className={`font-bold text-sm ${v.pendingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{v.pendingAmount > 0 ? fmt(v.pendingAmount) : 'Nil'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last Payment</p>
                  <p className="font-medium text-gray-700 text-sm">{v.lastPayment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
