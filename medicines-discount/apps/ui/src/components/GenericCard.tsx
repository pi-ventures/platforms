import Link from 'next/link';
import { type GenericEquivalent } from '@/lib/api';
import { formatINR, savingsBadgeColor, cn } from '@/lib/utils';
import { BadgeCheck, Leaf } from 'lucide-react';

interface GenericCardProps {
  generic: GenericEquivalent;
  brandedMrp?: number | null;
}

export default function GenericCard({ generic, brandedMrp }: GenericCardProps) {
  const savings = brandedMrp && generic.best_price
    ? Math.round(100 * (1 - generic.best_price / brandedMrp))
    : generic.savings_pct
    ? Math.round(generic.savings_pct)
    : null;

  return (
    <Link
      href={`/drug/${generic.slug}`}
      className="block rounded-2xl border border-gray-100 bg-white hover:border-brand-200 hover:shadow-sm p-4 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-sm text-gray-800 truncate">{generic.brand_name}</p>
            {generic.is_govt_brand && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full shrink-0">
                <BadgeCheck className="w-3 h-3" />
                Jan Aushadhi
              </span>
            )}
            {generic.is_generic && !generic.is_govt_brand && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-lime-700 bg-lime-50 border border-lime-100 px-1.5 py-0.5 rounded-full shrink-0">
                <Leaf className="w-3 h-3" />
                Generic
              </span>
            )}
          </div>
          {generic.manufacturer_name && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{generic.manufacturer_name}</p>
          )}
        </div>

        {savings != null && savings > 0 && (
          <span className={cn(
            'shrink-0 text-xs font-bold border rounded-xl px-2 py-1',
            savingsBadgeColor(savings)
          )}>
            {savings}% cheaper
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end gap-3">
        {generic.best_price != null ? (
          <div>
            <p className="text-base font-bold text-brand-700">{formatINR(generic.best_price)}</p>
            {generic.best_portal && (
              <p className="text-xs text-gray-400">on {generic.best_portal}</p>
            )}
          </div>
        ) : generic.jan_aushadhi_price != null ? (
          <div>
            <p className="text-base font-bold text-green-700">{formatINR(generic.jan_aushadhi_price)}</p>
            <p className="text-xs text-gray-400">Jan Aushadhi</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Price not available</p>
        )}

        {generic.mrp != null && (
          <p className="text-xs text-gray-400 line-through mb-0.5">MRP {formatINR(generic.mrp)}</p>
        )}
      </div>
    </Link>
  );
}
