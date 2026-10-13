import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: 'About Us — DUGARS JEWELLERY',
  description:
    'Discover the DUGARS JEWELLERY story — our heritage, philosophy, and commitment to crafting timeless jewellery with the finest materials and master craftsmanship.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us — DUGARS JEWELLERY',
    description: 'The DUGARS story — heritage, philosophy, and the art of timeless jewellery.',
    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: 'DUGARS JEWELLERY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — DUGARS JEWELLERY',
    description: 'The DUGARS story — heritage, philosophy, and the art of timeless jewellery.',
  },
  robots: { index: true, follow: true },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
