'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { AD_PLATFORMS } from '@/lib/constants'
import { AdPlatform } from '@/lib/types'
import {
  Megaphone, Zap, Users, DollarSign, TrendingUp,
  CheckCircle, XCircle, Settings, Plus, Search,
  ExternalLink, RefreshCw, AlertCircle, Globe, Star
} from 'lucide-react'

const CATEGORIES = ['all', 'portal', 'social', 'search', 'classifieds', 'aggregator']

const CATEGORY_COLORS: Record<string, string> = {
  portal: 'bg-blue-100 text-blue-700',
  social: 'bg-pink-100 text-pink-700',
  search: 'bg-green-100 text-green-700',
  classifieds: 'bg-yellow-100 text-yellow-700',
  aggregator: 'bg-purple-100 text-purple-700',
}

function PlatformCard({ platform, onConnect }: { platform: AdPlatform; onConnect: (p: AdPlatform) => void }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-card border-2 transition-all duration-200 hover:shadow-card-hover
      ${platform.connected ? 'border-green-200' : 'border-gray-100 hover:border-brand-primary/30'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `${platform.color}18` }}>
            {platform.logo}
          </div>
          <div>
            <h3 className="font-semibold text-brand-dark text-sm leading-tight">{platform.name}</h3>
            {platform.indianRank && (
              <p className="text-xs text-gray-400 mt-0.5">India Rank #{platform.indianRank}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[platform.category]}`}>
            {platform.category}
          </span>
          {platform.connected ? (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              Not connected
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      {platform.connected ? (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-brand-primary font-display">{platform.leadsToday}</p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-brand-dark font-display">{platform.leadsTotal}</p>
            <p className="text-xs text-gray-400">Total Leads</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-green-600 font-display">{platform.activeCampaigns}</p>
            <p className="text-xs text-gray-400">Campaigns</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-gray-400">Connect to start receiving leads</p>
          {platform.monthlyCost && (
            <p className="text-sm font-semibold text-gray-700 mt-1">
              From ₹{(platform.monthlyCost / 1000).toFixed(0)}K/mo
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-3 h-3 ${s <= Math.floor(platform.rating) ? 'text-brand-primary fill-brand-primary' : 'text-gray-200 fill-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">{platform.rating}</span>
        </div>
        <button
          onClick={() => onConnect(platform)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
            ${platform.connected
              ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              : 'bg-brand-primary text-white hover:bg-brand-accent shadow-mustard'
            }`}
        >
          {platform.connected ? (
            <><Settings className="w-3 h-3" /> Manage</>
          ) : (
            <><Plus className="w-3 h-3" /> Connect</>
          )}
        </button>
      </div>
    </div>
  )
}

export default function AdvertisingPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showConnected, setShowConnected] = useState<'all' | 'connected' | 'disconnected'>('all')
  const [platforms, setPlatforms] = useState(AD_PLATFORMS)
  const [connectModal, setConnectModal] = useState<AdPlatform | null>(null)

  const filtered = platforms.filter(p => {
    const matchCat = category === 'all' || p.category === category
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchConn = showConnected === 'all' || (showConnected === 'connected' ? p.connected : !p.connected)
    return matchCat && matchSearch && matchConn
  })

  const connected = platforms.filter(p => p.connected)
  const totalLeadsToday = connected.reduce((sum, p) => sum + p.leadsToday, 0)
  const totalLeadsAll = connected.reduce((sum, p) => sum + p.leadsTotal, 0)
  const totalCost = connected.reduce((sum, p) => sum + (p.monthlyCost || 0), 0)

  const handleConnect = (platform: AdPlatform) => {
    if (platform.connected) {
      setConnectModal(platform)
    } else {
      setConnectModal(platform)
    }
  }

  const confirmConnect = () => {
    if (!connectModal) return
    setPlatforms(prev =>
      prev.map(p => p.id === connectModal.id ? { ...p, connected: !p.connected } : p)
    )
    setConnectModal(null)
  }

  return (
    <AppLayout title="Advertising Hub" subtitle="Manage all your real estate advertising platforms in one place">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-mustard-gradient rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 opacity-80" />
            <span className="text-sm font-medium opacity-90">Connected</span>
          </div>
          <p className="text-4xl font-bold font-display">{connected.length}</p>
          <p className="text-sm opacity-75 mt-0.5">of {platforms.length} platforms</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Leads Today</span>
          </div>
          <p className="text-4xl font-bold font-display text-brand-dark">{totalLeadsToday}</p>
          <p className="text-sm text-green-600 mt-0.5">↑ 18% vs yesterday</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Total Leads</span>
          </div>
          <p className="text-4xl font-bold font-display text-brand-dark">{totalLeadsAll.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-0.5">All time across platforms</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-mustard-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-brand-primary" />
            <span className="text-sm font-medium text-gray-600">Monthly Spend</span>
          </div>
          <p className="text-4xl font-bold font-display text-brand-dark">
            ₹{(totalCost/1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-400 mt-0.5">Across connected platforms</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search platforms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${category === c ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(['all','connected','disconnected'] as const).map(v => (
            <button
              key={v}
              onClick={() => setShowConnected(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${showConnected === v ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {v}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all">
          <RefreshCw className="w-4 h-4" />
          Sync All Leads
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <span className="font-semibold text-brand-dark">{filtered.length}</span> platforms
        {connected.length > 0 && (
          <span className="ml-2 text-green-600">
            · <span className="font-semibold">{connected.filter(p =>
              filtered.some(f => f.id === p.id)).length}</span> connected
          </span>
        )}
      </p>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(platform => (
          <PlatformCard key={platform.id} platform={platform} onConnect={handleConnect} />
        ))}
      </div>

      {/* Connect / Manage Modal */}
      {connectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setConnectModal(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${connectModal.color}18` }}>
                {connectModal.logo}
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-dark font-display">{connectModal.name}</h3>
                <p className="text-gray-500 text-sm capitalize">{connectModal.category} platform</p>
              </div>
            </div>

            {connectModal.connected ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">Platform is connected</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Receiving leads in real-time. {connectModal.leadsToday} leads today.
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">API Key</label>
                    <input className="input" type="password" value="••••••••••••••••" readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Daily Budget</label>
                    <input className="input" placeholder="₹500" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary">Update Settings</button>
                  <button
                    onClick={confirmConnect}
                    className="flex-1 btn-secondary !text-red-600 !border-red-200 hover:!bg-red-50"
                  >
                    Disconnect
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-mustard-50 border border-mustard-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-mustard-800">
                    Connect {connectModal.name} to automatically receive all leads in your YesBroker inbox.
                    {connectModal.monthlyCost && ` Starting from ₹${connectModal.monthlyCost.toLocaleString()}/month.`}
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">API Key / Access Token</label>
                    <input className="input" placeholder="Paste your API key here" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Account ID (optional)</label>
                    <input className="input" placeholder="Your advertiser account ID" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={confirmConnect} className="flex-1 btn-primary">
                    Connect Platform
                  </button>
                  <button onClick={() => setConnectModal(null)} className="flex-1 btn-secondary">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
