export interface Person {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  pan: string;
  aadhar: string;
  photo?: string;
}

export interface FamilyMember extends Person {
  role: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  isLegalHeir: boolean;
  sharePercentage: number;
}

export interface BeneficiaryShare {
  personId: string;
  percentage: number;
  conditions?: string;
}

export interface Asset {
  id: string;
  type: 'property' | 'investment' | 'vehicle' | 'jewelry' | 'other';
  name: string;
  description: string;
  value: number;
  location: string;
  documents: string[];
  beneficiaries: BeneficiaryShare[];
}

export interface LegalOpinion {
  id: string;
  lawyerName: string;
  firm: string;
  opinion: string;
  date: string;
  fee: number;
}

export interface Will {
  id: string;
  testatorId: string;
  title: string;
  status: 'draft' | 'active' | 'probate';
  assets: string[];
  executorId: string;
  witnessIds: string[];
  createdAt: string;
  signedAt?: string;
  legalOpinionId?: string;
  content: string;
}

export interface EstateStats {
  totalAssets: number;
  totalValue: number;
  coveredInWill: number;
  notCoveredValue: number;
  beneficiaries: number;
  properties: number;
  financialAssets: number;
}

export interface MyVaultSync {
  synced: boolean;
  lastSyncTime: string;
  status: 'synced' | 'syncing' | 'pending' | 'error';
}
