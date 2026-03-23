import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Building2, BadgeCheck, Package } from 'lucide-react';
import { getManufacturer } from '@/lib/api';
import { formatINR } from '@/lib/utils';

export const revalidate = 86400; // 24 hours

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const mfr = await getManufacturer(params.slug);
    return {
      title: `${mfr.name} — Medicines & Prices | medicines.discount`,
      description: `Compare prices of all ${mfr.drug_count} medicines by ${mfr.name}${mfr.city ? ` (${mfr.city}, ${mfr.state})` : ''}. Find cheapest pharmacy for ${mfr.name} products.`,
      alternates: { canonical: `/manufacturer/${params.slug}` },
    };
  } catch {
    return { title: 'Manufacturer Not Found' };
  }
}

export default async function ManufacturerPage({ params }: Props) {
  let mfr;
  try {
    mfr = await getManufacturer(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">{mfr.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{mfr.name}</h1>
              {mfr.who_gmp && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3 h-3" /> WHO-GMP Certified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {[mfr.city, mfr.state].filter(Boolean).join(', ')}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                <Package className="w-4 h-4 text-gray-400" />
                {mfr.drug_count} medicines
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Drug list */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">All Medicines by {mfr.name}</h2>
        {mfr.drugs.length === 0 ? (
          <p className="text-gray-400 text-sm">No medicines listed yet.</p>
        ) : (
          <div className="space-y-2">
            {mfr.drugs.map(d => (
              <Link
                key={d.slug}
                href={`/drug/${d.slug}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm px-5 py-3.5 transition-all"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800">{d.brand_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.salt_name} · {d.strength}</p>
                </div>
                <div className="flex items-center gap-3">
                  {d.best_price != null && (
                    <p className="text-sm font-bold text-brand-700">{formatINR(d.best_price)}</p>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
