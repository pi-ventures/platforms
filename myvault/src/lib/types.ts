export type SyncSourceId = 'yesbroker' | 'theequinox' | 'mywills';
export type SyncStatus = 'synced' | 'syncing' | 'error' | 'disconnected';
export type UserType = 'individual' | 'company';
export type PlanType = 'personal' | 'wealth' | 'family-office';

export interface SyncSource {
  id: SyncSourceId;
  name: string;
  status: SyncStatus;
  lastSync: Date;
  enabled: boolean;
  logo?: string;
  description?: string;
}

export interface RealEstateSnapshot {
  totalProperties: number;
  totalValue: number;
  activeListings: number;
  totalLeads: number;
  monthlyRevenue: number;
  syncedAt: Date;
}

export interface InvestmentSnapshot {
  totalPortfolioValue: number;
  totalInvested: number;
  totalPnL: number;
  pnlPercent: number;
  topHoldings: string[];
  syncedAt: Date;
}

export interface WillSnapshot {
  totalAssets: number;
  totalEstateValue: number;
  willStatus: 'draft' | 'review' | 'executed' | 'active';
  beneficiaries: number;
  legalOpinionStatus: 'pending' | 'approved' | 'rejected';
  syncedAt: Date;
}

export interface VaultProfile {
  id: string;
  name: string;
  email: string;
  type: UserType;
  plan: PlanType;
  totalNetWorth: number;
  syncSources: SyncSource[];
}

export interface NetWorthBreakdown {
  realEstate: number;
  investments: number;
  willAssets: number;
  cash: number;
  other: number;
  total: number;
}

export interface AggregateAnalytics {
  totalAssets: number;
  totalLiabilities: number;
  netWorthGrowthYoY: number;
  diversificationScore: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  taxOptimizationScore: number;
}

export interface KnowledgeHubPayload {
  userId: string;
  timestamp: Date;
  profile: VaultProfile;
  netWorth: NetWorthBreakdown;
  syncSources: SyncSource[];
  aggregateAnalytics: AggregateAnalytics;
}

export interface MonthlySummary {
  month: string;
  netWorth: number;
  realEstate: number;
  investments: number;
  willAssets: number;
}

export interface Property {
  id: string;
  address: string;
  type: 'residential' | 'commercial' | 'land';
  value: number;
  status: 'active' | 'rented' | 'sold';
  roi?: number;
  lastUpdated: Date;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  investedValue: number;
  gain: number;
  gainPercent: number;
  lastUpdated: Date;
}

export interface Will {
  id: string;
  name: string;
  status: 'draft' | 'review' | 'executed' | 'active';
  createdDate: Date;
  lastUpdated: Date;
  beneficiaries: string[];
}

export interface Beneficiary {
  name: string;
  relationship: string;
  allocation: number;
}
