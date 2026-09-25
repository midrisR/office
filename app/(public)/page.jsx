import CategorieCard from "@/components/categorieCard";
export default async function Page() {
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
      <CategorieCard />
    </main>
  );
}
