import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./router.js";
import { createOpenApiDocs } from "./openapi.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext: () => ({}) }
});
createOpenApiDocs(app);
app.get("/health", async () => ({ ok: true }));

app.listen({ host: "0.0.0.0", port: 3001 });
