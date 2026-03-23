import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDiscount(pct: number | null | undefined): string {
  if (pct == null || pct <= 0) return '';
  return `${Math.round(pct)}% off`;
}

export function savingsBadgeColor(pct: number): string {
  if (pct >= 60) return 'bg-green-100 text-green-800 border-green-200';
  if (pct >= 40) return 'bg-lime-100 text-lime-800 border-lime-200';
  if (pct >= 20) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

export const PORTAL_DISPLAY: Record<string, { label: string; color: string }> = {
  '1mg':       { label: '1mg',       color: '#e84545' },
  pharmeasy:   { label: 'PharmEasy', color: '#5e60ce' },
  netmeds:     { label: 'Netmeds',   color: '#00b4d8' },
  apollo:      { label: 'Apollo',    color: '#0077b6' },
  medplus:     { label: 'MedPlus',   color: '#f77f00' },
  flipkart:    { label: 'Flipkart',  color: '#2874f0' },
  amazon:      { label: 'Amazon',    color: '#ff9900' },
  jiomart:     { label: 'JioMart',   color: '#003087' },
  tata1mg:     { label: 'Tata 1mg',  color: '#e84545' },
  healthmug:   { label: 'HealthMug', color: '#43aa8b' },
  truemeds:    { label: 'Truemeds',  color: '#4cc9f0' },
  saveo:       { label: 'Saveo',     color: '#7209b7' },
  wellnessforever: { label: 'Wellness Forever', color: '#3a86ff' },
  reliancesmart:   { label: 'Reliance Smart', color: '#ef233c' },
};

export function portalLabel(portal: string): string {
  return PORTAL_DISPLAY[portal]?.label ?? portal;
}

export function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'md_sid';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = generateSessionId();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}
