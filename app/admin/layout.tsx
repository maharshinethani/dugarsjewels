import type { Metadata } from 'next';
import AdminClient from './admin-client';

export const metadata: Metadata = {
  title: 'Admin — DUGARS JEWELLERY',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClient>{children}</AdminClient>;
}
