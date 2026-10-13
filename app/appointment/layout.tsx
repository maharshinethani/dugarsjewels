import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: 'Book an Appointment — DUGARS JEWELLERY',
  description:
    'Book a private appointment with DUGARS JEWELLERY. Choose an in-store, virtual, or WhatsApp consultation with our jewellery experts.',
  alternates: { canonical: '/appointment' },
  openGraph: {
    title: 'Book an Appointment — DUGARS JEWELLERY',
    description: 'Private appointments — in-store, virtual, or WhatsApp consultation.',
    type: 'website',
    url: `${SITE_URL}/appointment`,
    siteName: 'DUGARS JEWELLERY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book an Appointment — DUGARS JEWELLERY',
    description: 'Private appointments — in-store, virtual, or WhatsApp consultation.',
  },
  robots: { index: true, follow: true },
};

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
