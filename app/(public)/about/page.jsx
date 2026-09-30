<<<<<<< HEAD
import Markdown from "react-markdown";
import AboutDetail from "@/components/AboutDetail";
async function getAbout() {
  const res = await fetch(`${process.env.BASE_URL}/api/abouts`);
  const data = await res.json();
  return data;
}

export default async function Page() {
  const { data } = await getAbout();

  return (
    <div className="max-w-4xl mx-auto text-base/8">
      {/* <Markdown>{data?.[0].description}</Markdown> */}
      <AboutDetail aboutData={data?.[0]} />
=======
export default async function Page() {
  return (
    <div className="max-w-4xl mx-auto py-24 mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Tentang Perusahaan
      </h1>
      <p className="mb-5 line text-base/8">
        CV. Gravindo Berkati Sukses didirikan dengan Akta Notaris No. 15 Tanggal
        24 Juli 2019, dihadapan Notaris HERI MARTONO, SH. Berkedudukan di Jl.
        Kasuari 2 No. 164 Perumnas 1 Bekasi. Dasar berdirinya perusahaan ini
        adalah untuk menjalankan usaha - usaha di bidang perdagangan, Ekspor -
        Impor untuk perusahaan, gas, perminyakan dan perkapalan. CV. Gravindo
        Berkati Sukses secara devinitive yaitu sebuah perusahaan yang bergerak
        di bidang perdagangan ( Supplier ) dan jasa yang khusus bekerja untuk
        memenuhi kebutuhan perusahaan, gas, perminyakan dan perkapalan. Dengan
        mendekatkan filosofi dasar tersebut di atas yang di sertai kerangka
        berfikir yang visioner ke depan, maka CV. Gravindo Berkati Sukses
        diharapkan dapat menjadi sebuah perusahaan yang kompeten dan terus
        memperjuangkan visinya sesuai dengan undang - undang dan peraturan -
        peraturan pemerintah.
      </p>
      <p className="mb-10 text-base/8">
        Agar peran serta CV. Gravindo Berkati Sukses lebih terarah sebagai suatu
        perusahaan di bidang perdagangan dan jasa ( Supplier ), maka dalam
        melakukan usahanya akan selalu melihat visi dan misi yang telah di
        sepakati bersama untuk terus maju meningkatkan pelayanannya.
      </p>
      <h1 className="text-xl font-bold mb-5"> Visi Perusahaan</h1>
      <ul className="list-disc mb-5">
        <li>
          Menjadi sebuah perusahaan yang mendukung pembangunan ekonomi dalam
          bisnis penyedia / pengadaan barang dan jasa untuk barang-barang yang
          berhubungan dengan Air, Minyak, Industri, Galangan Kapal, dan Gas.
        </li>
      </ul>
      <h1 className="text-xl font-bold mb-5"> Misi Perusahaan</h1>
      <ul className="list-disc">
        <li>
          Menyediakan kebutuhan alat-alat teknik Valve, Accesories, Instrument,
          Equipment, Fitting dan lain-lain.
        </li>
        <li>
          Melayani pengadaan suku cadang Valve, Accesories, Instrument,
          Equipment, Fitting dan perbaikan dibidang air, minyak, gas, industri,
          dan galangan kapal.
        </li>
        <li>
          Melayani pengadaan dan perbaikan segala jenis Valve dan Accesories.
        </li>
      </ul>
>>>>>>> 2e424394df13a777425261fb2a855b209f4bd35d
    </div>
  );
}
