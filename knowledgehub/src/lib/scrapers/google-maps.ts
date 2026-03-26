// ─────────────────────────────────────────────────────────────────────────────
// Google Maps Business Discovery Scraper
//
// Discovers businesses by category + location using Google Places API
// Results stored in GoogleMapsBusiness table → deduped → merged into Company
//
// Flow:
//   1. Search by category + pincode/district
//   2. Store raw results in GoogleMapsBusiness
//   3. Match against existing Company records (GSTIN, name, address)
//   4. Create new Company records for unmatched businesses
//   5. Sync to IQEdge for cross-vertical intelligence
// ─────────────────────────────────────────────────────────────────────────────

import prisma from '@/lib/prisma'

// Business verticals we scrape — maps to platform verticals
export const SCRAPE_CATEGORIES = {
  // YesBroker vertical
  real_estate: ['real_estate_agency', 'real_estate_agent', 'property_developer', 'housing_society'],

  // TheCredit vertical
  finance: ['bank', 'atm', 'accounting', 'financial_consultant', 'insurance_agency', 'loan_agency'],

  // LegalOpinion vertical
  legal: ['lawyer', 'law_firm', 'court', 'notary', 'legal_services'],

  // MedicinesDiscount vertical
  healthcare: ['pharmacy', 'hospital', 'doctor', 'medical_store', 'clinic', 'dentist', 'veterinary_care'],

  // JustBuild vertical
  construction: ['general_contractor', 'construction_company', 'architect', 'civil_engineer', 'hardware_store', 'building_materials'],

  // CuriousHat vertical
  education: ['school', 'university', 'college', 'coaching_centre', 'tutor', 'library', 'training_institute'],

  // TheEquinox vertical
  trading: ['stock_broker', 'commodity_market', 'financial_advisor'],

  // General business
  retail: ['shopping_mall', 'supermarket', 'grocery_store', 'clothing_store', 'electronics_store'],
  food: ['restaurant', 'cafe', 'bakery', 'food_delivery', 'catering'],
  services: ['plumber', 'electrician', 'car_repair', 'salon', 'gym', 'hotel', 'travel_agency'],
  manufacturing: ['factory', 'warehouse', 'industrial_area'],
}

export type ScrapeCategory = keyof typeof SCRAPE_CATEGORIES

interface PlaceResult {
  placeId: string
  name: string
  formattedAddress: string
  latitude: number
  longitude: number
  types: string[]
  primaryType?: string
  rating?: number
  totalRatings?: number
  priceLevel?: number
  phone?: string
  website?: string
  googleUrl?: string
  openNow?: boolean
  businessHours?: Record<string, string>
  photos?: number
  isVerified?: boolean
}

/**
 * Search Google Places API for businesses in an area
 * Requires GOOGLE_MAPS_API_KEY in env
 */
export async function searchPlaces(
  query: string,
  location: { lat: number; lng: number },
  radius: number = 5000, // meters
  type?: string,
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY not set')

  const params = new URLSearchParams({
    query,
    location: `${location.lat},${location.lng}`,
    radius: radius.toString(),
    key: apiKey,
  })
  if (type) params.set('type', type)

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error: ${data.status} — ${data.error_message || ''}`)
  }

  const results: PlaceResult[] = (data.results || []).map((p: any) => ({
    placeId: p.place_id,
    name: p.name,
    formattedAddress: p.formatted_address,
    latitude: p.geometry?.location?.lat,
    longitude: p.geometry?.location?.lng,
    types: p.types || [],
    rating: p.rating,
    totalRatings: p.user_ratings_total,
    priceLevel: p.price_level,
    openNow: p.opening_hours?.open_now,
    photos: p.photos?.length || 0,
    googleUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
  }))

  // Fetch details for each (phone, website, hours)
  // Note: This costs extra API calls — do selectively
  return results
}

/**
 * Get detailed info for a specific place
 */
export async function getPlaceDetails(placeId: string): Promise<Partial<PlaceResult>> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY not set')

  const fields = 'name,formatted_phone_number,website,opening_hours,business_status,url,types'
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK') return {}

  const r = data.result
  return {
    phone: r.formatted_phone_number,
    website: r.website,
    businessHours: r.opening_hours?.weekday_text?.reduce((acc: Record<string, string>, day: string) => {
      const [name, ...hours] = day.split(': ')
      acc[name.toLowerCase()] = hours.join(': ')
      return acc
    }, {}),
    googleUrl: r.url,
    isVerified: r.business_status === 'OPERATIONAL',
  }
}

/**
 * Extract city, state, pincode from Google's formatted address
 */
function parseAddress(address: string): { city?: string; state?: string; pincode?: string } {
  const pincodeMatch = address.match(/\b(\d{6})\b/)
  const pincode = pincodeMatch ? pincodeMatch[1] : undefined

  // Indian states
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh', 'Puducherry', 'Jammu and Kashmir', 'Ladakh',
  ]

  let state: string | undefined
  for (const s of states) {
    if (address.includes(s)) { state = s; break }
  }

  // City is typically before the state/pincode
  const parts = address.split(',').map(p => p.trim())
  const city = parts.length >= 3 ? parts[parts.length - 3] : parts[0]

  return { city, state, pincode }
}

/**
 * Run a scrape job for a category + area
 * Stores results in GoogleMapsBusiness, creates ScraperJob log
 */
export async function runScrapeJob(params: {
  category: ScrapeCategory
  state?: string
  district?: string
  pincode?: string
  lat?: number
  lng?: number
  radius?: number
}): Promise<{ jobId: string; found: number; newEntries: number }> {
  const { category, state, district, pincode, lat, lng, radius = 5000 } = params

  // Build search query
  const types = SCRAPE_CATEGORIES[category]
  const locationQuery = pincode || district || state || 'India'
  const query = `${types[0].replace(/_/g, ' ')} in ${locationQuery}`

  // Create job record
  const job = await prisma.scraperJob.create({
    data: {
      source: 'google_maps',
      query,
      targetArea: { state, district, pincode, lat, lng, radius } as any,
      category,
      status: 'running',
      startedAt: new Date(),
    },
  })

  try {
    // If lat/lng not provided, use a default for the area
    const searchLat = lat || 28.6139 // default Delhi
    const searchLng = lng || 77.2090

    const results = await searchPlaces(query, { lat: searchLat, lng: searchLng }, radius, types[0])

    let newEntries = 0
    for (const place of results) {
      const parsed = parseAddress(place.formattedAddress)

      // Check if already exists
      const existing = await prisma.googleMapsBusiness.findUnique({
        where: { placeId: place.placeId },
      })

      if (!existing) {
        await prisma.googleMapsBusiness.create({
          data: {
            placeId: place.placeId,
            name: place.name,
            formattedAddress: place.formattedAddress,
            latitude: place.latitude,
            longitude: place.longitude,
            types: place.types,
            primaryType: place.types[0],
            rating: place.rating,
            totalRatings: place.totalRatings,
            priceLevel: place.priceLevel,
            phone: place.phone,
            website: place.website,
            googleUrl: place.googleUrl,
            isVerified: place.isVerified || false,
            photos: place.photos,
            city: parsed.city,
            state: parsed.state,
            pincode: parsed.pincode,
            searchQuery: query,
            searchCategory: category,
            batchId: job.id,
            matchStatus: 'pending',
          },
        })
        newEntries++
      }
    }

    // Update job
    await prisma.scraperJob.update({
      where: { id: job.id },
      data: {
        status: 'completed',
        totalFound: results.length,
        totalNew: newEntries,
        completedAt: new Date(),
      },
    })

    return { jobId: job.id, found: results.length, newEntries }
  } catch (error) {
    await prisma.scraperJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: (error as Error).message, completedAt: new Date() },
    })
    throw error
  }
}

/**
 * Match Google Maps businesses to existing Company records
 * Uses: name similarity, address match, phone match
 */
export async function matchBusinessesToCompanies(): Promise<{ matched: number; newCompanies: number }> {
  const pending = await prisma.googleMapsBusiness.findMany({
    where: { matchStatus: 'pending' },
    take: 500,
  })

  let matched = 0
  let newCompanies = 0

  for (const biz of pending) {
    // Try to match by phone or name+city
    let company = null

    if (biz.phone) {
      company = await prisma.company.findFirst({
        where: { phone: biz.phone },
      })
    }

    if (!company && biz.name) {
      company = await prisma.company.findFirst({
        where: {
          name: { contains: biz.name, mode: 'insensitive' },
          city: biz.city || undefined,
        },
      })
    }

    if (company) {
      // Update existing company with Google Maps data
      await prisma.company.update({
        where: { id: company.id },
        data: {
          googlePlaceId: biz.placeId,
          googleRating: biz.rating,
          googleReviews: biz.totalRatings,
          googleCategory: biz.primaryType,
          googlePhotos: biz.photos,
          googleUrl: biz.googleUrl,
          isGoogleVerified: biz.isVerified,
          lastScrapedAt: biz.scrapedAt,
          latitude: biz.latitude,
          longitude: biz.longitude,
          enrichedFrom: { push: 'google_maps' },
        },
      })

      await prisma.googleMapsBusiness.update({
        where: { id: biz.id },
        data: { matchedCompanyId: company.id, matchScore: 0.8, matchStatus: 'matched' },
      })
      matched++
    } else {
      // Create new company from Google Maps data
      const newCompany = await prisma.company.create({
        data: {
          name: biz.name,
          type: inferBusinessType(biz.primaryType || ''),
          status: 'active',
          city: biz.city,
          state: biz.state,
          pincode: biz.pincode,
          operatingAddress: biz.formattedAddress,
          phone: biz.phone,
          website: biz.website,
          latitude: biz.latitude,
          longitude: biz.longitude,
          googlePlaceId: biz.placeId,
          googleRating: biz.rating,
          googleReviews: biz.totalRatings,
          googleCategory: biz.primaryType,
          googlePhotos: biz.photos,
          googleUrl: biz.googleUrl,
          isGoogleVerified: biz.isVerified,
          lastScrapedAt: biz.scrapedAt,
          businessActivity: biz.primaryType?.replace(/_/g, ' '),
          source: 'google_maps',
          enrichedFrom: ['google_maps'],
        },
      })

      await prisma.googleMapsBusiness.update({
        where: { id: biz.id },
        data: { matchedCompanyId: newCompany.id, matchScore: 1.0, matchStatus: 'new_company' },
      })
      newCompanies++
    }
  }

  return { matched, newCompanies }
}

function inferBusinessType(googleType: string): string {
  // Most Google Maps businesses in India are sole proprietorships or partnerships
  const corporateTypes = ['bank', 'insurance', 'stock_broker']
  if (corporateTypes.some(t => googleType.includes(t))) return 'private_ltd'

  const govtTypes = ['school', 'university', 'hospital', 'court', 'post_office']
  if (govtTypes.some(t => googleType.includes(t))) return 'government'

  // Default: most Indian small businesses
  return 'sole_proprietorship'
}
