import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Layers, AlertCircle } from 'lucide-react';
import { getSalt } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import GenericCard from '@/components/GenericCard';

export const revalidate = 21600;

interface Props { params: { slug: string } }

function humanise(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const salt = await getSalt(params.slug);
    return {
      title: `${salt.salt_name} — Compare ${salt.brand_count} brands & prices | medicines.discount`,
      description: `Compare all brands of ${salt.salt_name} in India. Find cheapest generics, Jan Aushadhi price & buy from the best pharmacy.`,
      alternates: { canonical: `/salt/${params.slug}` },
    };
  } catch {
    const name = humanise(params.slug);
    return { title: `${name} — medicines.discount` };
  }
}

export default async function SaltPage({ params }: Props) {
  let salt = null;
  let error = false;

  try {
    salt = await getSalt(params.slug);
  } catch {
    error = true;
  }

  const saltName = salt?.salt_name ?? humanise(params.slug);

  // Empty / API-down state — don't hard 404, show helpful message
  if (!salt || error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{saltName}</span>
        </nav>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-700 mb-2">{saltName}</h1>
          <p className="text-sm text-gray-500 mb-4">
            Price data for this medicine is not available yet — our scrapers may still be indexing it.
          </p>
          <Link href="/search" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Search for a different medicine →
          </Link>
        </div>
      </div>
    );
  }

  const govtBrands    = salt.brands.filter(d => d.is_govt_brand);
  const genericBrands = salt.brands.filter(d => d.is_generic && !d.is_govt_brand);
  const otherBrands   = salt.brands.filter(d => !d.is_generic && !d.is_govt_brand);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        {salt.therapeutic_category && (
          <>
            <Link href={`/category/${salt.therapeutic_category.toLowerCase().replace(/\s+/g,'-')}`} className="hover:text-brand-600">
              {salt.therapeutic_category}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-gray-600">{salt.salt_name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-brand-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{salt.salt_name}</h1>
            {salt.therapeutic_category && (
              <p className="text-sm text-gray-500 mb-3">{salt.therapeutic_category}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
                <span className="text-gray-500">Brands: </span>
                <span className="font-semibold text-gray-800">{salt.brand_count}</span>
              </div>
              {salt.cheapest_price != null && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl px-3 py-1.5">
                  <span className="text-brand-600">Cheapest from: </span>
                  <span className="font-semibold text-brand-700">{formatINR(salt.cheapest_price)}</span>
                </div>
              )}
              {salt.ja_price != null && (
                <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-1.5">
                  <span className="text-green-600">Jan Aushadhi: </span>
                  <span className="font-semibold text-green-700">{formatINR(salt.ja_price)}</span>
                </div>
              )}
              {salt.max_saving_pct != null && salt.max_saving_pct > 0 && (
                <div className="bg-lime-50 border border-lime-100 rounded-xl px-3 py-1.5">
                  <span className="text-lime-700 font-semibold">Save up to {Math.round(salt.max_saving_pct)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Jan Aushadhi */}
      {govtBrands.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Jan Aushadhi (Government) — Cheapest
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {govtBrands.map(d => <GenericCard key={d.id} generic={d} />)}
          </div>
        </section>
      )}

      {/* Generic */}
      {genericBrands.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-lime-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-500 inline-block" />
            Generic Brands
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {genericBrands.map(d => <GenericCard key={d.id} generic={d} />)}
          </div>
        </section>
      )}

      {/* Branded */}
      {otherBrands.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            Branded Versions ({otherBrands.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherBrands.map(d => <GenericCard key={d.id} generic={d} />)}
          </div>
        </section>
      )}
    </div>
  );
}
