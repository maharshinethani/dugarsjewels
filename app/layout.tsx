import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Noto_Kufi_Arabic } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { AnnouncementMarquee } from '@/components/announcement-marquee';
import { Footer } from '@/components/footer';
import { Preloader } from '@/components/preloader';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { siteConfig } from '@/lib/site-config';
import { getSeoSettings } from '@/lib/seo-settings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const SITE_URL = siteConfig.url;

const verificationMeta: Record<string, string> = {};
if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
  verificationMeta['google-site-verification'] = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DUGARS JEWELLERY | Official Jewellery Website',
    template: '%s | DUGARS JEWELLERY',
  },
  description:
    'Discover DUGARS JEWELLERY — rings, necklaces, earrings, bracelets, and bridal pieces crafted with the finest materials. Explore our official jewellery website.',
  keywords: [
    'DUGARS JEWELLERY',
    'Dugars',
    'DUGARS JEWELLERY official website',
    'Dugars jewellery online',
    'luxury jewellery',
    'diamond rings',
    'gold necklaces',
    'bridal jewellery',
    'bespoke jewellery',
  ],
  openGraph: {
    title: 'DUGARS JEWELLERY | Official Jewellery Website',
    description:
      'Discover DUGARS JEWELLERY — rings, necklaces, earrings, bracelets, and bridal pieces crafted with the finest materials.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_AR'],
    siteName: 'DUGARS JEWELLERY',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DUGARS JEWELLERY | Official Jewellery Website',
    description: 'Discover DUGARS JEWELLERY — rings, necklaces, earrings, bracelets, and bridal pieces.',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'ar': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(Object.keys(verificationMeta).length > 0 && { verification: verificationMeta }),
};

const noFlashScript = `
(function() {
  try {
    var stored = localStorage.getItem('dugars-theme');
    var theme = 'ocean-pearl';
    if (stored === 'ocean-midnight') {
      theme = 'ocean-midnight';
    } else if (stored === 'ocean-pearl') {
      theme = 'ocean-pearl';
    } else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'ocean-midnight';
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme === 'ocean-midnight' ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'ocean-pearl');
  }
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSeoSettings();

  const organizationLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: seo.brandName,
    url: SITE_URL,
    description:
      'Discover DUGARS JEWELLERY — rings, necklaces, earrings, bracelets, and bridal pieces crafted with the finest materials.',
    sameAs: [
      seo.instagram,
      seo.facebook,
      seo.pinterest,
      seo.youtube,
    ].filter(Boolean) as string[],
  };

  if (seo.logoUrl) organizationLd.logo = seo.logoUrl;
  if (seo.email) organizationLd.email = seo.email;
  if (seo.phone) organizationLd.telephone = seo.phone;
  if (seo.addressEn) {
    organizationLd.address = {
      '@type': 'PostalAddress',
      streetAddress: seo.addressEn,
    };
  }
  if (seo.googleMapsUrl) {
    organizationLd.hasMap = seo.googleMapsUrl;
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seo.brandName,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/jewellery?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" dir="ltr" data-theme="ocean-pearl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} ${notoKufi.variable} font-sans antialiased`}>
        <Providers>
          <Preloader />
          <AnnouncementMarquee />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
