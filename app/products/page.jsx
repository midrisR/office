import ProductPagination from "@/components/ProductPagination";
import ProductCard from "@/components/ProductCard";
// Helper function untuk fetch ke API Route
async function getProducts(page, limit, query) {
  // Ambil base URL dari env atau fallback ke localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/products?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}`,
    {
      // opsional: sesuaikan strategi cache
      cache: "no-store", // selalu ambil data terbaru dari API
    },
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil data produk");
  }

  return res.json();
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const limit = parseInt(params?.limit || "20", 10);
  const query = params?.q || "";

  // 1. Fetch data dari API Route (/api/products) di sisi server
  const response = await getProducts(page, limit, query);

  const products = response.data;
  const totalProducts = response.pagination?.total || response.total;

  return (
    <div style={{ padding: "24px" }} className="bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          Katalog Produk
        </h2>

        {/* Grid Layout: 1 Kolom (Mobile), 2 Kolom (Tablet), 3-4 Kolom (Desktop) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* 3. Komponen Antd Pagination (Client Component) */}
      <ProductPagination total={totalProducts} page={page} limit={limit} />
    </div>
  );
}
