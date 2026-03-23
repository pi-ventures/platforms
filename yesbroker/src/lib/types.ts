// ─────────────────────────────────────────────────────────────
//  YesBroker — Core TypeScript Types
// ─────────────────────────────────────────────────────────────

// ─── Project (Building-level) Details ────────────────────────
export interface ProjectConfig {
  type: string             // '1 BHK', '2 BHK', '3 BHK Compact', etc.
  carpetArea: number       // sq ft
  builtUpArea: number      // sq ft
  superBuiltUpArea: number // sq ft
  totalUnitsOfType: number
  priceMin: number
  priceMax: number
  facing?: string[]        // available facings for this config
}

export interface ProjectSpecifications {
  structure?: string
  flooring?: string
  walls?: string
  kitchen?: string
  bathrooms?: string
  doors?: string
  windows?: string
  electrical?: string
  waterSupply?: string
  elevators?: string
}

export interface ProjectDetails {
  name: string
  builderName: string
  builderSince?: number        // founding year
  builderDeliveredUnits?: number
  builderCompletedProjects?: number
  builderCities?: number
  aboutBuilder?: string
  totalUnits: number
  totalTowers: number
  landArea: number             // acres
  possessionDate: string       // e.g. 'Dec 2025' or 'Ready to Move'
  launchDate?: string          // e.g. 'Jan 2022'
  constructionStatus: 'under_construction' | 'ready_to_move' | 'new_launch'
  configurations: ProjectConfig[]
  specifications?: ProjectSpecifications
  projectHighlights?: string[] // bullet-point features of the project
  projectRera?: string
}

export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial' | 'office' | 'warehouse' | 'farm'
export type ListingType  = 'sale' | 'rent' | 'lease' | 'pg'
export type PropertyStatus = 'active' | 'draft' | 'sold' | 'rented' | 'expired'

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  listingType: ListingType
  status: PropertyStatus
  price: number
  priceUnit: 'total' | 'per_sqft' | 'per_month'
  area: number             // sq ft
  bedrooms?: number
  bathrooms?: number
  floor?: number
  totalFloors?: number
  facing?: string
  furnishing?: 'unfurnished' | 'semi' | 'fully'
  amenities: string[]
  images: string[]
  address: PropertyAddress
  coordinates: { lat: number; lng: number }
  brokerId: string
  brokerName: string
  createdAt: string
  updatedAt: string
  views: number
  leads: number
  rera?: string
  project?: ProjectDetails    // present for new-project / society listings
}

export interface PropertyAddress {
  line1: string
  line2?: string
  locality: string
  city: string
  state: string
  pincode: string
  landmark?: string
}

// ─── Lead / CRM ──────────────────────────────────────────────
export type LeadStatus = 'new' | 'contacted' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost'
export type LeadSource =
  | '99acres' | 'magicbricks' | 'housing' | 'nobroker' | 'sulekha'
  | 'commonfloor' | 'proptiger' | 'nestaway' | 'makaan' | 'quikr'
  | 'olx' | 'facebook_ads' | 'google_ads' | 'instagram' | 'whatsapp'
  | 'website' | 'referral' | 'walk_in' | 'call' | 'indiamart'
  | 'justdial' | 'tradeindia' | 'homeonline' | 'squareyards'
  | 'anarock' | 'acres99' | 'propertywala' | 'homeshikari'
  | 'other'

export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  source: LeadSource
  sourceLeadId?: string       // original ID on the advertising platform
  status: LeadStatus
  budget: { min: number; max: number }
  requirements: {
    type?: PropertyType[]
    listingType?: ListingType
    city: string
    localities?: string[]
    minArea?: number
    maxArea?: number
    bedrooms?: number[]
  }
  propertyId?: string         // if assigned to a specific property
  assignedTo?: string         // broker/agent user id
  notes: LeadNote[]
  followUps: FollowUp[]
  createdAt: string
  updatedAt: string
  lastContactedAt?: string
  closedAt?: string
  dealValue?: number
}

export interface LeadNote {
  id: string
  text: string
  createdBy: string
  createdAt: string
}

export interface FollowUp {
  id: string
  type: 'call' | 'whatsapp' | 'email' | 'site_visit' | 'meeting'
  scheduledAt: string
  completedAt?: string
  outcome?: string
  notes?: string
}

// ─── CRM Contact ─────────────────────────────────────────────
export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  type: 'buyer' | 'seller' | 'tenant' | 'owner' | 'investor'
  city: string
  tags: string[]
  totalDeals: number
  totalValue: number
  lastInteraction: string
  notes: string
  createdAt: string
}

// ─── Advertising Platform ────────────────────────────────────
export interface AdPlatform {
  id: string
  name: string
  slug: LeadSource
  logo: string
  color: string
  category: 'portal' | 'social' | 'search' | 'classifieds' | 'aggregator'
  connected: boolean
  apiKey?: string
  leadsToday: number
  leadsTotal: number
  activeCampaigns: number
  monthlyCost?: number
  rating: number
  indianRank?: number
}

// ─── Broker / User ───────────────────────────────────────────
export interface Broker {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  company?: string
  reraNumber?: string
  city: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  joinedAt: string
  stats: BrokerStats
  myVaultConnected: boolean
  myVaultSyncedAt?: string
}

export interface BrokerStats {
  totalProperties: number
  activeListings: number
  totalLeads: number
  newLeadsToday: number
  dealsClosedThisMonth: number
  revenueThisMonth: number
  conversionRate: number
  avgDealValue: number
}

// ─── Dashboard Analytics ─────────────────────────────────────
export interface DashboardMetric {
  label: string
  value: number | string
  change: number          // percentage change
  trend: 'up' | 'down' | 'flat'
  icon: string
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  leads: number
  deals: number
}

// ─── 3D Planner ──────────────────────────────────────────────
export interface Room {
  id: string
  name: string
  width: number
  height: number
  x: number
  y: number
  color: string
  furniture: Furniture[]
}

export interface Furniture {
  id: string
  type: string
  name: string
  width: number
  height: number
  x: number
  y: number
  rotation: number
  color: string
}

// ─── Visit / Schedule Visit System ───────────────────────────
export type VisitStatus =
  | 'REQUESTED'
  | 'AGENT_ASSIGNED'
  | 'OWNER_NOTIFIED'
  | 'ACCESS_GRANTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RATED'
  | 'CANCELLED'

export interface LocationPoint {
  lat: number
  lng: number
  updatedAt: string
}

export interface VisitRating {
  agentRating:    number   // 1–5
  propertyRating: number   // 1–5
  comment?:       string
  ratedAt:        string
}

export interface Visit {
  id:            string
  propertyId:    string
  propertyTitle: string
  propertyImg:   string
  propertyLoc:   string

  customerId:    string
  customerName:  string

  agentId?:      string
  /** Only revealed after ACCESS_GRANTED — hidden from customer until then */
  agentName?:    string
  agentPhone?:   string
  agentRating?:  number

  ownerId:       string
  ownerName:     string

  date:          string    // "YYYY-MM-DD"
  time:          string    // "HH:MM AM/PM"
  notes?:        string

  status:        VisitStatus
  cancelReason?: string

  /** 6-digit OTP, visible only to agent + customer when ACCESS_GRANTED */
  otp?:          string
  otpExpiry?:    string    // ISO timestamp

  /** Live locations — updated via PATCH /visits/:id/location */
  customerLoc?:  LocationPoint
  agentLoc?:     LocationPoint
  ownerLoc?:     LocationPoint

  rating?:       VisitRating

  requestedAt:   string
  assignedAt?:   string
  accessAt?:     string
  startedAt?:    string
  completedAt?:  string
  cancelledAt?:  string
}

// ─── MyVault Sync ────────────────────────────────────────────
export interface VaultSyncPayload {
  source: 'yesbroker'
  userId: string
  timestamp: string
  properties: Pick<Property, 'id'|'title'|'type'|'listingType'|'price'|'area'|'address'|'status'>[]
  leads: Pick<Lead, 'id'|'status'|'dealValue'|'createdAt'>[]
  stats: BrokerStats
}
