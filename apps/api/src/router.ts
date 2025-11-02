import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Client as Pg } from "pg";
const t = initTRPC.context<{}>().create();
const pg = new Pg({ connectionString: process.env.DATABASE_URL });
await pg.connect();

export const appRouter = t.router({
  listReadings: t.procedure
    .input(z.object({ tenantId: z.string(), deviceId: z.string().optional(), since: z.string().optional() }))
    .query(async ({ input }) => {
      const { tenantId, deviceId } = input as any;
      const res = await pg.query(
        deviceId
          ? "select * from readings where tenant_id=$1 and device_id=$2 order by recorded_at desc limit 100"
          : "select * from readings where tenant_id=$1 order by recorded_at desc limit 100",
        deviceId ? [tenantId, deviceId] : [tenantId]
      );
      return res.rows;
    }),
});
export type AppRouter = typeof appRouter;
