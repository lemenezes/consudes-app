import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type"
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS
    }
  });
}

function safeSerialize(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo nao permitido." }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "Configuracao interna invalida." }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Nao autenticado." }, 401);
  }

  const bearerPrefix = "Bearer ";
  if (!authHeader.startsWith(bearerPrefix)) {
    return jsonResponse({ error: "Nao autenticado." }, 401);
  }

  const accessToken = authHeader.slice(bearerPrefix.length).trim();
  if (!accessToken) {
    return jsonResponse({ error: "Nao autenticado." }, 401);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  const {
    data: { user },
    error: userError
  } = await adminClient.auth.getUser(accessToken);

  if (userError || !user) {
    console.error("complete-password-change get-user-failed", {
      userErrorMessage: userError?.message,
      userErrorStatus: userError?.status,
      userErrorName: userError?.name,
      userErrorRaw: safeSerialize(userError)
    });
    return jsonResponse({ error: "Nao autenticado." }, 401);
  }

  const { data, error } = await adminClient
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("complete-password-change profile-update-failed", {
      userId: user.id,
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      errorRaw: safeSerialize(error)
    });
    return jsonResponse({ error: "Falha ao atualizar perfil." }, 500);
  }

  if (!data) {
    console.error("complete-password-change profile-not-found", {
      userId: user.id
    });
    return jsonResponse({ error: "Perfil nao encontrado." }, 404);
  }

  return jsonResponse({ ok: true });
});
