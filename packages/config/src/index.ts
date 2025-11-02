import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string().min(1).optional(),
    TIMESERIES_DATABASE_URL: z.string().min(1).optional(),
    MQTT_BROKER_URL: z.string().default("mqtt://localhost:1883"),
    S3_ENDPOINT: z.string().default("http://localhost:9000"),
    S3_ACCESS_KEY: z.string().default("minio"),
    S3_SECRET_KEY: z.string().default("minio123"),
    AUTH_ISSUER_URL: z.string().url().optional(),
    AUTH_AUDIENCE: z.string().optional(),
    AUTH_JWKS_URL: z.string().url().optional(),
    AUTH_DEV_SHARED_SECRET: z.string().optional()
  })
  .transform(data => ({
    ...data,
    isDevelopment: data.NODE_ENV === "development",
    isProduction: data.NODE_ENV === "production",
    isTest: data.NODE_ENV === "test"
  }));

export type RawEnvConfig = z.input<typeof envSchema>;
export type AppConfig = z.output<typeof envSchema>;

export const loadConfig = (overrides?: Partial<Record<keyof RawEnvConfig, string | undefined>>): AppConfig => {
  const merged: Record<string, string | undefined> = { ...process.env, ...overrides };
  return envSchema.parse(merged);
};

export const requireConfigValues = <K extends keyof AppConfig>(config: AppConfig, ...keys: K[]): void => {
  const missing = keys.filter(key => {
    const value = config[key];
    return value === undefined || value === null || value === "";
  });
  if (missing.length > 0) {
    throw new Error(`Missing required configuration values: ${missing.join(", ")}`);
  }
};
