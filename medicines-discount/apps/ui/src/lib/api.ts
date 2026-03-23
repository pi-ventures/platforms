import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8007';
const api = axios.create({ baseURL: BASE, timeout: 10_000 });

export interface DrugPrice {
  portal: string; portal_url: string | null; affiliate_url: string | null;
  mrp: number | null; selling_price: number | null; discount_pct: number | null;
  price_per_unit: number | null; cashback_pct: number | null; effective_price: number | null;
  in_stock: boolean;
}

export interface GenericEquivalent {
  id: number; brand_name: string; slug: string; manufacturer_name: string | null;
  mrp: number | null; jan_aushadhi_price: number | null; best_price: number | null;
  best_portal: string | null; savings_pct: number | null; is_generic: boolean; is_govt_brand: boolean;
}

export interface DrugDetail {
  id: number; brand_name: string; slug: string; salt_name: string; salt_slug: string;
  strength: string; pack_size: string | null; dosage_form: string | null;
  therapeutic_category: string | null; therapeutic_slug: string | null;
  rx_required: boolean; schedule: string | null; manufacturer_name: string | null;
  mrp: number | null; nppa_ceiling_price: number | null; jan_aushadhi_price: number | null;
  uses: string | null; side_effects: string | null;
  prices: DrugPrice[]; generic_equivalents: GenericEquivalent[];
  best_price: number | null; best_portal: string | null; generic_price: number | null;
  max_saving_pct: number | null; portal_count: number;
}

export interface DrugSummary {
  id: number; brand_name: string; slug: string; salt_name: string; strength: string;
  manufacturer_name: string | null; therapeutic_category: string | null;
  is_generic: boolean; is_govt_brand: boolean; mrp: number | null;
  jan_aushadhi_price: number | null; best_price: number | null; best_portal: string | null;
  portal_count: number;
}

export interface SaltBrand {
  id: number; brand_name: string; slug: string; strength: string; pack_size: string | null;
  manufacturer_name: string | null; is_generic: boolean; is_govt_brand: boolean;
  mrp: number | null; jan_aushadhi_price: number | null; best_price: number | null;
  best_portal: string | null; savings_pct: number | null;
}

export interface SaltDetail {
  salt_slug: string; salt_name: string; therapeutic_category: string | null;
  brand_count: number; cheapest_price: number | null; ja_price: number | null;
  max_saving_pct: number | null; brands: SaltBrand[];
}

export interface SearchResult {
  drugs: Array<{ id: number; brand_name: string; slug: string; salt_name: string;
    strength: string; manufacturer_name: string | null; mrp: number | null;
    best_price: number | null; best_portal: string | null; }>;
  salts: Array<{ salt_slug: string; salt_name: string; brand_count: number; cheapest_price: number | null; }>;
  total: number;
}

export interface Kendra {
  id: number; name: string; address: string | null; pin_code: string;
  area: string | null; city: string | null; state: string;
  lat: number | null; lng: number | null; phone: string | null;
  hours: string | null; is_verified: boolean;
}

export interface Manufacturer {
  id: number; name: string; slug: string; city: string | null; state: string | null;
  who_gmp: boolean; drug_count: number;
  drugs: Array<{ brand_name: string; slug: string; salt_name: string; strength: string; best_price: number | null }>;
}

export async function searchDrugs(q: string): Promise<SearchResult> {
  const { data } = await api.get('/api/search', { params: { q, limit: 20 } });
  return data;
}
export async function getDrug(slug: string): Promise<DrugDetail> {
  const { data } = await api.get(`/api/drugs/${slug}`);
  return data;
}
export async function getSalt(slug: string): Promise<SaltDetail> {
  const { data } = await api.get(`/api/salts/${slug}`);
  return data;
}
export async function getKendras(pin: string): Promise<Kendra[]> {
  const { data } = await api.get('/api/kendras', { params: { pin_code: pin, limit: 20 } });
  return data;
}
export async function getManufacturer(slug: string): Promise<Manufacturer> {
  const { data } = await api.get(`/api/manufacturers/${slug}`);
  return data;
}
export async function getDrugsList(params: {
  therapeutic_category?: string; is_generic?: boolean;
  manufacturer_slug?: string; limit?: number; offset?: number;
} = {}): Promise<DrugSummary[]> {
  const { data } = await api.get('/api/drugs', { params });
  return data;
}
export async function trackAffiliateClick(drugId: number, portal: string, sessionId: string) {
  await api.post('/api/affiliate/click', { drug_id: drugId, portal, session_id: sessionId });
}
