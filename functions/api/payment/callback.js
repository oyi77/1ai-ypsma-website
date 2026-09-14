/**
 * CF Pages Function — POST /api/payment/callback
 * Receives forwarded payment events from 1ai-payment service.
 *
 * The forwarder signs the JSON payload with HMAC-SHA256 using
 * the merchant's webhook_secret stored in the payments database.
 *
 * Env vars:
 *   PAYMENT_WEBHOOK_SECRET  = merchant webhook_secret for HMAC verification
 *   PAYMENT_API_KEY         = API key for 1ai-payment (optional, debug)
 */

const CORS_ORIGINS = [
  'https://ypsma.org',
  'https://www.ypsma.org',
];

/** Meta Conversions API base */
const FB_API = 'https://graph.facebook.com/v18.0';

/**
 * Fire a Purchase event to Meta CAPI (server-side).
 * Uses event_id for dedup so Meta doesn't double-count.
 */
async function firePurchaseCapi(env, event) {
  const PIXEL = env.META_PIXEL_ID;
  const TOKEN = env.META_ACCESS_TOKEN;
  if (!PIXEL || !TOKEN) {
    console.warn('[Purchase CAPI] META_PIXEL_ID or META_ACCESS_TOKEN not set — skipping Purchase event');
    return;
  }

  const campaign = event.metadata?.campaign || 'YPSMA Donation';
  const eventId = `ypsma_purchase_${event.order_id}_${Date.now()}`;

  const eventData = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    event_source_url: 'https://ypsma.org',
    user_data: {
      client_ip_address: '0.0.0.0',
      client_user_agent: 'YPSMA-Payment-Server/1.0',
    },
    custom_data: {
      currency: event.currency || 'IDR',
      value: event.amount,
      content_name: campaign,
      content_category: 'donation',
    },
  };

  try {
    const url = `${FB_API}/${PIXEL}/events?access_token=${TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data: [eventData] }),
    });
    const body = await res.json();
    if (!res.ok) {
      console.error('[Purchase CAPI] Meta API error:', body);
    } else {
      console.log('[Purchase CAPI] Sent Purchase event:', eventId, '->', JSON.stringify(body));
    }
  } catch (err) {
    console.error('[Purchase CAPI] Network error:', err);
  }
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = CORS_ORIGINS.includes(origin) ? origin : 'https://ypsma.org';
  const cors = { 'Access-Control-Allow-Origin': corsOrigin };

  try {
    const bodyText = await request.text();
    const signature = request.headers.get('X-Payment-Signature');
    const secret = env.PAYMENT_WEBHOOK_SECRET || 'berkahkarya-ecosystem-2026-secure-key';

    if (!signature) {
      return Response.json({ error: 'Missing X-Payment-Signature' }, { status: 401, headers: cors });
    }

    // Verify HMAC-SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const expected = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyText));
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedHex) {
      console.error('[Payment Callback] Invalid signature:', signature, 'expected:', expectedHex);
      return Response.json({ error: 'Invalid signature' }, { status: 401, headers: cors });
    }

    // Parse event
    const event = JSON.parse(bodyText);
    console.log('[Payment Callback] Received:', JSON.stringify({
      order_id: event.order_id,
      gateway_reference: event.gateway_reference,
      status: event.status,
      gateway: event.gateway,
      amount: event.amount,
      currency: event.currency,
      campaign: event.metadata?.campaign || null,
    }));

    // Fire Purchase event to Meta CAPI on successful settlement
    if (event.status === 'success') {
      firePurchaseCapi(env, event).catch((err) => {
        console.error('[Payment Callback] firePurchaseCapi failed:', err);
      });
    }

    // Acknowledge receipt — forwarder stops retrying
    return Response.json({ ok: true }, { status: 200, headers: cors });
  } catch (err) {
    console.error('[Payment Callback] Error:', err);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}
