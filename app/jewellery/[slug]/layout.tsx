import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/site-config';
import { getSeoSettings } from '@/lib/seo-settings';

const SITE_URL = siteConfig.url;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('name_en, name_ar, slug, short_description_en, seo_title_en, seo_description_en, thumbnail_url, price, sale_price, status, sku, material, metal, stone, category')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: true },
    };
  }

  const title = product.seo_title_en || `${product.name_en} — DUGARS JEWELLERY`;
  const description = product.seo_description_en || product.short_description_en || `Discover the ${product.name_en} at DUGARS JEWELLERY.`;
  const image = product.thumbnail_url || undefined;
  const canonicalUrl = `${SITE_URL}/jewellery/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/jewellery/${product.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'DUGARS JEWELLERY',
      ...(image && { images: [{ url: image, alt: product.name_en }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
    robots: {
      index: product.status === 'published',
      follow: true,
    },
  };
}

async function getProductJsonLd(slug: string) {
  const { data: product } = await supabase
    .from('products')
    .select('id, name_en, slug, short_description_en, sku, thumbnail_url, price, sale_price, status, stock_status, material, metal, stone, category, seo_title_en')
    .eq('slug', slug)
    .maybeSingle();

  if (!product || product.status !== 'published') return null;

  const seo = await getSeoSettings();
  const showPrices = seo.showPrices;

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.seo_title_en || product.name_en,
    url: `${SITE_URL}/jewellery/${product.slug}`,
    ...(product.thumbnail_url && { image: [product.thumbnail_url] }),
    ...(product.short_description_en && { description: product.short_description_en }),
    ...(product.sku && { sku: product.sku }),
    ...(product.material && { material: product.material }),
    ...(product.metal && { additionalType: product.metal }),
    brand: {
      '@type': 'Brand',
      name: seo.brandName,
    },
  };

  if (showPrices && product.price) {
    const availabilityMap: Record<string, string> = {
      in_stock: 'https://schema.org/InStock',
      low_stock: 'https://schema.org/LimitedAvailability',
      out_of_stock: 'https://schema.org/OutOfStock',
      made_to_order: 'https://schema.org/PreOrder',
    };
    productLd.offers = {
      '@type': 'Offer',
      url: `${SITE_URL}/jewellery/${product.slug}`,
      priceCurrency: seo.currency || 'USD',
      price: String(product.sale_price || product.price),
      availability: availabilityMap[product.stock_status] || 'https://schema.org/InStock',
    };
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Jewellery', item: `${SITE_URL}/jewellery` },
      { '@type': 'ListItem', position: 3, name: product.name_en, item: `${SITE_URL}/jewellery/${product.slug}` },
    ],
  };

  return { productLd, breadcrumbLd };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const jsonLd = await getProductJsonLd(params.slug);

  return (
    <>
      {jsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.productLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbLd) }}
          />
        </>
      )}
      {children}
    </>
  );
}
