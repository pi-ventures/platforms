import type { Metadata } from 'next';
import Link from 'next/link';
import { searchDrugs } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';
import { ChevronRight, Layers, Pill } from 'lucide-react';

interface Props {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const q = searchParams.q ?? '';
  return {
    title: q ? `"${q}" — Search Results` : 'Search Medicines',
    description: `Compare prices for ${q || 'medicines'} across 14 pharmacies in India.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? '').trim();
  let results = null;

  if (q.length >= 2) {
    try {
      results = await searchDrugs(q);
    } catch {
      results = null;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {q ? `Results for "${q}"` : 'Search Medicines'}
        </h1>
        <SearchBar size="lg" placeholder="Search by drug name, salt or brand…" />
      </div>

      {!q && (
        <div className="text-center py-12 text-gray-400">
          <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Type at least 2 characters to search</p>
        </div>
      )}

      {q && !results && (
        <div className="text-center py-12 text-gray-400">
          <p>Could not fetch results. Please try again.</p>
        </div>
      )}

      {results && results.total === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium mb-2">No results for "{q}"</p>
          <p className="text-sm">Try searching by the salt/generic name (e.g. "metformin" instead of a brand)</p>
        </div>
      )}

      {results && results.total > 0 && (
        <div className="space-y-8">
          <p className="text-sm text-gray-400">{results.total} result{results.total !== 1 ? 's' : ''} found</p>

          {/* Salt results */}
          {results.salts.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                By Salt / Composition
              </h2>
              <div className="space-y-2">
                {results.salts.map(salt => (
                  <Link
                    key={salt.salt_slug}
                    href={`/salt/${salt.salt_slug}`}
                    className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm px-5 py-4 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{salt.salt_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{salt.brand_count} brands available</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {salt.cheapest_price != null && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">from</p>
                          <p className="text-base font-bold text-brand-700">{formatINR(salt.cheapest_price)}</p>
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Drug results */}
          {results.drugs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Specific Brands
              </h2>
              <div className="space-y-2">
                {results.drugs.map(drug => (
                  <Link
                    key={drug.id}
                    href={`/drug/${drug.slug}`}
                    className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm px-5 py-4 transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{drug.brand_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {drug.salt_name} · {drug.strength}
                        {drug.manufacturer_name && ` · ${drug.manufacturer_name}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <div className="text-right">
                        {drug.best_price != null ? (
                          <>
                            <p className="text-base font-bold text-brand-700">{formatINR(drug.best_price)}</p>
                            {drug.best_portal && <p className="text-xs text-gray-400">{drug.best_portal}</p>}
                          </>
                        ) : drug.mrp != null ? (
                          <>
                            <p className="text-sm text-gray-400 line-through">{formatINR(drug.mrp)}</p>
                            <p className="text-xs text-gray-400">MRP</p>
                          </>
                        ) : null}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
