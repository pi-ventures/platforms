import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Pill, AlertCircle, Leaf } from 'lucide-react';
import { getDrug } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import PriceTable from '@/components/PriceTable';
import GenericCard from '@/components/GenericCard';

export const revalidate = 21600;

interface Props { params: { slug: string } }

function humanise(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const drug = await getDrug(params.slug);
    const saving = drug.max_saving_pct ? ` — Save ${Math.round(drug.max_saving_pct)}%` : '';
    return {
      title: `${drug.brand_name} Price Comparison${saving} | ${drug.salt_name} ${drug.strength}`,
      description: `Compare ${drug.brand_name} (${drug.salt_name} ${drug.strength}) prices across 14 pharmacies in India — 1mg, PharmEasy, Apollo, Netmeds & more. Best price: ${drug.best_price ? `₹${drug.best_price}` : 'check now'}.`,
      alternates: { canonical: `/drug/${drug.slug}` },
    };
  } catch {
    return { title: `${humanise(params.slug)} — medicines.discount` };
  }
}

function DrugJsonLd({ drug }: { drug: Awaited<ReturnType<typeof getDrug>> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: drug.brand_name,
    alternateName: drug.salt_name,
    description: drug.uses || `${drug.brand_name} contains ${drug.salt_name} ${drug.strength}.`,
    ...(drug.manufacturer_name && { manufacturer: { '@type': 'Organization', name: drug.manufacturer_name } }),
    ...(drug.rx_required && { prescriptionStatus: 'PrescriptionOnly' }),
    ...(drug.therapeutic_category && { drugClass: drug.therapeutic_category }),
    ...(drug.best_price && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: drug.best_price,
        highPrice: drug.mrp,
        offerCount: drug.portal_count,
      },
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function DrugPage({ params }: Props) {
  let drug = null;
  let error = false;

  try {
    drug = await getDrug(params.slug);
  } catch {
    error = true;
  }

  const drugName = drug?.brand_name ?? humanise(params.slug);

  if (!drug || error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{drugName}</span>
        </nav>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-700 mb-2">{drugName}</h1>
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

  const maxSaving = drug.max_saving_pct ? Math.round(drug.max_saving_pct) : null;

  return (
    <>
      <DrugJsonLd drug={drug} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          {drug.therapeutic_category && (
            <>
              <Link href={`/category/${drug.therapeutic_slug || drug.therapeutic_category.toLowerCase().replace(/\s+/g,'-')}`} className="hover:text-brand-600">
                {drug.therapeutic_category}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <Link href={`/salt/${drug.salt_slug}`} className="hover:text-brand-600">{drug.salt_name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{drug.brand_name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center shrink-0">
              <Pill className="w-6 h-6 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{drug.brand_name}</h1>
                {drug.is_govt_brand && <span className="text-xs font-semibold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Jan Aushadhi</span>}
                {drug.is_generic && !drug.is_govt_brand && <span className="text-xs font-semibold bg-lime-100 text-lime-700 border border-lime-200 px-2 py-0.5 rounded-full">Generic</span>}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {drug.salt_name} · {drug.strength}
                {drug.pack_size && ` · ${drug.pack_size}`}
                {drug.dosage_form && ` · ${drug.dosage_form}`}
              </p>
              {drug.manufacturer_name && (
                <Link href={`/manufacturer/${drug.manufacturer_name.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-gray-400 hover:text-brand-600">
                  Mfr: {drug.manufacturer_name}
                </Link>
              )}
            </div>
            <div className="text-right shrink-0">
              {drug.best_price != null ? (
                <>
                  <p className="text-xs text-gray-400 mb-0.5">Best price</p>
                  <p className="text-2xl font-bold text-brand-700">{formatINR(drug.best_price)}</p>
                  <p className="text-xs text-gray-400">on {drug.best_portal}</p>
                  {maxSaving != null && maxSaving > 0 && (
                    <p className="text-xs font-semibold text-green-600 mt-1">{maxSaving}% below MRP</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Price unavailable</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
            {drug.therapeutic_category && <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{drug.therapeutic_category}</span>}
            {drug.schedule && <span className="text-xs bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-full">Schedule {drug.schedule}</span>}
            {drug.rx_required && <span className="text-xs bg-red-50 border border-red-100 text-red-700 px-2.5 py-1 rounded-full">Rx Required</span>}
            {drug.nppa_ceiling_price && <span className="text-xs bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-full">NPPA Ceiling · Max {formatINR(drug.nppa_ceiling_price)}</span>}
          </div>
        </div>

        {/* Price table */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Compare Prices — {drug.portal_count} Pharmacies</h2>
          <PriceTable drugId={drug.id} drugName={drug.brand_name} prices={drug.prices} mrp={drug.mrp} nppaPrice={drug.nppa_ceiling_price} jaPrice={drug.jan_aushadhi_price} />
        </section>

        {/* Generic equivalents */}
        {drug.generic_equivalents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-lime-600" />
              <h2 className="text-lg font-bold text-gray-800">Cheaper Alternatives ({drug.generic_equivalents.length})</h2>
            </div>
            <div className="bg-lime-50 border border-lime-100 rounded-2xl p-4 mb-4 text-sm text-lime-800">
              Same salt ({drug.salt_name}), same strength — different brand. Always consult your doctor before switching.
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {drug.generic_equivalents.map(g => <GenericCard key={g.id} generic={g} brandedMrp={drug.mrp} />)}
            </div>
          </section>
        )}

        {/* Uses & side effects */}
        {(drug.uses || drug.side_effects) && (
          <section className="grid md:grid-cols-2 gap-4 mb-8">
            {drug.uses && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Uses of {drug.brand_name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{drug.uses}</p>
              </div>
            )}
            {drug.side_effects && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Side Effects</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{drug.side_effects}</p>
              </div>
            )}
          </section>
        )}

        <div className="text-center">
          <Link href={`/salt/${drug.salt_slug}`} className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium">
            ← All brands containing {drug.salt_name}
          </Link>
        </div>
      </div>
    </>
  );
}
