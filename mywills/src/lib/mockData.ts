import { Person, FamilyMember, Asset, Will, LegalOpinion, EstateStats, MyVaultSync } from './types';

// Testator - Primary user
export const testator: Person = {
  id: 'testator-001',
  name: 'Ramesh Agarwal',
  relationship: 'Self',
  phone: '+91 98765 43210',
  email: 'ramesh.agarwal@email.com',
  address: '4-B Lotus Tower, Worli, Mumbai 400025',
  dob: '1955-05-15',
  pan: 'AAAPA1234A',
  aadhar: '1234 5678 9012',
  photo: 'https://api.placeholder.com/150?text=RA',
};

// Family members
export const familyMembers: FamilyMember[] = [
  {
    id: 'fm-001',
    name: 'Sunita Agarwal',
    relationship: 'Spouse',
    phone: '+91 98765 43211',
    email: 'sunita.agarwal@email.com',
    address: '4-B Lotus Tower, Worli, Mumbai 400025',
    dob: '1958-08-22',
    pan: 'BBAPB5678B',
    aadhar: '1234 5678 9013',
    role: 'spouse',
    isLegalHeir: true,
    sharePercentage: 40,
  },
  {
    id: 'fm-002',
    name: 'Vikram Agarwal',
    relationship: 'Son',
    phone: '+91 98765 43212',
    email: 'vikram.agarwal@email.com',
    address: 'A-101 Skyline Tower, Bandra, Mumbai 400050',
    dob: '1985-03-10',
    pan: 'CCAPC9012C',
    aadhar: '1234 5678 9014',
    role: 'child',
    isLegalHeir: true,
    sharePercentage: 30,
  },
  {
    id: 'fm-003',
    name: 'Priya Sharma',
    relationship: 'Daughter',
    phone: '+91 98765 43213',
    email: 'priya.sharma@email.com',
    address: '702 Harmony Heights, Pune 411001',
    dob: '1988-06-25',
    pan: 'DDAPD3456D',
    aadhar: '1234 5678 9015',
    role: 'child',
    isLegalHeir: true,
    sharePercentage: 25,
  },
  {
    id: 'fm-004',
    name: 'Suresh Agarwal',
    relationship: 'Brother',
    phone: '+91 98765 43214',
    email: 'suresh.agarwal@email.com',
    address: '102 Rainbow Court, Vile Parle, Mumbai 400056',
    dob: '1960-11-30',
    pan: 'EEAPE7890E',
    aadhar: '1234 5678 9016',
    role: 'sibling',
    isLegalHeir: false,
    sharePercentage: 0,
  },
  {
    id: 'fm-005',
    name: 'Kamla Agarwal',
    relationship: 'Mother',
    phone: '+91 98765 43215',
    email: 'kamla.agarwal@email.com',
    address: '4-B Lotus Tower, Worli, Mumbai 400025',
    dob: '1935-02-14',
    pan: 'FFAPF1234F',
    aadhar: '1234 5678 9017',
    role: 'parent',
    isLegalHeir: true,
    sharePercentage: 5,
  },
];

// Assets
export const assets: Asset[] = [
  {
    id: 'asset-001',
    type: 'property',
    name: 'Mumbai Residential Flat',
    description: '3 BHK flat with modern amenities',
    value: 250000000, // ₹2.5 Cr
    location: '4-B Lotus Tower, Worli, Mumbai 400025',
    documents: ['Title Deed', 'Property Registration', 'Tax Certificate'],
    beneficiaries: [
      { personId: 'fm-001', percentage: 50 },
      { personId: 'fm-002', percentage: 50 },
    ],
  },
  {
    id: 'asset-002',
    type: 'property',
    name: 'Pune Residential Plot',
    description: '2.5 acres agricultural land with villa construction',
    value: 8000000, // ₹80 L
    location: 'Talegaon, Pune 412114',
    documents: ['Title Deed', 'Survey Report', 'Occupation Certificate'],
    beneficiaries: [
      { personId: 'fm-002', percentage: 60 },
      { personId: 'fm-003', percentage: 40 },
    ],
  },
  {
    id: 'asset-003',
    type: 'investment',
    name: 'Mutual Funds Portfolio',
    description: 'Diversified MF portfolio across equity and debt',
    value: 4500000, // ₹45 L
    location: 'Digital - Demat Account',
    documents: ['MF Statements', 'Portfolio Report'],
    beneficiaries: [
      { personId: 'fm-001', percentage: 35 },
      { personId: 'fm-002', percentage: 35 },
      { personId: 'fm-003', percentage: 30 },
    ],
  },
  {
    id: 'asset-004',
    type: 'investment',
    name: 'Fixed Deposits',
    description: 'Bank FDs with multiple banks',
    value: 3000000, // ₹30 L
    location: 'Multiple Banks',
    documents: ['FD Certificates', 'Bank Statements'],
    beneficiaries: [
      { personId: 'fm-001', percentage: 100 },
    ],
  },
  {
    id: 'asset-005',
    type: 'jewelry',
    name: 'Gold Jewelry & Ornaments',
    description: 'Family heirlooms and daily wear gold',
    value: 1200000, // ₹12 L
    location: 'Home Safe',
    documents: ['Valuation Report', 'Insurance Certificate'],
    beneficiaries: [
      { personId: 'fm-001', percentage: 50 },
      { personId: 'fm-003', percentage: 50 },
    ],
  },
  {
    id: 'asset-006',
    type: 'vehicle',
    name: 'Honda City - White',
    description: '2015 Honda City, Automatic, 45k km',
    value: 800000, // ₹8 L
    location: 'Car Parking, Lotus Tower',
    documents: ['RC Certificate', 'Insurance Certificate', 'Registration'],
    beneficiaries: [
      { personId: 'fm-002', percentage: 100 },
    ],
  },
];

// Will
export const will: Will = {
  id: 'will-001',
  testatorId: 'testator-001',
  title: 'Last Will and Testament of Ramesh Agarwal',
  status: 'active',
  assets: ['asset-001', 'asset-002', 'asset-003', 'asset-004', 'asset-005', 'asset-006'],
  executorId: 'fm-001',
  witnessIds: ['fm-002', 'fm-003'],
  createdAt: '2024-01-15',
  signedAt: '2024-01-15',
  legalOpinionId: 'legalop-001',
  content: 'I, Ramesh Agarwal, being of sound mind and memory, hereby revoke all previous wills and declare this to be my Last Will and Testament...',
};

// Legal Opinion
export const legalOpinion: LegalOpinion = {
  id: 'legalop-001',
  lawyerName: 'Advocate Rajesh Kumar Singh',
  firm: 'Legal Opinion & Associates',
  opinion: 'The will is valid, comprehensive, and court-admissible. All legal requirements under the Indian Succession Act, 1872 have been met.',
  date: '2024-01-15',
  fee: 5000, // ₹5000
};

// Estate Statistics
export const estateStats: EstateStats = {
  totalAssets: 6,
  totalValue: 435000000, // ₹4.35 Cr
  coveredInWill: 6,
  notCoveredValue: 0,
  beneficiaries: 5,
  properties: 2,
  financialAssets: 4,
};

// MyVault Sync Status
export const myVaultSync: MyVaultSync = {
  synced: true,
  lastSyncTime: new Date().toISOString(),
  status: 'synced',
};

// Recent Activity
export const recentActivity = [
  {
    id: 1,
    type: 'will_updated',
    title: 'Will Status Changed to Active',
    description: 'Your will has been reviewed and approved by Legal Opinion',
    timestamp: '2024-01-15T10:30:00Z',
    icon: 'CheckCircle',
  },
  {
    id: 2,
    type: 'asset_added',
    title: 'Asset Added: Mutual Funds Portfolio',
    description: 'New investment asset added to estate',
    timestamp: '2024-01-10T14:20:00Z',
    icon: 'Plus',
  },
  {
    id: 3,
    type: 'family_added',
    title: 'Family Member Added',
    description: 'Kamla Agarwal added as mother',
    timestamp: '2024-01-05T09:15:00Z',
    icon: 'Users',
  },
  {
    id: 4,
    type: 'sync_completed',
    title: 'MyVault Sync Completed',
    description: 'Data synced with MyVault and legalopinion.co.in',
    timestamp: '2024-01-01T08:00:00Z',
    icon: 'RefreshCw',
  },
];
