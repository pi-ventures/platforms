import { TrendingUp, TrendingDown, IndianRupee, ArrowUpRight, ArrowDownRight, Wallet, Banknote, Truck, Package, Download, PieChart } from 'lucide-react'

const monthlyData = [
  { month: 'Oct 2025', income: 2480000, expense: 1650000, net: 830000 },
  { month: 'Nov 2025', income: 2520000, expense: 1720000, net: 800000 },
  { month: 'Dec 2025', income: 2350000, expense: 1880000, net: 470000 },
  { month: 'Jan 2026', income: 2610000, expense: 1690000, net: 920000 },
  { month: 'Feb 2026', income: 2540000, expense: 1750000, net: 790000 },
  { month: 'Mar 2026', income: 2680000, expense: 1810000, net: 870000 },
]

const expenseBreakdown = [
  { category: 'Staff Salaries', amount: 1080000, pct: 59.7, color: 'bg-indigo-500' },
  { category: 'Vendor Payments', amount: 320000, pct: 17.7, color: 'bg-purple-500' },
  { category: 'Utilities & Maintenance', amount: 185000, pct: 10.2, color: 'bg-teal-500' },
  { category: 'Inventory & Supplies', amount: 125000, pct: 6.9, color: 'bg-amber-500' },
  { category: 'Transport', amount: 62000, pct: 3.4, color: 'bg-pink-500' },
  { category: 'Miscellaneous', amount: 38000, pct: 2.1, color: 'bg-gray-400' },
]

const incomeBreakdown = [
  { source: 'Tuition Fees', amount: 1860000, pct: 69.4 },
  { source: 'Transport Fees', amount: 340000, pct: 12.7 },
  { source: 'Lab & Activity Fees', amount: 220000, pct: 8.2 },
  { source: 'Govt Grants & Subsidies', amount: 180000, pct: 6.7 },
  { source: 'Misc (Canteen, Events)', amount: 80000, pct: 3.0 },
]

const recentTransactions = [
  { desc: 'March staff salary disbursement', type: 'debit', amount: 1080000, date: '22 Mar 2026', cat: 'Salary' },
  { desc: 'Tuition fee collection — Class 10', type: 'credit', amount: 583200, date: '20 Mar 2026', cat: 'Fees' },
  { desc: 'Science lab equipment — Navneet Suppliers', type: 'debit', amount: 145000, date: '18 Mar 2026', cat: 'Vendor' },
  { desc: 'Tuition fee collection — Class 9', type: 'credit', amount: 504000, date: '17 Mar 2026', cat: 'Fees' },
  { desc: 'Electricity bill — Mar 2026', type: 'debit', amount: 87500, date: '15 Mar 2026', cat: 'Utility' },
  { desc: 'Annual maintenance — Blue Star AC', type: 'debit', amount: 65000, date: '14 Mar 2026', cat: 'Vendor' },
  { desc: 'Govt mid-day meal subsidy Q4', type: 'credit', amount: 180000, date: '12 Mar 2026', cat: 'Grant' },
  { desc: 'Stationery purchase — Ajanta Paper Works', type: 'debit', amount: 32000, date: '10 Mar 2026', cat: 'Inventory' },
]

const alerts = [
  { text: '₹4.2L outstanding fees from 25 students — overdue since Feb', priority: 'high' },
  { text: 'Canteen vendor invoice #INV-4871 due in 3 days', priority: 'medium' },
  { text: 'Petty cash balance below ₹5,000 — needs replenishment', priority: 'medium' },
  { text: 'Annual audit scheduled for April 15 — prepare FY25-26 books', priority: 'low' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

export default function FinanceSummaryPage() {
  const currentMonth = monthlyData[monthlyData.length - 1]
  const prevMonth = monthlyData[monthlyData.length - 2]
  const incomeChange = ((currentMonth.income - prevMonth.income) / prevMonth.income * 100).toFixed(1)
  const expenseChange = ((currentMonth.expense - prevMonth.expense) / prevMonth.expense * 100).toFixed(1)
  const maxBar = Math.max(...monthlyData.map(m => m.income))

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-emerald-200" />
            <span className="text-emerald-100 text-xs font-medium">Net Balance</span>
          </div>
          <p className="text-3xl font-black">{fmt(currentMonth.net)}</p>
          <p className="text-emerald-200 text-xs mt-1">March 2026</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-gray-500 text-xs font-medium">Income</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{fmt(currentMonth.income)}</p>
          <p className="text-xs mt-1 flex items-center gap-1">
            <span className={Number(incomeChange) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
              {Number(incomeChange) >= 0 ? '+' : ''}{incomeChange}%
            </span>
            <span className="text-gray-400">vs last month</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-4 h-4 text-red-500" />
            <span className="text-gray-500 text-xs font-medium">Expenses</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{fmt(currentMonth.expense)}</p>
          <p className="text-xs mt-1 flex items-center gap-1">
            <span className={Number(expenseChange) <= 0 ? 'text-emerald-600' : 'text-red-500'}>
              {Number(expenseChange) >= 0 ? '+' : ''}{expenseChange}%
            </span>
            <span className="text-gray-400">vs last month</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span className="text-gray-500 text-xs font-medium">FY25-26 Net</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{fmt(monthlyData.reduce((s, m) => s + m.net, 0))}</p>
          <p className="text-xs text-gray-400 mt-1">6-month cumulative</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar chart — Income vs Expense */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Monthly Income vs Expense</h2>
            <button className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <div className="space-y-3">
            {monthlyData.map(m => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 flex-shrink-0">{m.month.split(' ')[0].slice(0, 3)}</span>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 rounded-full bg-emerald-400" style={{ width: `${(m.income / maxBar) * 100}%` }} />
                    <span className="text-xs text-gray-500 flex-shrink-0">{fmt(m.income)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 rounded-full bg-red-300" style={{ width: `${(m.expense / maxBar) * 100}%` }} />
                    <span className="text-xs text-gray-500 flex-shrink-0">{fmt(m.expense)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-emerald-400" /> Income</div>
            <div className="flex items-center gap-2 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-red-300" /> Expense</div>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Expense Breakdown</h2>
          <div className="space-y-3">
            {expenseBreakdown.map(e => (
              <div key={e.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{e.category}</span>
                  <span className="font-semibold text-gray-900">{fmt(e.amount)}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${e.color}`} style={{ width: `${e.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{e.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income Sources + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Income Sources — March 2026</h2>
          <div className="space-y-3">
            {incomeBreakdown.map(i => (
              <div key={i.source} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{i.source}</p>
                    <p className="text-xs text-gray-400">{i.pct}% of total income</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">{fmt(i.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Financial Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.text} className="flex gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.priority === 'high' ? 'bg-red-500' : a.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                <p className="text-gray-700 text-xs leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-xs text-indigo-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Description', 'Category', 'Date', 'Amount'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTransactions.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-gray-900 font-medium">{t.desc}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      t.cat === 'Salary' ? 'bg-indigo-50 text-indigo-700' :
                      t.cat === 'Fees' ? 'bg-emerald-50 text-emerald-700' :
                      t.cat === 'Vendor' ? 'bg-purple-50 text-purple-700' :
                      t.cat === 'Utility' ? 'bg-teal-50 text-teal-700' :
                      t.cat === 'Grant' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>{t.cat}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{t.date}</td>
                  <td className={`px-5 py-4 font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
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
