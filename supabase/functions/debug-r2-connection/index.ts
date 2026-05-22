// Função de diagnóstico para testar conexão com Cloudflare R2 sem upload

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const accountId = Deno.env.get('R2_ACCOUNT_ID') ?? '';
    const bucket = Deno.env.get('R2_BUCKET') ?? '';
    const publicBaseUrl = Deno.env.get('R2_PUBLIC_BASE_URL') ?? '';

    // Não retornar secrets
    const accountIdPrefix = accountId.slice(0, 8);

    let rootStatus = null;
    let bucketStatus = null;
    let error = null;

    try {
      const rootRes = await fetch(`https://${accountId}.r2.cloudflarestorage.com`, { method: 'GET' });
      rootStatus = rootRes.status;
    } catch (e) {
      rootStatus = null;
      error = `Erro no fetch root: ${e?.message || e}`;
    }

    try {
      const bucketRes = await fetch(`https://${accountId}.r2.cloudflarestorage.com/${bucket}`, { method: 'GET' });
      bucketStatus = bucketRes.status;
    } catch (e) {
      bucketStatus = null;
      error = error ? error + ' | ' : '';
      error += `Erro no fetch bucket: ${e?.message || e}`;
    }

    return new Response(
      JSON.stringify({
        accountIdPrefix,
        bucket,
        publicBaseUrl,
        rootStatus,
        bucketStatus,
        error,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || 'Erro desconhecido' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  }
});
