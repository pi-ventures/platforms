'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { MOCK_LEADS } from '@/lib/mockData'
import { PIPELINE_STAGES } from '@/lib/constants'
import { Lead, LeadStatus } from '@/lib/types'
import {
  Phone, MessageSquare, Mail, MapPin, Clock,
  Plus, Filter, ChevronDown, User, Calendar,
  Zap, ArrowRight, Star, Building2, DollarSign
} from 'lucide-react'

const SOURCE_ICONS: Record<string, string> = {
  '99acres':'🏢', 'magicbricks':'🧱', 'housing':'🏠', 'google_ads':'🔍',
  'facebook_ads':'📘', 'instagram':'📸', 'whatsapp':'💬', 'olx':'🟡',
  'sulekha':'🌺', 'justdial':'📞', 'referral':'👥', 'walk_in':'🚶', 'other':'📌',
}

const formatBudget = (min: number, max: number) =>
  `₹${min >= 10000000 ? (min/10000000).toFixed(1)+'Cr' : (min/100000).toFixed(0)+'L'} -
   ₹${max >= 10000000 ? (max/10000000).toFixed(1)+'Cr' : (max/100000).toFixed(0)+'L'}`

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <div className="kanban-card mb-3 animate-fade-in" onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-mustard-gradient rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-dark leading-none">{lead.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{lead.phone}</p>
          </div>
        </div>
        <span className="text-lg" title={lead.source}>{SOURCE_ICONS[lead.source] || '📌'}</span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <MapPin className="w-3 h-3" />
        <span>{lead.requirements.city}</span>
        {lead.requirements.bedrooms && (
          <span className="ml-1">· {lead.requirements.bedrooms.join('/')} BHK</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-lg mb-3">
        <DollarSign className="w-3 h-3" />
        {formatBudget(lead.budget.min, lead.budget.max)}
      </div>

      {lead.notes.length > 0 && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2 bg-gray-50 p-2 rounded-lg">
          {lead.notes[0].text}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
        </span>
        <div className="flex gap-1">
          <button className="w-7 h-7 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors">
            <Phone className="w-3 h-3" />
          </button>
          <button className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
            <MessageSquare className="w-3 h-3" />
          </button>
          {lead.email && (
            <button className="w-7 h-7 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors">
              <Mail className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const leadsByStatus = (status: LeadStatus) =>
    MOCK_LEADS.filter(l => l.status === status)

  return (
    <AppLayout title="Leads" subtitle="Manage and track all your leads">
      {/* Top Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {PIPELINE_STAGES.map(stage => (
          <div key={stage.id} className="bg-white rounded-2xl p-4 shadow-card border-t-4"
            style={{ borderColor: stage.color }}>
            <p className="text-2xl font-bold font-display" style={{ color: stage.color }}>
              {MOCK_LEADS.filter(l => l.status === stage.id).length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stage.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
            {['kanban','list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${view === v ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {v === 'kanban' ? '📋 Kanban' : '📝 List'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-brand-primary transition-all">
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium">
            <Zap className="w-4 h-4" />
            Auto-assigning leads
          </div>
          <button className="btn-primary flex items-center gap-2 !py-2.5 !px-4 text-sm">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = MOCK_LEADS.filter(l => l.status === stage.id)
            return (
              <div key={stage.id} className="kanban-column flex-shrink-0"
                style={{ borderTop: `3px solid ${stage.color}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: stage.bg, color: stage.color }}>
                      {stageLeads.length}
                    </span>
                  </div>
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-300">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No leads here</p>
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                  ))
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name & Contact','Source','Budget','Requirements','Status','Last Contact','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_LEADS.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-mustard-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-dark">{lead.name}</p>
                        <p className="text-gray-400 text-xs">{lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{SOURCE_ICONS[lead.source] || '📌'}</span>
                      <span className="text-gray-600 capitalize">{lead.source.replace('_',' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-green-700 font-medium">
                    {formatBudget(lead.budget.min, lead.budget.max)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">{lead.requirements.city}</span>
                    {lead.requirements.bedrooms && (
                      <span className="ml-1 text-gray-400">· {lead.requirements.bedrooms.join('/')} BHK</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge badge-${lead.status}`}>
                      {PIPELINE_STAGES.find(s => s.id === lead.status)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {lead.lastContactedAt
                      ? new Date(lead.lastContactedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })
                      : '—'
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-mustard-50 text-brand-primary rounded-lg hover:bg-mustard-100 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mustard-gradient rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark font-display">{selectedLead.name}</h3>
                    <p className="text-gray-500 text-sm">{selectedLead.phone}</p>
                  </div>
                </div>
                <span className={`badge badge-${selectedLead.status}`}>
                  {PIPELINE_STAGES.find(s => s.id === selectedLead.status)?.label}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Source</p>
                  <p className="font-semibold">{SOURCE_ICONS[selectedLead.source]} {selectedLead.source.replace('_',' ')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Budget</p>
                  <p className="font-semibold text-green-700">{formatBudget(selectedLead.budget.min, selectedLead.budget.max)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">City</p>
                  <p className="font-semibold">{selectedLead.requirements.city}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Created</p>
                  <p className="font-semibold">{new Date(selectedLead.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              {selectedLead.notes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Notes</p>
                  {selectedLead.notes.map(note => (
                    <div key={note.id} className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl text-sm text-gray-600">
                      {note.text}
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Add Note</p>
                <textarea className="input h-20 resize-none" placeholder="Add a note about this lead..." />
              </div>
              <div className="flex gap-3">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Now
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
