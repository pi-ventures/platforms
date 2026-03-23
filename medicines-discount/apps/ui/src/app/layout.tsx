import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'medicines.discount — Compare Medicine Prices in India',
    template: '%s | medicines.discount',
  },
  description:
    'Compare medicine prices across 14 pharmacies — 1mg, PharmEasy, Apollo, Netmeds, MedPlus & more. Find generics, Jan Aushadhi alternatives and save up to 80%.',
  keywords: ['medicine price comparison', 'generic medicines', 'jan aushadhi', 'cheap medicines india'],
  openGraph: {
    siteName: 'medicines.discount',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-100 bg-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-gray-400">
            <p className="mb-1">
              medicines.discount — India&apos;s most comprehensive medicine price aggregator
            </p>
            <p>
              We compare prices from 14 portals to help you save. Prices are indicative — always verify on the pharmacy website before purchase.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
