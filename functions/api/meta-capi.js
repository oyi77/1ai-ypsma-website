/**
 * CF Pages Function — POST /api/meta-capi
 * Server-side Meta Conversions API forwarding.
 * Ensures Conversion events survive ad blockers.
 *
 * CF secrets required (set via wrangler or dashboard):
 *   META_ACCESS_TOKEN  = Meta Conversions API token from Events Manager
 *
 * CF env vars:
 *   META_PIXEL_ID      = Facebook Pixel ID (set in wrangler.toml)
 */

const FB_API = 'https://graph.facebook.com/v18.0';

// CORS — same as donate.js
function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ['https://ypsma.org', 'https://www.ypsma.org', 'http://localhost:8788', 'http://localhost:3000'];
  const corsOrigin = allowed.includes(origin) ? origin : 'https://ypsma.org';
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const cors = corsHeaders(request);

  const PIXEL = env.META_PIXEL_ID;
  const TOKEN = env.META_ACCESS_TOKEN;

  if (!PIXEL || !TOKEN) {
    return Response.json(
      { error: 'Meta CAPI not configured — missing META_PIXEL_ID or META_ACCESS_TOKEN' },
      { status: 503, headers: cors },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: cors });
  }

  const { event, params, url, event_id } = body;
  if (!event) {
    return Response.json({ error: 'Missing event name' }, { status: 400, headers: cors });
  }

  // Build CAPI event per Meta's server-event API (with event_id for dedup)
  const eventData = {
    event_name: event,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event_id || undefined,
    action_source: 'website',
    event_source_url: url || 'https://ypsma.org',
    user_data: {
      client_ip_address: request.headers.get('CF-Connecting-IP') || '0.0.0.0',
      client_user_agent: request.headers.get('User-Agent') || '',
    },
    custom_data: {
      ...params,
      ...(event === 'Purchase' && !params?.currency ? { currency: 'IDR' } : {}),
    },
  };

  try {
    const fbUrl = `${FB_API}/${PIXEL}/events?access_token=${TOKEN}`;
    const fbRes = await fetch(fbUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data: [eventData] }),
    });

    const fbData = await fbRes.json();

    if (!fbRes.ok) {
      console.error('[Meta CAPI] FB error:', fbData);
      return Response.json({ error: 'Meta API error', detail: fbData }, { status: 502, headers: cors });
    }

    return Response.json({ success: true, fb: fbData }, { status: 200, headers: cors });
  } catch (err) {
    console.error('[Meta CAPI] Network error:', err);
    return Response.json({ error: 'Failed to reach Meta API' }, { status: 502, headers: cors });
  }
}

// Handle preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
