import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Tag } from 'lucide-react';
import { getDrugsList } from '@/lib/api';
import { formatINR } from '@/lib/utils';

export const revalidate = 43200; // 12 hours

interface Props { params: { slug: string } }

const CATEGORY_LABELS: Record<string, string> = {
  antidiabetic: 'Antidiabetic',
  cardiac: 'Cardiac / Heart',
  antibiotic: 'Antibiotics',
  gastric: 'Gastric / Acidity',
  analgesic: 'Pain Relief / Analgesics',
  antihypertensive: 'Blood Pressure',
  antiallergic: 'Allergy / Antiallergic',
  neurological: 'Neurological',
  respiratory: 'Respiratory',
  vitamins: 'Vitamins & Supplements',
  dermatology: 'Skin / Dermatology',
  oncology: 'Oncology',
};

function labelFromSlug(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = labelFromSlug(params.slug);
  return {
    title: `${label} Medicines — Compare Prices | medicines.discount`,
    description: `Compare prices of all ${label} medicines across 14 pharmacies in India. Find cheapest generic alternatives and save up to 80%.`,
    alternates: { canonical: `/category/${params.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const label = labelFromSlug(params.slug);
  let drugs = [];
  try {
    drugs = await getDrugsList({ therapeutic_category: params.slug, limit: 100 });
  } catch {
    drugs = [];
  }

  // JSON-LD breadcrumb
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL || 'https://medicines.discount' },
      { '@type': 'ListItem', position: 2, name: label },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{label}</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{label} Medicines</h1>
            <p className="text-sm text-gray-500">{drugs.length} medicines — compare prices across 14 pharmacies</p>
          </div>
        </div>

        {drugs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No medicines found in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {drugs.map(d => (
              <Link
                key={d.slug}
                href={`/drug/${d.slug}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm px-5 py-3.5 transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-800 truncate">{d.brand_name}</p>
                    {d.is_govt_brand && (
                      <span className="shrink-0 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">JA</span>
                    )}
                    {d.is_generic && !d.is_govt_brand && (
                      <span className="shrink-0 text-xs bg-lime-100 text-lime-700 px-1.5 py-0.5 rounded-full">Generic</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {d.salt_name} · {d.strength}
                    {d.manufacturer_name && ` · ${d.manufacturer_name}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right">
                    {d.best_price != null ? (
                      <>
                        <p className="text-sm font-bold text-brand-700">{formatINR(d.best_price)}</p>
                        {d.best_portal && <p className="text-xs text-gray-400">{d.best_portal}</p>}
                      </>
                    ) : d.mrp != null ? (
                      <p className="text-sm text-gray-400 line-through">{formatINR(d.mrp)}</p>
                    ) : null}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
