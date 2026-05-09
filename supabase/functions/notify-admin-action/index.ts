/**
 * Edge Function: notify-admin-action
 *
 * Responsabilidades:
 *   1. Inserir entrada em admin_audit_logs (via service_role).
 *   2. Enviar e-mail de notificação ao responsável (via Resend).
 *
 * Variáveis de ambiente necessárias (Supabase Dashboard → Edge Functions → Secrets):
 *   SUPABASE_URL               → URL do projeto Supabase (auto-injetada)
 *   SUPABASE_SERVICE_ROLE_KEY  → Chave service_role (auto-injetada)
 *   RESEND_API_KEY             → Chave da API Resend
 *   NOTIFY_EMAIL               → E-mail pessoal que receberá as notificações
 *   FROM_EMAIL                 → E-mail remetente verificado no Resend
 *   ADMIN_JWT_SECRET           → Secret para validar chamadas do frontend (opcional)
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API_KEY   = Deno.env.get('RESEND_API_KEY') ?? '';
const NOTIFY_EMAIL     = Deno.env.get('NOTIFY_EMAIL') ?? '';
const FROM_EMAIL       = Deno.env.get('FROM_EMAIL') ?? 'noreply@consudes.org';
const ADMIN_JWT_SECRET = Deno.env.get('ADMIN_JWT_SECRET') ?? '';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Rótulos legíveis para cada ação
const ACTION_LABELS: Record<string, string> = {
  create_news:        'Notícia criada',
  edit_news:          'Notícia editada',
  publish_news:       'Notícia publicada',
  unpublish_news:     'Notícia despublicada',
  delete_news:        'Notícia apagada',
  upload_image:       'Imagem enviada',
  delete_image:       'Imagem apagada',
  create_report:      'Relatório adicionado',
  delete_report:      'Relatório apagado',
  create_federation:  'Federação adicionada',
  edit_federation:    'Federação editada',
  delete_federation:  'Federação apagada',
};

interface AuditPayload {
  actor_email:  string;
  action:       string;
  entity_type:  string;
  entity_id?:   string | null;
  entity_title?: string | null;
  reason?:      string | null;
  metadata?:    Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  // Responde ao preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  // Validar secret opcional (ADMIN_JWT_SECRET no header x-admin-secret)
  if (ADMIN_JWT_SECRET && req.headers.get('x-admin-secret') !== ADMIN_JWT_SECRET) {
    return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
  }

  let payload: AuditPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS });
  }

  const { actor_email, action, entity_type, entity_id, entity_title, reason, metadata } = payload;

  if (!actor_email || !action || !entity_type) {
    return new Response('Missing required fields: actor_email, action, entity_type', { status: 400, headers: CORS_HEADERS });
  }

  // ── 1. Inserir no audit log ────────────────────────────────────────────────
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } },
  );

  const { error: dbError } = await supabase
    .from('admin_audit_logs')
    .insert({
      actor_email,
      action,
      entity_type,
      entity_id:    entity_id    ?? null,
      entity_title: entity_title ?? null,
      reason:       reason       ?? null,
      metadata:     metadata     ?? {},
    });

  if (dbError) {
    console.error('[audit] Erro ao inserir no banco:', dbError.message);
    // Continua mesmo com erro de DB para tentar enviar o e-mail
  }

  // ── 2. Enviar notificação por e-mail ──────────────────────────────────────
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
    console.warn('[audit] RESEND_API_KEY ou NOTIFY_EMAIL não configurados. Pulando e-mail.');
    return new Response(JSON.stringify({ ok: true, email: false }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const actionLabel = ACTION_LABELS[action] ?? action;
  const dateStr     = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const emailBody = `
<div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #1F2937;">
  <div style="background: #003B73; padding: 24px 32px;">
    <p style="color: #D9A441; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0;">
      CONSUDES — Log Administrativo
    </p>
  </div>

  <div style="padding: 32px; background: #fff; border: 1px solid #E5E7EB; border-top: none;">
    <h2 style="font-size: 20px; margin: 0 0 24px; color: #003B73;">${actionLabel}</h2>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #F3F4F6;">
        <td style="padding: 10px 0; color: #6B7280; width: 140px;">Ação</td>
        <td style="padding: 10px 0; font-weight: 500;">${actionLabel}</td>
      </tr>
      ${entity_title ? `
      <tr style="border-bottom: 1px solid #F3F4F6;">
        <td style="padding: 10px 0; color: #6B7280;">Item</td>
        <td style="padding: 10px 0; font-weight: 500;">${entity_title}</td>
      </tr>` : ''}
      <tr style="border-bottom: 1px solid #F3F4F6;">
        <td style="padding: 10px 0; color: #6B7280;">Realizada por</td>
        <td style="padding: 10px 0;">${actor_email}</td>
      </tr>
      <tr style="border-bottom: 1px solid #F3F4F6;">
        <td style="padding: 10px 0; color: #6B7280;">Data/hora</td>
        <td style="padding: 10px 0;">${dateStr}</td>
      </tr>
      ${reason ? `
      <tr>
        <td style="padding: 10px 0; color: #6B7280; vertical-align: top;">Motivo</td>
        <td style="padding: 10px 0; color: #DC2626;">${reason}</td>
      </tr>` : ''}
    </table>
  </div>

  <div style="padding: 16px 32px; background: #F9FAFB; border: 1px solid #E5E7EB; border-top: none; font-size: 12px; color: #9CA3AF;">
    Este e-mail foi gerado automaticamente pelo sistema CONSUDES.
  </div>
</div>
  `.trim();

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to:   [NOTIFY_EMAIL],
      subject: `[CONSUDES Admin] ${actionLabel}${entity_title ? `: ${entity_title}` : ''}`,
      html: emailBody,
    }),
  });

  if (!resendRes.ok) {
    const errText = await resendRes.text();
    console.error('[audit] Erro ao enviar e-mail:', errText);
  }

  return new Response(
    JSON.stringify({ ok: true, email: resendRes.ok }),
    { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } },
  );
});
