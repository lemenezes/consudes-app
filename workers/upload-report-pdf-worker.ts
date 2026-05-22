const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    const year = url.searchParams.get('year');
    if (!filename || !year) {
      return new Response(JSON.stringify({ error: 'filename e year são obrigatórios' }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }
    // Validação de extensão
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return new Response(JSON.stringify({ error: 'Arquivo deve ser PDF' }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }
    // Validação de tamanho (máx. 20MB)
    const maxSize = 20 * 1024 * 1024;
    const body = await request.arrayBuffer();
    if (body.byteLength > maxSize) {
      return new Response(JSON.stringify({ error: 'Arquivo excede 20MB' }), { status: 413, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }
    // Validação de Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('pdf')) {
      return new Response(JSON.stringify({ error: 'Content-Type inválido, deve ser PDF' }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `reports/documents/${year}/${safeName}`;
    await env.CONSUDES_ASSETS.put(key, body, {
      httpMetadata: {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });
    const publicUrl = `https://cdn.consudes.leandrom.com.br/${key}`;
    return new Response(JSON.stringify({ url: publicUrl, key }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      status: 200,
    });
  },
};

