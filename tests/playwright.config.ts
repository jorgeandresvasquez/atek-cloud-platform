import { defineConfig } from "@playwright/test";
export default defineConfig({
  webServer: [{ command: "pnpm -w dev", port: 3000, timeout: 120_000 }],
  use: { baseURL: "http://localhost:3000" }
});
