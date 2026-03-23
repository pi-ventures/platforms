'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { MOCK_LEADS } from '@/lib/mockData'
import { Lead } from '@/lib/types'
import {
  Inbox, Phone, MessageSquare, Mail, Star,
  Search, Filter, RefreshCw, Zap, Clock,
  User, MapPin, DollarSign, Tag, ChevronRight,
  CheckCircle, Circle, Archive, Trash2
} from 'lucide-react'

const SOURCE_LABELS: Record<string, { name: string; color: string; bg: string }> = {
  '99acres':     { name: '99acres',      color: '#E63946', bg: '#FEF2F2' },
  'magicbricks': { name: 'MagicBricks',  color: '#E87722', bg: '#FFF7ED' },
  'housing':     { name: 'Housing.com',  color: '#FF4F5B', bg: '#FEF2F2' },
  'google_ads':  { name: 'Google Ads',   color: '#4285F4', bg: '#EFF6FF' },
  'facebook_ads':{ name: 'Facebook',     color: '#1877F2', bg: '#EFF6FF' },
  'instagram':   { name: 'Instagram',    color: '#E1306C', bg: '#FDF2F8' },
  'whatsapp':    { name: 'WhatsApp',     color: '#25D366', bg: '#F0FDF4' },
  'olx':         { name: 'OLX',          color: '#F5A623', bg: '#FFF8E7' },
  'sulekha':     { name: 'Sulekha',      color: '#E91E63', bg: '#FDF2F8' },
  'referral':    { name: 'Referral',     color: '#8B5CF6', bg: '#F5F3FF' },
}

const formatBudget = (min: number, max: number) =>
  `₹${min >= 10000000 ? (min/10000000).toFixed(1)+'Cr' : (min/100000).toFixed(0)+'L'} - ₹${max >= 10000000 ? (max/10000000).toFixed(1)+'Cr' : (max/100000).toFixed(0)+'L'}`

// Extend mock leads with inbox-specific fields
const INBOX_ITEMS = MOCK_LEADS.map((lead, i) => ({
  ...lead,
  read: i > 0,
  starred: i === 1,
  archived: false,
}))

export default function InboxPage() {
  const [items, setItems] = useState(INBOX_ITEMS)
  const [selected, setSelected] = useState<typeof INBOX_ITEMS[0] | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = items.filter(item => {
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.source.includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'unread' ? !item.read :
      filter === 'starred' ? item.starred :
      filter === 'archived' ? item.archived : true
    return matchSearch && matchFilter && !item.archived
  })

  const unreadCount = items.filter(i => !i.read).length

  const markRead = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i))
  }

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setItems(prev => prev.map(i => i.id === id ? { ...i, starred: !i.starred } : i))
  }

  const handleSelect = (item: typeof INBOX_ITEMS[0]) => {
    setSelected(item)
    markRead(item.id)
  }

  const sourceInfo = (source: string) => SOURCE_LABELS[source] || { name: source, color: '#6B7280', bg: '#F9FAFB' }

  return (
    <AppLayout title="Unified Inbox" subtitle="All leads from 40+ platforms in one place">
      <div className="flex gap-6 h-[calc(100vh-10rem)]">
        {/* Left: Lead List */}
        <div className="w-96 flex-shrink-0 flex flex-col bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Inbox Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-brand-primary" />
                <span className="font-bold text-brand-dark font-display">Inbox</span>
                {unreadCount > 0 && (
                  <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1 mt-3">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: `Unread (${unreadCount})` },
                { id: 'starred', label: '⭐' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${filter === f.id ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-800'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Feed Banner */}
          <div className="flex items-center gap-2 mx-4 my-2 px-3 py-2 bg-green-50 rounded-xl border border-green-200 text-xs text-green-700 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live: Receiving leads from 13 platforms
          </div>

          {/* Lead Items */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No leads found</p>
              </div>
            ) : (
              filtered.map(item => {
                const src = sourceInfo(item.source)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-b border-gray-50
                      ${selected?.id === item.id ? 'bg-mustard-50 border-l-4 border-l-brand-primary' : 'hover:bg-gray-50'}
                      ${!item.read ? 'bg-blue-50/30' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-mustard-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm truncate ${!item.read ? 'font-bold text-brand-dark' : 'font-medium text-gray-700'}`}>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 ml-2">
                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button onClick={e => toggleStar(item.id, e)}>
                            <Star className={`w-3.5 h-3.5 ${item.starred ? 'text-brand-primary fill-brand-primary' : 'text-gray-300'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: src.bg, color: src.color }}>
                          {src.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {item.requirements.city} · {formatBudget(item.budget.min, item.budget.max)}
                        </span>
                      </div>
                      {item.requirements.bedrooms && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Wants {item.requirements.bedrooms.join('/')} BHK {item.requirements.listingType || 'property'}
                        </p>
                      )}
                    </div>

                    {!item.read && (
                      <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right: Lead Detail */}
        <div className="flex-1 bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
          {selected ? (
            <>
              {/* Lead Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-mustard-gradient rounded-2xl flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark font-display">{selected.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="w-3.5 h-3.5" />
                          {selected.phone}
                        </div>
                        {selected.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="w-3.5 h-3.5" />
                            {selected.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => { const src = sourceInfo(selected.source); return (
                      <span className="px-3 py-1.5 rounded-xl text-sm font-semibold"
                        style={{ background: src.bg, color: src.color }}>
                        via {src.name}
                      </span>
                    )})()}
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Budget Range</p>
                    <p className="font-bold text-green-700 text-lg">{formatBudget(selected.budget.min, selected.budget.max)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Preferred City</p>
                    <p className="font-bold text-brand-dark">{selected.requirements.city}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Property Type</p>
                    <p className="font-bold text-brand-dark capitalize">
                      {selected.requirements.type?.join(', ') || 'Any'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                    <p className="font-bold text-brand-dark">
                      {selected.requirements.bedrooms?.join(', ') || 'Any'} BHK
                    </p>
                  </div>
                </div>

                {/* Localities */}
                {selected.requirements.localities && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Preferred Localities</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.requirements.localities.map(l => (
                        <span key={l} className="px-3 py-1.5 bg-mustard-50 text-mustard-700 rounded-xl text-sm font-medium">
                          <MapPin className="w-3 h-3 inline mr-1" />{l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selected.notes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Notes</p>
                    {selected.notes.map(note => (
                      <div key={note.id} className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-gray-600">
                        {note.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply / Action */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Quick Reply</p>
                  <textarea
                    className="input h-24 resize-none"
                    placeholder="Type a message or note..."
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-gray-100 flex items-center gap-3">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <Inbox className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Select a lead to view details</p>
              <p className="text-sm mt-1 opacity-70">All leads from your advertising platforms appear here</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
