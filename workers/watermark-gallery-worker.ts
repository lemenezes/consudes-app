import type { R2Bucket } from "@cloudflare/workers-types";

interface Env {
  CONSUDES_ASSETS: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // =========================================================
    // STATUS
    // =========================================================
    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({
        ok: true,
        worker: "consudes-watermark-gallery"
      });
    }

    // =========================================================
    // LISTAR IMAGENS ORIGINAIS
    // =========================================================
    if (request.method === "GET" && url.pathname === "/list") {
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

    // =========================================================
    // DOWNLOAD DE UMA IMAGEM ORIGINAL
    // =========================================================
    if (request.method === "GET" && url.pathname === "/image") {
      const key = url.searchParams.get("key");

      if (!key || !key.startsWith("gallery/") || key.includes("..")) {
        return Response.json({ error: "Chave inválida" }, { status: 400 });
      }

      const object = await env.CONSUDES_ASSETS.get(key);

      if (!object) {
        return Response.json(
          { error: "Imagem não encontrada" },
          { status: 404 }
        );
      }

      // Evita conflito de tipos ReadableStream
      const body = await object.arrayBuffer();

      return new Response(body, {
        headers: {
          "Content-Type":
            object.httpMetadata?.contentType || "application/octet-stream",

          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }

    // =========================================================
    // UPLOAD DA IMAGEM COM WATERMARK
    //
    // SEGURANÇA:
    // somente gallery-watermarked/
    // nunca escreve em gallery/
    // =========================================================
    if (request.method === "PUT" && url.pathname === "/watermarked") {
      const key = url.searchParams.get("key");

      if (
        !key ||
        !key.startsWith("gallery-watermarked/") ||
        key.includes("..")
      ) {
        return Response.json({ error: "Destino inválido" }, { status: 400 });
      }

      // -------------------------------------------------------
      // Não sobrescrever arquivo existente
      // -------------------------------------------------------
      const existing = await env.CONSUDES_ASSETS.head(key);

      if (existing) {
        return Response.json(
          {
            error: "Arquivo já existe",
            key
          },
          { status: 409 }
        );
      }

      // -------------------------------------------------------
      // Ler upload inteiro como ArrayBuffer
      // Evita conflito entre os dois tipos de ReadableStream
      // -------------------------------------------------------
      const body = await request.arrayBuffer();

      if (body.byteLength === 0) {
        return Response.json({ error: "Arquivo vazio" }, { status: 400 });
      }

      const contentType = request.headers.get("Content-Type") || "image/webp";

      // -------------------------------------------------------
      // Gravar somente na nova pasta
      // -------------------------------------------------------
      await env.CONSUDES_ASSETS.put(key, body, {
        httpMetadata: {
          contentType,
          cacheControl: "public, max-age=31536000, immutable"
        }
      });

      return Response.json({
        ok: true,
        key,
        size: body.byteLength
      });
    }

    // =========================================================
    // NOT FOUND
    // =========================================================
    return new Response("Not Found", { status: 404 });
  }
};
