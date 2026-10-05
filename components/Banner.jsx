import { Carousel } from "antd";
import Image from "next/image";
async function getBbanners() {
  const response = await fetch(
    `${process.env.BASE_URL}/api/banners?published=true`,
  );
  const result = await response.json();
  return result;
}

export default async function Banner() {
  const { data } = await getBbanners();

  return (
    <Carousel
      arrows
      draggable
      autoplay
      config={{
        arrowSize: "132",
      }}
    >
      {data.map(({ id, image }) => (
        <Image
          className="rounded-2xl"
          key={id}
          src={`/images/banners/${image}`}
          width={1200} // Angka bebas, hanya sebagai acuan rasio asli gambar
          height={600}
          sizes="100vw"
          loading="eager"
          alt="TRIPLE RICH PRODUCTION"
        />
      ))}
    </Carousel>
  );
}
