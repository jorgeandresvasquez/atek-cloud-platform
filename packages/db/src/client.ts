import { PrismaClient } from "@prisma/client";
import { loadConfig, requireConfigValues } from "@atek/config";

declare global {
  // eslint-disable-next-line no-var
  var __atek_prisma__: PrismaClient | undefined;
}

const config = loadConfig();
requireConfigValues(config, "DATABASE_URL");

const prismaInternal =
  globalThis.__atek_prisma__ ??
  new PrismaClient({
    log: config.isDevelopment ? ["query", "error", "warn"] : ["error"]
  });

if (config.isDevelopment) {
  globalThis.__atek_prisma__ = prismaInternal;
}

export const prisma = prismaInternal;

export const ensureDatabaseConnection = async (): Promise<void> => {
  await prisma.$connect();
};

export type TenantScopedRequest = {
  tenantId: string;
  userId?: string;
  roles?: string[];
};

export const assertTenantAccess = (scope: TenantScopedRequest): void => {
  if (!scope.tenantId) {
    throw new Error("Tenant context is required for the requested operation.");
  }
};
