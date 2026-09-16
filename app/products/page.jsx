import ProductPagination from "@/components/ProductPagination";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/productServices";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const limit = parseInt(params?.limit || "20", 10);
  const query = params?.q || "";
  const skip = (page - 1) * limit;

  const { products, totalProduct } = await getProducts({
    skip,
    limit,
    query,
  });

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
      <ProductPagination total={totalProduct} page={page} limit={limit} />
    </div>
  );
}
