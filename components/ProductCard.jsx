import Image from "next/image";
const IMAGE_BASE_URL = "/images/item";
import Link from "next/link";
export default function ProductCard({ product }) {
  // Mengambil gambar pertama dari array images
  const primaryImage = product?.images?.[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Container Gambar: aspect-square & object-cover membuat tinggi semua gambar seragam */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {primaryImage ? (
          <Image
            src={`${IMAGE_BASE_URL}/${product.id}/${primaryImage.name}`}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Konten Informasi Produk */}
      <div className="flex flex-1 flex-col p-4">
        {/* Nama Produk */}
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-600">
          {product.name}
        </h3>
        {/* Tombol Aksi */}
        <div className="mt-4 pt-2">
          <Link
            href={`/products/${product.id}`}
            className="w-full block rounded-lg bg-blue-600 px-4 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
