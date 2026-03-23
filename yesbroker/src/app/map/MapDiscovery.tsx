'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import {
  BedDouble, Bath, Maximize2, MapPin,
  SlidersHorizontal, ChevronLeft, ChevronRight, Eye,
} from 'lucide-react'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import type { Property, PropertyType, ListingType } from '@/lib/types'

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtShort(p: Property): string {
  if (p.priceUnit === 'per_month') return `₹${Math.round(p.price / 1000)}K/mo`
  if (p.priceUnit === 'per_sqft') return `₹${p.price}/ft²`
  if (p.price >= 10_000_000) return `₹${(p.price / 10_000_000).toFixed(1)} Cr`
  return `₹${Math.round(p.price / 100_000)} L`
}

function fmtFull(p: Property): string {
  if (p.priceUnit === 'per_month') return `₹${p.price.toLocaleString('en-IN')}/month`
  if (p.priceUnit === 'per_sqft') return `₹${p.price}/sqft`
  if (p.price >= 10_000_000) return `₹${(p.price / 10_000_000).toFixed(2)} Cr`
  if (p.price >= 100_000) return `₹${(p.price / 100_000).toFixed(1)} L`
  return `₹${p.price.toLocaleString('en-IN')}`
}

// ─── Price-badge marker ───────────────────────────────────────────────────────

function pinIcon(label: string, active: boolean): L.DivIcon {
  const [bg, fg] = active ? ['#F5A623', '#1A1A2E'] : ['#0D0F1C', '#F5A623']
  const shadow = active
    ? '0 4px 16px rgba(245,166,35,0.55)'
    : '0 2px 8px rgba(0,0,0,0.55)'
  return L.divIcon({
    className: '',
    html: `<div style="
      display:inline-block;
      background:${bg};color:${fg};
      border:2px solid #F5A623;
      border-radius:20px;padding:4px 10px;
      font-size:11px;font-weight:700;
      white-space:nowrap;cursor:pointer;
      box-shadow:${shadow};
      font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      transform:translateX(-50%) translateY(-100%);
    ">${label}</div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  })
}

// ─── Map fly-to controller ────────────────────────────────────────────────────

function MapController({ fly }: { fly: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (!fly) return
    map.flyTo(fly, 15, { duration: 0.8 })
  }, [fly, map])
  return null
}

// ─── Filter options ───────────────────────────────────────────────────────────

type TypeFilter = 'all' | PropertyType
type ListingFilter = 'all' | ListingType

const TYPE_OPTS: { value: TypeFilter; label: string }[] = [
  { value: 'all',        label: 'All'        },
  { value: 'apartment',  label: 'Apartment'  },
  { value: 'villa',      label: 'Villa'      },
  { value: 'plot',       label: 'Plot'       },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office',     label: 'Office'     },
]

const LISTING_OPTS: { value: ListingFilter; label: string }[] = [
  { value: 'all',   label: 'All'   },
  { value: 'sale',  label: 'Sale'  },
  { value: 'rent',  label: 'Rent'  },
  { value: 'lease', label: 'Lease' },
]

// ─── Property card (sidebar) ──────────────────────────────────────────────────

function PropertyCard({
  prop, selected, onClick,
}: { prop: Property; selected: boolean; onClick: () => void }) {
  return (
    <div
      id={`card-${prop.id}`}
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden border transition-all duration-150"
      style={{
        borderColor: selected ? '#F5A623' : 'rgba(255,255,255,0.07)',
        background: selected ? 'rgba(245,166,35,0.07)' : 'rgba(255,255,255,0.03)',
        boxShadow: selected ? '0 0 0 1px #F5A623' : 'none',
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden bg-gray-800">
        <img
          src={prop.images[0]}
          alt={prop.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
          style={{ background: '#F5A623', color: '#1A1A2E' }}
        >
          {prop.listingType === 'sale' ? 'For Sale'
            : prop.listingType === 'rent' ? 'For Rent'
            : 'Lease'}
        </span>
        {prop.rera && (
          <span
            className="absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(13,15,28,0.85)', color: '#6EE7B7' }}
          >
            RERA ✓
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-3">
        <p className="text-white text-sm font-semibold leading-tight line-clamp-1 mb-0.5">
          {prop.title}
        </p>
        <p className="font-bold mb-1.5" style={{ color: '#F5A623', fontSize: 15 }}>
          {fmtFull(prop)}
        </p>
        <p className="text-gray-400 text-xs flex items-center gap-1 mb-2 truncate">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {prop.address.locality}, {prop.address.city}
        </p>

        <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
          {prop.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />
              {prop.bedrooms} bd
            </span>
          )}
          {prop.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {prop.bathrooms} ba
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            {prop.area.toLocaleString()} sqft
          </span>
        </div>

        <Link
          href={`/properties/${prop.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: 'rgba(245,166,35,0.1)',
            color: '#F5A623',
            border: '1px solid rgba(245,166,35,0.25)',
          }}
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </Link>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const MUMBAI: [number, number] = [19.076, 72.8777]

export default function MapDiscovery() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [listingFilter, setListingFilter] = useState<ListingFilter>('all')
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)

  const filtered = MOCK_PROPERTIES.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    if (listingFilter !== 'all' && p.listingType !== listingFilter) return false
    return true
  })

  const handleSelect = useCallback((prop: Property) => {
    setSelectedId(prop.id)
    setFlyTo([prop.coordinates.lat, prop.coordinates.lng])
    if (!panelOpen) setPanelOpen(true)
    // Scroll card into view
    setTimeout(() => {
      document.getElementById(`card-${prop.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }, [panelOpen])

  return (
    <div className="relative flex" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <div
        className="flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300"
        style={{
          width: panelOpen ? 316 : 0,
          background: '#0A0C18',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {panelOpen && (
          <>
            {/* Header + filters */}
            <div
              className="flex-shrink-0 p-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">Discover Properties</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <SlidersHorizontal className="w-4 h-4" style={{ color: '#6B7280' }} />
              </div>

              {/* Type chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {TYPE_OPTS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTypeFilter(t.value)}
                    className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
                    style={
                      typeFilter === t.value
                        ? { background: '#F5A623', color: '#1A1A2E' }
                        : { background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Listing chips */}
              <div className="flex gap-1.5">
                {LISTING_OPTS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setListingFilter(l.value)}
                    className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
                    style={
                      listingFilter === l.value
                        ? { background: 'rgba(245,166,35,0.18)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.6)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6B7280', border: '1px solid transparent' }
                    }
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: '#374151' }} />
                  <p className="text-sm" style={{ color: '#6B7280' }}>No properties match your filters</p>
                </div>
              ) : (
                filtered.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    prop={prop}
                    selected={selectedId === prop.id}
                    onClick={() => handleSelect(prop)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Sidebar toggle ──────────────────────────────────────── */}
      <button
        onClick={() => setPanelOpen((o) => !o)}
        className="absolute z-[1001] flex items-center justify-center rounded-r-lg transition-all duration-300"
        style={{
          left: panelOpen ? 316 : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 18,
          height: 48,
          background: '#0A0C18',
          border: '1px solid rgba(245,166,35,0.25)',
          borderLeft: 'none',
          color: '#F5A623',
        }}
      >
        {panelOpen
          ? <ChevronLeft className="w-3 h-3" />
          : <ChevronRight className="w-3 h-3" />}
      </button>

      {/* ── Map ─────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        {/* Floating count badge */}
        <div
          className="absolute top-3 right-3 z-[1000] flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(10,12,24,0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245,166,35,0.2)',
            color: '#9CA3AF',
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F5A623' }} />
          {filtered.length} on map
        </div>

        {/* Clear selection */}
        {selectedId && (
          <button
            onClick={() => setSelectedId(null)}
            className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(10,12,24,0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(245,166,35,0.35)',
              color: '#F5A623',
            }}
          >
            ✕ Clear selection
          </button>
        )}

        <MapContainer
          center={MUMBAI}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com" target="_blank">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          <MapController fly={flyTo} />
          {filtered.map((prop) => (
            <Marker
              key={prop.id}
              position={[prop.coordinates.lat, prop.coordinates.lng]}
              icon={pinIcon(fmtShort(prop), selectedId === prop.id)}
              eventHandlers={{ click: () => handleSelect(prop) }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
