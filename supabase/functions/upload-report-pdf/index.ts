const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(data: BufferSource): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', data));
}

async function hmacSha256(
  key: BufferSource,
  message: string
): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(message)
  );
}

async function getSigningKey(secret: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate    = await hmacSha256(new TextEncoder().encode(`AWS4${secret}`), dateStamp);
  const kRegion  = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

async function s3Put(
  url: string,
  body: ArrayBuffer,
  contentType: string,
  creds: { accessKeyId: string; secretAccessKey: string },
): Promise<Response> {
  const region  = 'auto';
  const service = 's3';
  const now       = new Date();
  const amzDate   = now.toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  const dateStamp = amzDate.slice(0, 8);
  const parsedUrl    = new URL(url);
  const host         = parsedUrl.host;
  const canonicalUri = parsedUrl.pathname;
  const payloadHash  = await sha256Hex(body);
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders    = 'content-type;host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(new TextEncoder().encode(canonicalRequest)),
  ].join('\n');
  const signingKey  = await getSigningKey(creds.secretAccessKey, dateStamp, region, service);
  const signature   = toHex(await hmacSha256(signingKey, stringToSign));
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${creds.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type':         contentType,
      'x-amz-date':           amzDate,
      'x-amz-content-sha256': payloadHash,
      'Authorization':        authorization,
    },
    body,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }
  try {
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Método não permitido.' }, 405);
    }

    // --- ENV ---
    const accountId       = Deno.env.get('R2_ACCOUNT_ID') ?? '';
    const accessKeyId     = Deno.env.get('R2_ACCESS_KEY_ID') ?? '';
    const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '';
    const bucket          = Deno.env.get('R2_BUCKET') ?? '';
    const publicBaseUrl   = Deno.env.get('R2_PUBLIC_BASE_URL') ?? '';

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      return jsonResponse({ error: 'Configuração interna inválida.' }, 500);
    }

    // --- FORM ---
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: 'Corpo inválido (esperado multipart/form-data).', message: msg }, 400);
    }

    const file = formData.get('file');
    const year = formData.get('year')?.toString() || String(new Date().getFullYear());
    const slug = formData.get('slug')?.toString() || '';

    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: 'Campo "file" é obrigatório.' }, 400);
    }

    // --- Validação PDF ---
    if (file.size > 20 * 1024 * 1024) {
      return jsonResponse({ error: 'Arquivo excede 20MB.' }, 400);
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return jsonResponse({ error: 'Apenas PDFs são aceitos.', debug: { type: file.type, name: file.name } }, 400);
    }

    // --- Nome seguro ---
    const originalName = slug || file.name;
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalName = safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`;
    const key = `reports/documents/${year}/${finalName}`;
    const uploadUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;

    // --- Upload ---

    let fileBuffer: ArrayBuffer;
    try {
      fileBuffer = await file.arrayBuffer();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: 'internal_error', message: msg }, 500);
    }

    let r2Res: Response;
    try {
      const uploadBuffer = fileBuffer.slice(0);
      r2Res = await s3Put(uploadUrl, uploadBuffer, 'application/pdf', {
        accessKeyId,
        secretAccessKey,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: 'internal_error', message: msg }, 502);
    }

    if (!r2Res.ok) {
      const body = await r2Res.text().catch(() => '');
      return jsonResponse({ error: 'internal_error', message: `R2 ${r2Res.status}: ${body}` }, 502);
    }

    // --- Retorno ---
    const url = `${publicBaseUrl}/${key}`;
    return jsonResponse({ url, key });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ error: 'internal_error', message }, 500);
  }
});