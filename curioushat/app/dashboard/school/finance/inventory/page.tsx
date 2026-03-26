'use client'
import { useState } from 'react'
import { Search, Package, AlertTriangle, CheckCircle2, Wrench, Monitor, FlaskConical, BookOpen, Dumbbell, Armchair, Plus, Download, TrendingDown, BarChart3 } from 'lucide-react'

type ItemCondition = 'good' | 'fair' | 'needs_repair' | 'condemned'
type ItemCategory = 'all' | 'furniture' | 'lab_equipment' | 'it_equipment' | 'sports' | 'library' | 'maintenance'

interface InventoryItem {
  id: string
  name: string
  category: ItemCategory
  location: string
  quantity: number
  unitValue: number
  totalValue: number
  condition: ItemCondition
  lastAudit: string
  supplier: string
  purchaseDate: string
  warranty: string
}

interface SupplyItem {
  name: string
  category: string
  currentStock: number
  unit: string
  reorderLevel: number
  monthlyUsage: number
  lastOrdered: string
  status: 'adequate' | 'low' | 'critical'
}

const inventory: InventoryItem[] = [
  { id: 'AST-001', name: 'Smart Interactive Board (75")', category: 'it_equipment', location: 'Classrooms 6A–10D', quantity: 20, unitValue: 85000, totalValue: 1700000, condition: 'good', lastAudit: 'Jan 2026', supplier: 'BenQ India', purchaseDate: 'Jun 2024', warranty: 'Jun 2027' },
  { id: 'AST-002', name: 'Desktop Computer (i5, 16GB)', category: 'it_equipment', location: 'Computer Lab 1 & 2', quantity: 60, unitValue: 42000, totalValue: 2520000, condition: 'good', lastAudit: 'Jan 2026', supplier: 'Dell India', purchaseDate: 'Aug 2024', warranty: 'Aug 2027' },
  { id: 'AST-003', name: 'Microscope (Binocular, 1000x)', category: 'lab_equipment', location: 'Biology Lab', quantity: 30, unitValue: 18500, totalValue: 555000, condition: 'good', lastAudit: 'Feb 2026', supplier: 'Navneet Suppliers', purchaseDate: 'Mar 2023', warranty: 'Expired' },
  { id: 'AST-004', name: 'Oscilloscope (Digital, 100MHz)', category: 'lab_equipment', location: 'Physics Lab', quantity: 10, unitValue: 35000, totalValue: 350000, condition: 'good', lastAudit: 'Mar 2026', supplier: 'Navneet Suppliers', purchaseDate: 'Feb 2026', warranty: 'Feb 2029' },
  { id: 'AST-005', name: 'Student Desk + Chair Set', category: 'furniture', location: 'All classrooms', quantity: 650, unitValue: 4500, totalValue: 2925000, condition: 'fair', lastAudit: 'Dec 2025', supplier: 'Godrej Interio', purchaseDate: 'Apr 2022', warranty: 'Expired' },
  { id: 'AST-006', name: 'Teacher Desk (Wooden)', category: 'furniture', location: 'All classrooms + staff room', quantity: 42, unitValue: 8500, totalValue: 357000, condition: 'fair', lastAudit: 'Dec 2025', supplier: 'Godrej Interio', purchaseDate: 'Apr 2022', warranty: 'Expired' },
  { id: 'AST-007', name: 'Chemistry Fume Hood', category: 'lab_equipment', location: 'Chemistry Lab', quantity: 4, unitValue: 75000, totalValue: 300000, condition: 'needs_repair', lastAudit: 'Feb 2026', supplier: 'LabTech India', purchaseDate: 'Jan 2021', warranty: 'Expired' },
  { id: 'AST-008', name: 'Basketball, Football, Volleyball Set', category: 'sports', location: 'Sports Store', quantity: 45, unitValue: 2200, totalValue: 99000, condition: 'fair', lastAudit: 'Jan 2026', supplier: 'Nivia Sports', purchaseDate: 'Jul 2025', warranty: 'N/A' },
  { id: 'AST-009', name: 'CCTV Camera System (32ch)', category: 'it_equipment', location: 'Campus-wide', quantity: 1, unitValue: 320000, totalValue: 320000, condition: 'good', lastAudit: 'Mar 2026', supplier: 'CP Plus India', purchaseDate: 'May 2024', warranty: 'May 2027' },
  { id: 'AST-010', name: 'Library Book Collection', category: 'library', location: 'Central Library', quantity: 8500, unitValue: 450, totalValue: 3825000, condition: 'good', lastAudit: 'Feb 2026', supplier: 'Various Publishers', purchaseDate: 'Ongoing', warranty: 'N/A' },
  { id: 'AST-011', name: 'Water Purifier (Industrial)', category: 'maintenance', location: 'Canteen + Each Floor', quantity: 8, unitValue: 45000, totalValue: 360000, condition: 'good', lastAudit: 'Mar 2026', supplier: 'Eureka Forbes', purchaseDate: 'Sep 2024', warranty: 'Sep 2026' },
  { id: 'AST-012', name: 'Split AC 1.5 Ton (Inverter)', category: 'maintenance', location: 'Admin Block + Labs', quantity: 24, unitValue: 42000, totalValue: 1008000, condition: 'good', lastAudit: 'Jan 2026', supplier: 'Blue Star Ltd', purchaseDate: 'Apr 2024', warranty: 'Apr 2029' },
]

const supplies: SupplyItem[] = [
  { name: 'Whiteboard Markers (Box of 10)', category: 'Stationery', currentStock: 45, unit: 'boxes', reorderLevel: 20, monthlyUsage: 30, lastOrdered: '05 Mar 2026', status: 'adequate' },
  { name: 'A4 Paper Reams', category: 'Stationery', currentStock: 120, unit: 'reams', reorderLevel: 50, monthlyUsage: 80, lastOrdered: '10 Mar 2026', status: 'adequate' },
  { name: 'Chalk (White, Box of 100)', category: 'Classroom', currentStock: 8, unit: 'boxes', reorderLevel: 15, monthlyUsage: 12, lastOrdered: '15 Feb 2026', status: 'critical' },
  { name: 'Science Lab Chemicals Kit', category: 'Lab', currentStock: 6, unit: 'kits', reorderLevel: 5, monthlyUsage: 3, lastOrdered: '20 Feb 2026', status: 'adequate' },
  { name: 'Printer Toner (HP 05A)', category: 'IT', currentStock: 3, unit: 'cartridges', reorderLevel: 5, monthlyUsage: 4, lastOrdered: '01 Mar 2026', status: 'low' },
  { name: 'Floor Cleaning Liquid (5L)', category: 'Housekeeping', currentStock: 12, unit: 'cans', reorderLevel: 8, monthlyUsage: 10, lastOrdered: '08 Mar 2026', status: 'adequate' },
  { name: 'First Aid Kit Refill', category: 'Medical', currentStock: 2, unit: 'kits', reorderLevel: 3, monthlyUsage: 1, lastOrdered: '20 Jan 2026', status: 'low' },
  { name: 'Dustbin Liners (Large, 50-pack)', category: 'Housekeeping', currentStock: 25, unit: 'packs', reorderLevel: 10, monthlyUsage: 15, lastOrdered: '05 Mar 2026', status: 'adequate' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

const conditionConfig: Record<ItemCondition, { label: string; bg: string }> = {
  good: { label: 'Good', bg: 'bg-emerald-50 text-emerald-700' },
  fair: { label: 'Fair', bg: 'bg-blue-50 text-blue-700' },
  needs_repair: { label: 'Needs Repair', bg: 'bg-amber-50 text-amber-700' },
  condemned: { label: 'Condemned', bg: 'bg-red-50 text-red-700' },
}

const categoryIcons: Record<string, typeof Package> = {
  furniture: Armchair,
  lab_equipment: FlaskConical,
  it_equipment: Monitor,
  sports: Dumbbell,
  library: BookOpen,
  maintenance: Wrench,
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory>('all')
  const [tab, setTab] = useState<'assets' | 'supplies'>('assets')

  const totalAssetValue = inventory.reduce((s, i) => s + i.totalValue, 0)
  const needsRepair = inventory.filter(i => i.condition === 'needs_repair' || i.condition === 'condemned')
  const lowStockSupplies = supplies.filter(s => s.status === 'low' || s.status === 'critical')

  const filteredInventory = inventory.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter
    return matchSearch && matchCat
  })

  const filteredSupplies = supplies.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))

  // Category-wise summary
  const categorySummary = ['it_equipment', 'lab_equipment', 'furniture', 'library', 'sports', 'maintenance'].map(cat => {
    const items = inventory.filter(i => i.category === cat)
    return {
      category: cat,
      label: cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      items: items.reduce((s, i) => s + i.quantity, 0),
      value: items.reduce((s, i) => s + i.totalValue, 0),
      icon: categoryIcons[cat] || Package,
    }
  })

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-medium mb-2"><Package className="w-4 h-4" /> Total Asset Value</div>
          <p className="text-3xl font-black">{fmt(totalAssetValue)}</p>
          <p className="text-indigo-200 text-xs mt-1">{inventory.length} asset categories</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2"><BarChart3 className="w-4 h-4" /> Total Items</div>
          <p className="text-2xl font-black text-gray-900">{inventory.reduce((s, i) => s + i.quantity, 0).toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-1">Across all categories</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-medium mb-2"><Wrench className="w-4 h-4" /> Needs Attention</div>
          <p className="text-2xl font-black text-amber-700">{needsRepair.length}</p>
          <p className="text-xs text-amber-600 mt-1">Assets needing repair</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
          <div className="flex items-center gap-2 text-red-600 text-xs font-medium mb-2"><TrendingDown className="w-4 h-4" /> Low Stock Supplies</div>
          <p className="text-2xl font-black text-red-700">{lowStockSupplies.length}</p>
          <p className="text-xs text-red-500 mt-1">Items below reorder level</p>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {categorySummary.map(c => (
          <button
            key={c.category}
            onClick={() => { setCategoryFilter(c.category as ItemCategory); setTab('assets') }}
            className={`bg-white rounded-xl p-4 border shadow-sm text-left transition-all hover:shadow-md ${categoryFilter === c.category ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-100'}`}
          >
            <c.icon className="w-5 h-5 text-indigo-500 mb-2" />
            <p className="text-xs font-semibold text-gray-900 capitalize">{c.label}</p>
            <p className="text-lg font-black text-gray-900 mt-1">{fmt(c.value)}</p>
            <p className="text-xs text-gray-400">{c.items.toLocaleString('en-IN')} items</p>
          </button>
        ))}
      </div>

      {/* Toggle + Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setTab('assets')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'assets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Assets Register</button>
          <button onClick={() => setTab('supplies')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'supplies' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Consumable Supplies</button>
        </div>
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {tab === 'assets' && (
          <button onClick={() => setCategoryFilter('all')} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${categoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            All Categories
          </button>
        )}
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Assets Register */}
      {tab === 'assets' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Fixed Assets Register</h2>
            <button className="flex items-center gap-2 text-xs text-indigo-600 font-medium hover:underline"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Asset', 'Location', 'Qty', 'Unit Value', 'Total Value', 'Condition', 'Warranty', 'Last Audit'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInventory.map(item => {
                  const cc = conditionConfig[item.condition]
                  const CatIcon = categoryIcons[item.category] || Package
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CatIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 whitespace-nowrap">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.supplier}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{item.location}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{item.quantity.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-700">₹{item.unitValue.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{fmt(item.totalValue)}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cc.bg}`}>{cc.label}</span></td>
                      <td className="px-4 py-3 text-xs">
                        <span className={item.warranty === 'Expired' ? 'text-red-500 font-medium' : item.warranty === 'N/A' ? 'text-gray-400' : 'text-gray-600'}>{item.warranty}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{item.lastAudit}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Consumable Supplies */}
      {tab === 'supplies' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Consumable Supplies — Stock Status</h2>
            <button className="flex items-center gap-2 text-xs text-indigo-600 font-medium hover:underline"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Item', 'Category', 'Current Stock', 'Reorder Level', 'Monthly Usage', 'Months Left', 'Last Ordered', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSupplies.map(s => {
                  const monthsLeft = s.monthlyUsage > 0 ? (s.currentStock / s.monthlyUsage).toFixed(1) : '—'
                  return (
                    <tr key={s.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.category}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${s.status === 'critical' ? 'text-red-600' : s.status === 'low' ? 'text-amber-600' : 'text-gray-900'}`}>
                          {s.currentStock} {s.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{s.reorderLevel} {s.unit}</td>
                      <td className="px-4 py-3 text-gray-600">~{s.monthlyUsage}/mo</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${Number(monthsLeft) < 1 ? 'text-red-600' : Number(monthsLeft) < 2 ? 'text-amber-600' : 'text-gray-700'}`}>{monthsLeft}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.lastOrdered}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          s.status === 'critical' ? 'bg-red-50 text-red-700' :
                          s.status === 'low' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {s.status === 'critical' ? 'Critical' : s.status === 'low' ? 'Low Stock' : 'Adequate'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
