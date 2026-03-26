'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Banknote, Truck, Package, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const financeTabs = [
  { label: 'Summary', href: '/dashboard/school/finance', icon: BarChart3 },
  { label: 'Internal Payments', href: '/dashboard/school/finance/internal-payments', icon: Banknote },
  { label: 'Vendor Payments', href: '/dashboard/school/finance/vendor-payments', icon: Truck },
  { label: 'Inventory', href: '/dashboard/school/finance/inventory', icon: Package },
]

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/school" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Finance Department</h1>
          <p className="text-gray-500 text-sm mt-0.5">Financial management, payments, and inventory tracking</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {financeTabs.map(tab => {
          const active = tab.href === '/dashboard/school/finance'
            ? pathname === tab.href
            : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                active
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}
