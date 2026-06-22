import type { R2Bucket } from "@cloudflare/workers-types";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "content-type"
};

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const IMAGE_CONTENT_TYPE_REGEX = /^image\/(jpeg|png|webp|gif|avif)$/i;

interface Env {
  CONSUDES_ASSETS: R2Bucket;
  CDN_BASE_URL?: string;
  ALLOWED_ORIGINS?: string; // CSV: https://a.com,https://b.com
}

function getAllowedOrigins(env: Env): string[] {
  if (!env.ALLOWED_ORIGINS) return [];
  return env.ALLOWED_ORIGINS.split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
}

function buildCorsHeaders(request: Request, env: Env): Headers {
  const requestOrigin = request.headers.get("origin") || "";
  const allowedOrigins = getAllowedOrigins(env);

  if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
    return new Headers(CORS_HEADERS);
  }

  const responseHeaders = new Headers(CORS_HEADERS);
  responseHeaders.set(
    "Access-Control-Allow-Origin",
    allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0]
  );
  responseHeaders.set("Vary", "Origin");
  return responseHeaders;
}

function jsonResponse(
  request: Request,
  env: Env,
  status: number,
  payload: Record<string, unknown>
): Response {
  const headers = buildCorsHeaders(request, env);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(payload), { status, headers });
}

function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeFilename(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // Mantem apenas o nome base para evitar path traversal.
  const baseName = trimmed.split(/[\\/]/).pop() || "";
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isValidImageContentType(contentType: string): boolean {
  const normalized = contentType.split(";")[0].trim();
  return IMAGE_CONTENT_TYPE_REGEX.test(normalized);
}

function getPublicBaseUrl(env: Env): string {
  const fallback = "https://cdn.consudes.leandrom.com.br";
  return (env.CDN_BASE_URL || fallback).replace(/\/$/, "");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method === "DELETE") {
      const key = url.searchParams.get("key") || "";
      if (
        !key.startsWith("gallery/") ||
        key.includes("..") ||
        key.startsWith("/")
      ) {
        return jsonResponse(request, env, 400, { error: "Chave inválida" });
      }

      await env.CONSUDES_ASSETS.delete(key);
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    const albumSlug = sanitizeSlug(url.searchParams.get("albumSlug") || "");
    const safeFilename = sanitizeFilename(
      url.searchParams.get("filename") || ""
    );

    if (!albumSlug || !safeFilename) {
      return jsonResponse(request, env, 400, {
        error: "albumSlug e filename são obrigatórios"
      });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!isValidImageContentType(contentType)) {
      return jsonResponse(request, env, 400, {
        error: "Content-Type inválido, deve ser imagem"
      });
    }

    const body = await request.arrayBuffer();
    if (body.byteLength === 0) {
      return jsonResponse(request, env, 400, { error: "Body vazio" });
    }

    if (body.byteLength > MAX_IMAGE_SIZE_BYTES) {
      return jsonResponse(request, env, 413, {
        error: "Arquivo excede 10MB"
      });
    }

    const key = "gallery/" + albumSlug + "/" + safeFilename;
    await env.CONSUDES_ASSETS.put(key, body, {
      httpMetadata: {
        contentType: contentType.split(";")[0].trim().toLowerCase(),
        cacheControl: "public, max-age=31536000, immutable"
      }
    });

    const publicBaseUrl = getPublicBaseUrl(env);
    const publicUrl = publicBaseUrl + "/" + key;

    return jsonResponse(request, env, 200, {
      url: publicUrl,
      key,
      filename: safeFilename
    });
  }
};
