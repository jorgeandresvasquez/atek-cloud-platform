import { expect, test } from "vitest";
const API = process.env.API_URL ?? "http://localhost:3001";

test("lists readings for tenant", async () => {
  const input = encodeURIComponent(JSON.stringify({ tenantId: "tenant-dev-1" }));
  const res = await fetch(`${API}/trpc/listReadings?input=${input}`);
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toBeDefined();
});
