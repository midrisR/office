<<<<<<< HEAD
=======
import Markdown from "react-markdown";
>>>>>>> daf330a4b0e5ede4ff4f3b9b957725ca162e390a
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
    </div>
  );
}
