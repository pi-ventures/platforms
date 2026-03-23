import {
  VaultProfile,
  NetWorthBreakdown,
  SyncSource,
  MonthlySummary,
  KnowledgeHubPayload,
  AggregateAnalytics,
  Property,
  Holding,
  Will,
  Beneficiary,
} from './types';

export const mockProfile: VaultProfile = {
  id: 'user_rajesh_sharma_001',
  name: 'Rajesh Sharma',
  email: 'rajesh@myvault.com',
  type: 'individual',
  plan: 'wealth',
  totalNetWorth: 120200000, // ₹1.202 Crore
  syncSources: [
    {
      id: 'yesbroker',
      name: 'YesBroker',
      status: 'synced',
      lastSync: new Date(Date.now() - 5 * 60000),
      enabled: true,
      description: 'Real Estate Properties & Broker Data',
    },
    {
      id: 'theequinox',
      name: 'TheEquinox.ai',
      status: 'synced',
      lastSync: new Date(Date.now() - 12 * 60000),
      enabled: true,
      description: 'Stock Portfolio & Investments',
    },
    {
      id: 'mywills',
      name: 'MyWills (iWills)',
      status: 'synced',
      lastSync: new Date(Date.now() - 2 * 3600000),
      enabled: true,
      description: 'Will & Estate Data (via legalopinion.co.in)',
    },
  ],
};

export const mockNetWorth: NetWorthBreakdown = {
  realEstate: 68000000, // ₹6.8 Crore
  investments: 3540000, // ₹35.4 Lakhs
  willAssets: 43500000, // ₹4.35 Crore
  cash: 1200000, // ₹12 Lakhs
  other: 500000, // ₹5 Lakhs
  total: 120200000, // ₹1.202 Crore (approx 12.02 Cr)
};

export const mockProperties: Property[] = [
  {
    id: 'prop_001',
    address: 'Bandra, Mumbai - 2 BHK Luxury Apartment',
    type: 'residential',
    value: 25000000,
    status: 'active',
    roi: 15.5,
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'prop_002',
    address: 'Worli, Mumbai - Commercial Office Space',
    type: 'commercial',
    value: 28000000,
    status: 'active',
    roi: 18.2,
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'prop_003',
    address: 'Powai, Mumbai - Premium Residential Plot',
    type: 'land',
    value: 15000000,
    status: 'active',
    roi: 12.8,
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'prop_004',
    address: 'Fort, Mumbai - Heritage Building',
    type: 'commercial',
    value: 22000000,
    status: 'rented',
    roi: 9.5,
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'prop_005',
    address: 'Andheri, Mumbai - Residential Complex',
    type: 'residential',
    value: 18000000,
    status: 'active',
    roi: 11.2,
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
];

export const mockHoldings: Holding[] = [
  {
    id: 'hold_001',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    quantity: 100,
    currentPrice: 3850,
    totalValue: 385000,
    investedValue: 320000,
    gain: 65000,
    gainPercent: 20.31,
    lastUpdated: new Date(Date.now() - 12 * 60000),
  },
  {
    id: 'hold_002',
    symbol: 'INFY',
    name: 'Infosys Limited',
    quantity: 150,
    currentPrice: 1950,
    totalValue: 292500,
    investedValue: 250000,
    gain: 42500,
    gainPercent: 17.0,
    lastUpdated: new Date(Date.now() - 12 * 60000),
  },
  {
    id: 'hold_003',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    quantity: 50,
    currentPrice: 2850,
    totalValue: 142500,
    investedValue: 130000,
    gain: 12500,
    gainPercent: 9.62,
    lastUpdated: new Date(Date.now() - 12 * 60000),
  },
  {
    id: 'hold_004',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    quantity: 200,
    currentPrice: 1780,
    totalValue: 356000,
    investedValue: 340000,
    gain: 16000,
    gainPercent: 4.71,
    lastUpdated: new Date(Date.now() - 12 * 60000),
  },
  {
    id: 'hold_005',
    symbol: 'SBIN',
    name: 'State Bank of India',
    quantity: 300,
    currentPrice: 825,
    totalValue: 247500,
    investedValue: 220000,
    gain: 27500,
    gainPercent: 12.5,
    lastUpdated: new Date(Date.now() - 12 * 60000),
  },
];

export const mockWill: Will = {
  id: 'will_001',
  name: 'Primary Will - Rajesh Sharma',
  status: 'active',
  createdDate: new Date('2023-06-15'),
  lastUpdated: new Date(Date.now() - 2 * 3600000),
  beneficiaries: ['Priya Sharma', 'Arjun Sharma', 'Meera Sharma'],
};

export const mockBeneficiaries: Beneficiary[] = [
  {
    name: 'Priya Sharma',
    relationship: 'Spouse',
    allocation: 40,
  },
  {
    name: 'Arjun Sharma',
    relationship: 'Son',
    allocation: 35,
  },
  {
    name: 'Meera Sharma',
    relationship: 'Daughter',
    allocation: 25,
  },
];

export const mockMonthlySummary: MonthlySummary[] = [
  { month: 'Mar 2025', netWorth: 110500000, realEstate: 62000000, investments: 3200000, willAssets: 42000000 },
  { month: 'Apr 2025', netWorth: 111800000, realEstate: 63000000, investments: 3250000, willAssets: 42300000 },
  { month: 'May 2025', netWorth: 113200000, realEstate: 64000000, investments: 3450000, willAssets: 42600000 },
  { month: 'Jun 2025', netWorth: 115100000, realEstate: 65000000, investments: 3550000, willAssets: 43000000 },
  { month: 'Jul 2025', netWorth: 116500000, realEstate: 65500000, investments: 3600000, willAssets: 43200000 },
  { month: 'Aug 2025', netWorth: 117800000, realEstate: 66000000, investments: 3700000, willAssets: 43400000 },
  { month: 'Sep 2025', netWorth: 118900000, realEstate: 66500000, investments: 3800000, willAssets: 43600000 },
  { month: 'Oct 2025', netWorth: 119500000, realEstate: 67000000, investments: 3900000, willAssets: 43800000 },
  { month: 'Nov 2025', netWorth: 119800000, realEstate: 67500000, investments: 3950000, willAssets: 43900000 },
  { month: 'Dec 2025', netWorth: 120100000, realEstate: 67800000, investments: 3980000, willAssets: 43950000 },
  { month: 'Jan 2026', netWorth: 120150000, realEstate: 67900000, investments: 4050000, willAssets: 43980000 },
  { month: 'Feb 2026', netWorth: 120200000, realEstate: 68000000, investments: 3540000, willAssets: 43500000 },
];

export const mockAggregateAnalytics: AggregateAnalytics = {
  totalAssets: 120200000,
  totalLiabilities: 0,
  netWorthGrowthYoY: 8.8,
  diversificationScore: 82,
  riskProfile: 'moderate',
  taxOptimizationScore: 75,
};

export const mockKnowledgeHubPayload: KnowledgeHubPayload = {
  userId: mockProfile.id,
  timestamp: new Date(),
  profile: mockProfile,
  netWorth: mockNetWorth,
  syncSources: mockProfile.syncSources,
  aggregateAnalytics: mockAggregateAnalytics,
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const formatCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
};
