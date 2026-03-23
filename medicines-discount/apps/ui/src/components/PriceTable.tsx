'use client';

import { ExternalLink, CheckCircle2, XCircle, TrendingDown } from 'lucide-react';
import { type DrugPrice } from '@/lib/api';
import { formatINR, formatDiscount, portalLabel, getOrCreateSessionId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { trackAffiliateClick } from '@/lib/api';

interface PriceTableProps {
  drugId: number;
  drugName: string;
  prices: DrugPrice[];
  mrp?: number | null;
  nppaPrice?: number | null;
  jaPrice?: number | null;
}

export default function PriceTable({ drugId, drugName, prices, mrp, nppaPrice, jaPrice }: PriceTableProps) {
  const sorted = [...prices].sort((a, b) => {
    if (!a.in_stock && b.in_stock) return 1;
    if (a.in_stock && !b.in_stock) return -1;
    return (a.effective_price ?? a.selling_price ?? 9999) - (b.effective_price ?? b.selling_price ?? 9999);
  });

  const bestPrice = sorted.find(p => p.in_stock && p.selling_price != null)?.selling_price;

  async function handleBuyClick(price: DrugPrice) {
    const url = price.affiliate_url || price.portal_url;
    if (!url) return;
    const sid = getOrCreateSessionId();
    // fire-and-forget
    trackAffiliateClick(drugId, price.portal, sid).catch(() => {});
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (prices.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
        No price data available yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Reference prices bar */}
      {(mrp || nppaPrice || jaPrice) && (
        <div className="flex flex-wrap gap-3 text-sm mb-4">
          {mrp && (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
              <span className="text-gray-500">MRP</span>
              <span className="font-semibold text-gray-800">{formatINR(mrp)}</span>
            </div>
          )}
          {nppaPrice && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5">
              <span className="text-orange-600">NPPA Ceiling</span>
              <span className="font-semibold text-orange-700">{formatINR(nppaPrice)}</span>
            </div>
          )}
          {jaPrice && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl px-3 py-1.5">
              <span className="text-green-600">Jan Aushadhi</span>
              <span className="font-semibold text-green-700">{formatINR(jaPrice)}</span>
            </div>
          )}
        </div>
      )}

      {/* Portal rows */}
      {sorted.map((price, i) => {
        const isTop = i === 0 && price.in_stock;
        const savings = mrp && price.selling_price ? Math.round(100 * (1 - price.selling_price / mrp)) : null;

        return (
          <div
            key={price.portal}
            className={cn(
              'rounded-2xl border px-4 py-3 transition-shadow',
              isTop
                ? 'border-brand-200 bg-brand-50 shadow-sm'
                : price.in_stock
                ? 'border-gray-100 bg-white hover:shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-60'
            )}
          >
            {/* Top row: badge + portal name + stock icon */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {isTop && (
                  <span className="shrink-0 text-xs font-semibold bg-brand-600 text-white px-2 py-0.5 rounded-full">
                    Best
                  </span>
                )}
                <p className={cn('font-medium text-sm truncate', price.in_stock ? 'text-gray-800' : 'text-gray-400')}>
                  {portalLabel(price.portal)}
                </p>
              </div>
              {price.in_stock
                ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                : <XCircle className="w-4 h-4 text-gray-300 shrink-0" />
              }
            </div>

            {/* Bottom row: price info + buy button */}
            <div className="flex items-end justify-between gap-3">
              <div>
                {price.in_stock && price.selling_price != null ? (
                  <>
                    <p className="text-lg font-bold text-gray-900">{formatINR(price.selling_price)}</p>
                    {price.effective_price != null && price.effective_price < price.selling_price && (
                      <p className="text-xs text-purple-600">{formatINR(price.effective_price)} after cashback</p>
                    )}
                    {price.cashback_pct != null && price.cashback_pct > 0 && (
                      <p className="text-xs text-purple-600">+{price.cashback_pct}% cashback</p>
                    )}
                    {savings != null && savings > 0 && (
                      <div className="flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">{savings}% off MRP</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Out of stock</p>
                )}
              </div>

              {price.in_stock && (price.affiliate_url || price.portal_url) && (
                <button
                  onClick={() => handleBuyClick(price)}
                  className="shrink-0 flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Buy
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-gray-400 text-center pt-1">
        Prices updated daily · Affiliate links help us run this service for free
      </p>
    </div>
  );
}
