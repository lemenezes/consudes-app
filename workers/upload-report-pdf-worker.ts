export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/pdf')) {
      return new Response(JSON.stringify({ error: 'Arquivo deve ser PDF' }), { status: 400 });
    }
    const url = new URL(request.url);
    // Validação de tamanho (máx. 10MB)
    const maxSize = 10 * 1024 * 1024;
    const body = await request.arrayBuffer();
    if (body.byteLength > maxSize) {
      return new Response(JSON.stringify({ error: 'Arquivo excede 10MB' }), { status: 413 });
    }
    // Extrai nome e ano do query param
    const filename = url.searchParams.get('filename');
    const year = url.searchParams.get('year');
    if (!filename || !year) {
      return new Response(JSON.stringify({ error: 'filename e year são obrigatórios' }), { status: 400 });
    }
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalName = safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`;
    const key = `reports/documents/${year}/${finalName}`;
    // Salva no R2
    await env.CONSUDES_ASSETS.put(key, body, {
      httpMetadata: {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });
    const publicUrl = `https://cdn.consudes.leandrom.com.br/${key}`;
    return new Response(JSON.stringify({ url: publicUrl, key }), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  },
};

type Env = {
  CONSUDES_ASSETS: R2Bucket;
};
