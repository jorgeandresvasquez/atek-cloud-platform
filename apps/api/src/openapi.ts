import type { FastifyInstance } from "fastify";
export function createOpenApiDocs(app: FastifyInstance) {
  app.get("/openapi.json", async () => ({ openapi: "3.1.0", info: { title: "ATEK API", version: "0.1.0" } }));
}
