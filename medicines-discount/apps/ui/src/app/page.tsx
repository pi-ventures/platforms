import Link from 'next/link';
import { ShieldCheck, TrendingDown, MapPin, Pill, ChevronRight } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

const POPULAR_SALTS = [
  { name: 'Metformin 500mg',       slug: 'metformin-hydrochloride', category: 'Antidiabetic' },
  { name: 'Atorvastatin 10mg',     slug: 'atorvastatin',            category: 'Cardiac' },
  { name: 'Pantoprazole 40mg',     slug: 'pantoprazole',            category: 'Gastric' },
  { name: 'Amlodipine 5mg',        slug: 'amlodipine',              category: 'Cardiac' },
  { name: 'Paracetamol 500mg',     slug: 'paracetamol',             category: 'Pain Relief' },
  { name: 'Amoxicillin 500mg',     slug: 'amoxicillin',             category: 'Antibiotic' },
  { name: 'Cetirizine 10mg',       slug: 'cetirizine',              category: 'Allergy' },
  { name: 'Omeprazole 20mg',       slug: 'omeprazole',              category: 'Gastric' },
];

const PORTALS = ['1mg', 'PharmEasy', 'Netmeds', 'Apollo', 'MedPlus', 'Flipkart', 'Amazon', 'JioMart', 'Truemeds', 'Saveo', '+4 more'];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-700 to-brand-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/40 border border-brand-400/40 rounded-full px-3 py-1 text-xs md:text-sm mb-5">
            <TrendingDown className="w-3.5 h-3.5 shrink-0" />
            Compare prices across 14 pharmacies — save up to 80%
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Find the cheapest price for your medicines
          </h1>
          <p className="text-brand-100 text-base md:text-lg mb-8 px-2">
            Real-time prices from 1mg, PharmEasy, Apollo, Netmeds &amp; 10 more portals.
            Find generic alternatives &amp; nearby Jan Aushadhi Kendras.
          </p>

          <div className="max-w-xl mx-auto">
            <SearchBar autoFocus size="lg" />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {POPULAR_SALTS.slice(0, 4).map(s => (
              <Link
                key={s.slug}
                href={`/salt/${s.slug}`}
                className="text-sm bg-brand-500/30 border border-brand-400/30 hover:bg-brand-500/50 rounded-full px-3 py-1 transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portals strip */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide text-sm text-gray-500">
            <span className="shrink-0 font-semibold text-gray-700">Comparing:</span>
            {PORTALS.map(p => (
              <span key={p} className="shrink-0 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingDown className="w-5 h-5 text-brand-700" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Real-time Price Comparison</h3>
            <p className="text-sm text-gray-500">
              Prices refreshed daily across 14 online pharmacies. Always see the best available price at a glance.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Pill className="w-5 h-5 text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Generic &amp; Jan Aushadhi Alternatives</h3>
            <p className="text-sm text-gray-500">
              For every branded drug, we show cheaper generic equivalents — including Jan Aushadhi store prices up to 80% lower.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Find Jan Aushadhi Kendra Near You</h3>
            <p className="text-sm text-gray-500">
              Enter your PIN code to find the nearest government Jan Aushadhi pharmacy with verified hours &amp; contact.
            </p>
          </div>
        </div>
      </section>

      {/* Popular salts */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Popular Medicines by Salt</h2>
          <Link href="/search" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {POPULAR_SALTS.map(s => (
            <Link
              key={s.slug}
              href={`/salt/${s.slug}`}
              className="bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm p-4 transition-all group"
            >
              <p className="text-xs font-medium text-brand-600 mb-1">{s.category}</p>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">{s.name}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-0.5">
                Compare prices <ChevronRight className="w-3 h-3" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Jan Aushadhi CTA */}
      <section className="bg-green-50 border-t border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-green-700" />
              <span className="font-semibold text-green-800">Jan Aushadhi Kendra Locator</span>
            </div>
            <p className="text-sm text-green-700 max-w-md">
              Over 10,000 government pharmacies across India selling generic medicines at up to 80% below MRP. Find the nearest one to you.
            </p>
          </div>
          <Link
            href="/kendras"
            className="shrink-0 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Find Kendras Near Me →
          </Link>
        </div>
      </section>
    </div>
  );
}
