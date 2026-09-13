import Image from "next/image";
export default async function Home() {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });
  const { data } = await res.json();
  const IMAGE_BASE_URL = "/images/item-category";
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Temukan Produk Kebutuhan Industri Anda
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Kami menyediakan berbagai kategori produk berkualitas untuk
            mendukung kebutuhan bisnis dan industri Anda.
          </p>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Kategori Produk
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {data.map((category) => (
            <a
              key={category.id}
              href={`/kategori/${category.id}`}
              className="group relative flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-100 mb-3">
                <Image
                  src={`${IMAGE_BASE_URL}/${category.id}/${category.image}`}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center text-sm md:text-base font-medium text-slate-700 group-hover:text-blue-600 line-clamp-2">
                {category.name}
              </h3>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
