import { MetadataRoute } from 'next';
import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8007';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://medicines.discount';

async function fetchSlugs(url: string, params: object): Promise<string[]> {
  try {
    const { data } = await axios.get(url, { params, timeout: 15000 });
    return data.map((d: { slug: string }) => d.slug);
  } catch {
    return [];
  }
}

async function fetchSaltSlugs(): Promise<string[]> {
  try {
    // Enumerate salts via popular categories
    const categories = ['antidiabetic', 'cardiac', 'antibiotic', 'gastric', 'analgesic', 'antihypertensive'];
    const results = await Promise.all(
      categories.map(cat =>
        axios.get(`${BASE}/api/drugs`, { params: { therapeutic_category: cat, limit: 500 }, timeout: 15000 })
          .then(r => [...new Set((r.data as { salt_slug: string }[]).map(d => d.salt_slug))])
          .catch(() => [])
      )
    );
    return [...new Set(results.flat())];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE}/search`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE}/kendras`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Drug pages — highest priority for organic traffic
  const drugSlugs = await fetchSlugs(`${BASE}/api/drugs`, { limit: 5000 });
  const drugUrls: MetadataRoute.Sitemap = drugSlugs.map(slug => ({
    url: `${SITE}/drug/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Salt pages
  const saltSlugs = await fetchSaltSlugs();
  const saltUrls: MetadataRoute.Sitemap = saltSlugs.map(slug => ({
    url: `${SITE}/salt/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Manufacturer pages
  const mfrSlugs = await fetchSlugs(`${BASE}/api/manufacturers`, { limit: 1000 }).catch(() => []);
  const mfrUrls: MetadataRoute.Sitemap = mfrSlugs.map(slug => ({
    url: `${SITE}/manufacturer/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...statics, ...drugUrls, ...saltUrls, ...mfrUrls];
}
