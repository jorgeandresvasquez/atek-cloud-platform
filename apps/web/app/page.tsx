export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/health`, { cache: "no-store" }).then(r => r.json());
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>ATEK Local Dashboard</h1>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </main>
  );
}
