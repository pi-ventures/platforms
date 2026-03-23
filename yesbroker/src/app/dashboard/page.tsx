'use client'

import AppLayout from '@/components/layout/AppLayout'
import {
  Building2, Users, TrendingUp, DollarSign,
  Eye, Phone, MapPin, Star, ArrowUp, ArrowDown,
  Zap, Target, Clock, CheckCircle
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { MOCK_REVENUE_DATA, MOCK_LEAD_SOURCES_DATA, MOCK_BROKER, MOCK_LEADS, MOCK_PROPERTIES } from '@/lib/mockData'

const formatCurrency = (n: number) =>
  n >= 10000000 ? `₹${(n/10000000).toFixed(1)}Cr`
  : n >= 100000 ? `₹${(n/100000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`

const STAT_CARDS = [
  {
    label: 'Active Listings',
    value: '43',
    change: 12,
    icon: Building2,
    color: 'text-brand-primary',
    bg: 'bg-mustard-50',
    border: 'border-mustard-200',
  },
  {
    label: 'Leads Today',
    value: '23',
    change: 35,
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    label: 'Revenue (Mar)',
    value: '₹8.75L',
    change: 5.4,
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  {
    label: 'Deals Closed',
    value: '7',
    change: 16.7,
    icon: CheckCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    label: 'Conversion Rate',
    value: '4.2%',
    change: -0.3,
    icon: Target,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    label: 'Avg Deal Value',
    value: '₹1.25L',
    change: 8.2,
    icon: TrendingUp,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
]

const RECENT_ACTIVITY = [
  { type: 'lead',      text: 'New lead from Google Ads — Suresh Mehta wants 2 BHK in Andheri', time: '5 min ago',   icon: Users,   color: 'bg-blue-100 text-blue-600' },
  { type: 'deal',      text: 'Deal closed — Worli 3BHK sold to Rohit Gupta for ₹4.5Cr',        time: '2 hrs ago',   icon: CheckCircle, color: 'bg-green-100 text-green-600' },
  { type: 'view',      text: '42 new views on your BKC Office Space listing today',              time: '3 hrs ago',   icon: Eye,     color: 'bg-purple-100 text-purple-600' },
  { type: 'followup',  text: 'Follow-up due — Priya Krishnan (Juhu Villa)',                     time: '4 hrs ago',   icon: Clock,   color: 'bg-yellow-100 text-yellow-600' },
  { type: 'lead',      text: 'New lead from MagicBricks — 3 BHK buyer, budget ₹50L-80L',       time: '5 hrs ago',   icon: Users,   color: 'bg-blue-100 text-blue-600' },
  { type: 'platform',  text: 'Facebook Ads campaign started — ₹500/day, Andheri area',          time: '1 day ago',   icon: Zap,     color: 'bg-mustard-100 text-mustard-700' },
]

const TOP_PROPERTIES = MOCK_PROPERTIES.slice(0, 4)
const PIPELINE_COUNTS = [
  { stage: 'New', count: 34, color: '#3B82F6' },
  { stage: 'Contacted', count: 21, color: '#8B5CF6' },
  { stage: 'Site Visit', count: 12, color: '#F59E0B' },
  { stage: 'Negotiation', count: 7, color: '#F5A623' },
  { stage: 'Closed', count: 7, color: '#10B981' },
]

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard" subtitle="Welcome back, Rajesh! Here's your overview.">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.change > 0
          return (
            <div key={stat.label} className={`bg-white rounded-2xl p-4 border ${stat.border} shadow-sm hover:shadow-card transition-all`}>
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-brand-dark font-display">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(stat.change)}% vs last month
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-brand-dark font-display">Revenue & Leads</h3>
              <p className="text-sm text-gray-500">Last 6 months performance</p>
            </div>
            <span className="badge bg-green-100 text-green-700">↑ 5.4% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F5A623" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip formatter={(v: number, n: string) => [n === 'revenue' ? formatCurrency(v) : v, n === 'revenue' ? 'Revenue' : 'Leads']} />
              <Area type="monotone" dataKey="revenue" stroke="#F5A623" strokeWidth={2} fill="url(#revGrad)" />
              <Bar dataKey="leads" fill="#1A1A2E" radius={[4,4,0,0]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-brand-dark font-display mb-1">Lead Sources</h3>
          <p className="text-sm text-gray-500 mb-4">Where leads come from</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={MOCK_LEAD_SOURCES_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {MOCK_LEAD_SOURCES_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {MOCK_LEAD_SOURCES_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Lead Pipeline */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-brand-dark font-display mb-4">Lead Pipeline</h3>
          <div className="space-y-3">
            {PIPELINE_COUNTS.map(item => (
              <div key={item.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{item.stage}</span>
                  <span className="font-bold text-brand-dark">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(item.count / 34) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Total in Pipeline</span>
            <span className="font-bold text-brand-primary text-lg">81</span>
          </div>
        </div>

        {/* Top Properties */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-brand-dark font-display mb-4">Top Performing Properties</h3>
          <div className="space-y-3">
            {TOP_PROPERTIES.map((prop, i) => (
              <div key={prop.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-2xl font-bold text-gray-200 w-8 text-center">#{i+1}</span>
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{prop.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{prop.address.locality}, {prop.address.city}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-brand-primary">{formatCurrency(prop.price)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="w-3 h-3" />{prop.views}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />{prop.leads}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-dark font-display">Recent Activity</h3>
          <button className="text-sm text-brand-primary font-semibold hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{item.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
