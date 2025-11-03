import { createRemoteJWKSet, jwtVerify } from "jose";
import { loadConfig } from "@atek/config";
import type { JWTPayload } from "jose";

export interface AccessTokenClaims extends JWTPayload {
  tenantId?: string;
  tenant_id?: string;
  "https://atek.dev/tenant_id"?: string;
  roles?: string[];
  scope?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  email?: string;
  name?: string;
}

export interface AuthContext {
  tenantId: string;
  userId: string;
  roles: string[];
  email?: string;
  name?: string;
  claims: AccessTokenClaims;
  token: string;
}

const config = loadConfig();

const jwks = config.AUTH_JWKS_URL ? createRemoteJWKSet(new URL(config.AUTH_JWKS_URL)) : null;
const sharedSecret = config.AUTH_DEV_SHARED_SECRET ? new TextEncoder().encode(config.AUTH_DEV_SHARED_SECRET) : null;

const resolveTenantId = (claims: AccessTokenClaims): string | undefined => {
  const candidateKeys: (keyof AccessTokenClaims)[] = [
    "tenantId",
    "tenant_id",
    "https://atek.dev/tenant_id"
  ];

  for (const key of candidateKeys) {
    const value = claims[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  if (typeof claims["custom:tenant_id"] === "string") {
    return claims["custom:tenant_id"];
  }

  return undefined;
};

const resolveRoles = (claims: AccessTokenClaims): string[] => {
  if (Array.isArray(claims.roles)) {
    return claims.roles;
  }

  if (claims.realm_access?.roles) {
    return claims.realm_access.roles;
  }

  if (claims.resource_access) {
    const aggregated = Object.values(claims.resource_access)
      .flatMap(access => access.roles ?? [])
      .filter(Boolean);
    if (aggregated.length > 0) {
      return aggregated;
    }
  }

  if (typeof claims.scope === "string") {
    return claims.scope.split(" ").filter(Boolean);
  }

  return [];
};

export const verifyAccessToken = async (token: string): Promise<AuthContext> => {
  if (!token) {
    throw new Error("Access token is required");
  }

  if (!jwks && !sharedSecret) {
    throw new Error("Authentication verification is not configured. Set AUTH_JWKS_URL or AUTH_DEV_SHARED_SECRET.");
  }

  const verificationOptions = {
    issuer: config.AUTH_ISSUER_URL,
    audience: config.AUTH_AUDIENCE
  };

  const verificationResult = jwks
    ? await jwtVerify<AccessTokenClaims>(token, jwks, verificationOptions)
    : await jwtVerify<AccessTokenClaims>(token, sharedSecret!, verificationOptions);

  const claims = verificationResult.payload;
  const tenantId = resolveTenantId(claims);
  if (!tenantId) {
    throw new Error("Token is missing tenant context (tenantId claim).");
  }

  const userId = claims.sub;
  if (!userId) {
    throw new Error("Token subject (sub) is required.");
  }

  const roles = resolveRoles(claims);

  return {
    tenantId,
    userId,
    roles,
    email: claims.email,
    name: claims.name,
    claims,
    token
  };
};

export const isAuthOptional = (): boolean => Boolean(sharedSecret && !jwks && config.isDevelopment);
