'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { getKendras, type Kendra } from '@/lib/api';

export default function KendrasPage() {
  const [pin, setPin] = useState('');
  const [kendras, setKendras] = useState<Kendra[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = pin.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit PIN code');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(false);
    try {
      const data = await getKendras(clean);
      setKendras(data);
      setSearched(true);
    } catch {
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Jan Aushadhi Kendra Locator</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Find government-approved pharmacies near you selling quality generic medicines at up to 80% below MRP.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit PIN code"
              className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              maxLength={6}
              inputMode="numeric"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>

      {/* Results */}
      {searched && (
        <div>
          {kendras.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No Jan Aushadhi Kendras found for PIN {pin}</p>
              <p className="text-sm mt-1">Try a nearby PIN code or visit pmbi.gov.in for the full directory</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                {kendras.length} Kendra{kendras.length !== 1 ? 's' : ''} found near PIN {pin}
              </p>
              {kendras.map(k => (
                <div
                  key={k.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-green-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{k.name}</h3>
                        {k.is_verified && (
                          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      {k.address && (
                        <p className="text-sm text-gray-500 mt-1 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                          {k.address}
                          {k.area && `, ${k.area}`}
                          {k.city && `, ${k.city}`}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-3">
                        {k.phone && (
                          <a
                            href={`tel:${k.phone}`}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
                          >
                            <Phone className="w-3 h-3" />
                            {k.phone}
                          </a>
                        )}
                        {k.hours && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {k.hours}
                          </span>
                        )}
                      </div>
                    </div>

                    {k.lat && k.lng && (
                      <a
                        href={`https://maps.google.com/?q=${k.lat},${k.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs font-semibold text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Get Directions
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info strip */}
      {!searched && (
        <div className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-5 text-sm text-green-800">
          <p className="font-semibold mb-2">About Jan Aushadhi Kendras</p>
          <p className="text-green-700">
            Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) runs over 10,000+ stores across India
            selling 1,900+ generic medicines at prices 50–80% lower than branded equivalents.
            All medicines are WHO-GMP certified.
          </p>
        </div>
      )}
    </div>
  );
}
