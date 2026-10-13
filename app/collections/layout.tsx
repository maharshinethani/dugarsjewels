import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: 'Collections — DUGARS JEWELLERY',
  description:
    'Explore our curated jewellery collections — signature, bridal, bespoke, and limited edition pieces designed for every occasion and taste.',
  alternates: { canonical: '/collections' },
  openGraph: {
    title: 'Collections — DUGARS JEWELLERY',
    description: 'Curated jewellery collections designed for every occasion and taste.',
    type: 'website',
    url: `${SITE_URL}/collections`,
    siteName: 'DUGARS JEWELLERY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections — DUGARS JEWELLERY',
    description: 'Curated jewellery collections designed for every occasion and taste.',
  },
  robots: { index: true, follow: true },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
