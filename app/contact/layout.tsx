import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: 'Contact Us — DUGARS JEWELLERY',
  description:
    'Get in touch with DUGARS JEWELLERY. Visit our showroom, send us a message, or connect via WhatsApp for enquiries, appointments, and customer support.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us — DUGARS JEWELLERY',
    description: 'Visit our showroom, send a message, or connect via WhatsApp.',
    type: 'website',
    url: `${SITE_URL}/contact`,
    siteName: 'DUGARS JEWELLERY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — DUGARS JEWELLERY',
    description: 'Visit our showroom, send a message, or connect via WhatsApp.',
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
