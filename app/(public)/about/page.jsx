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
      {data.length > 0 ? (
        <AboutDetail description={data[0].description} />
      ) : (
        <p>No about data available.</p>
      )}
    </div>
  );
}
