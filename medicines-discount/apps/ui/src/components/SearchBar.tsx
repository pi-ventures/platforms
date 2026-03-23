'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, X } from 'lucide-react';
import { searchDrugs, type SearchResult } from '@/lib/api';
import { formatINR } from '@/lib/utils';

interface SearchBarProps {
  autoFocus?: boolean;
  size?: 'sm' | 'lg';
  placeholder?: string;
}

export default function SearchBar({
  autoFocus = false,
  size = 'lg',
  placeholder = 'Search by drug name, salt or brand…',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchDrugs(query);
        setResults(data);
        setOpen(true);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const inputCls = size === 'lg'
    ? 'w-full pl-12 pr-10 py-4 text-base rounded-2xl border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent'
    : 'w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent';

  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const iconPos  = size === 'lg' ? 'left-4' : 'left-3';

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute ${iconPos} top-1/2 -translate-y-1/2 text-gray-400 ${iconSize}`} />
          <input
            autoFocus={autoFocus}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 animate-spin" />
          )}
          {!loading && query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setOpen(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && results && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Drugs */}
          {results.drugs.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Drugs
              </div>
              {results.drugs.slice(0, 6).map(drug => (
                <Link
                  key={drug.id}
                  href={`/drug/${drug.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-brand-50 transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{drug.brand_name}</p>
                    <p className="text-xs text-gray-500 truncate">{drug.salt_name} · {drug.strength}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {drug.best_price != null ? (
                      <p className="text-sm font-semibold text-brand-700">{formatINR(drug.best_price)}</p>
                    ) : drug.mrp != null ? (
                      <p className="text-sm text-gray-400 line-through">{formatINR(drug.mrp)}</p>
                    ) : null}
                    {drug.best_portal && (
                      <p className="text-xs text-gray-400">{drug.best_portal}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Salts */}
          {results.salts.length > 0 && (
            <div className="border-t border-gray-50">
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                By Salt / Composition
              </div>
              {results.salts.slice(0, 4).map(salt => (
                <Link
                  key={salt.salt_slug}
                  href={`/salt/${salt.salt_slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-brand-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{salt.salt_name}</p>
                    <p className="text-xs text-gray-500">{salt.brand_count} brands available</p>
                  </div>
                  {salt.cheapest_price != null && (
                    <p className="text-sm font-semibold text-brand-700 shrink-0 ml-4">
                      from {formatINR(salt.cheapest_price)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* View all */}
          {results.total > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-sm text-brand-600 font-medium bg-brand-50 hover:bg-brand-100 transition-colors border-t border-brand-100"
            >
              View all {results.total} results →
            </Link>
          )}

          {results.total === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No results for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
