import ProductDetail from "@/components/ProductDetail";
export async function generateMetadata({ params, searchParams }, parent) {
  const { id } = await params;

  // fetch post information
  const { data } = await fetch(`http://localhost:3000/api/products/${id}`).then(
    (res) => res.json(),
  );

  if (!data) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Halaman produk yang Anda cari tidak tersedia.",
    };
  }

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
  s;
}

export default async function ProductDetailPage({ params }) {
  // Contoh data dari Prisma/Backend milikmu
  const { id } = await params;
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  const { data } = await res.json();

  return (
    <main className="bg-white py-6">
      <ProductDetail product={data} />
    </main>
  );
}
