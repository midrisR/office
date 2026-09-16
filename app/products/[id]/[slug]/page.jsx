import ProductDetail from "@/components/ProductDetail";
import { getDetailProduct } from "@/services/productServices";
export async function generateMetadata({ params, searchParams }, parent) {
  const { id } = await params;
  const data = await getDetailProduct(id);
  // fetch post information

  // Ambil URL gambar pertama untuk Open Graph preview
  const primaryImage = data.images?.[0];
  const imageUrl = primaryImage?.url || primaryImage?.name || "/default-og.jpg";

  // Bersihkan meta description (gunakan metaDescription jika ada, fallback ke description)
  // const rawDescription = data.metaDescription || data.description;

  return {
    title: `${data.name} | PStore`,
    description: data.metaDescription,
    keywords: data.metaKeywords || data.tag || data.name,
    // Open Graph (Tampilan preview saat link di-share ke WA, Facebook, LinkedIn, dll)
    openGraph: {
      title: data.name,
      description: data.metaDescription,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: data.name,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description: data.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  // Contoh data dari Prisma/Backend milikmu
  const { id } = await params;
  const data = await getDetailProduct(id);

  return (
    <main className="bg-white py-6">
      <ProductDetail product={data} />
    </main>
  );
}
