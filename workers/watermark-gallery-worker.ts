import type { R2Bucket } from "@cloudflare/workers-types";

interface Env {
  CONSUDES_ASSETS: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (url.pathname === "/") {
      return Response.json({
        ok: true,
        worker: "consudes-watermark-gallery"
      });
    }

    if (url.pathname === "/list") {
      const cursor = url.searchParams.get("cursor") || undefined;

      const result = await env.CONSUDES_ASSETS.list({
        prefix: "gallery/",
        limit: 1000,
        cursor
      });

      return Response.json({
        count: result.objects.length,
        truncated: result.truncated,
        cursor: result.truncated ? result.cursor : null,
        objects: result.objects.map(object => ({
          key: object.key,
          size: object.size,
          uploaded: object.uploaded
        }))
      });
    }

    if (url.pathname === "/image") {
      const key = url.searchParams.get("key");

      if (!key || !key.startsWith("gallery/") || key.includes("..")) {
        return Response.json(
          { error: "Chave inválida" },
          { status: 400 }
        );
      }

      const object = await env.CONSUDES_ASSETS.get(key);

      if (!object) {
        return Response.json(
          { error: "Imagem não encontrada" },
          { status: 404 }
        );
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);

      headers.set(
        "Content-Type",
        object.httpMetadata?.contentType || "application/octet-stream"
      );

      return new Response(object.body, { headers });
    }

    return new Response("Not Found", { status: 404 });
  }
};
