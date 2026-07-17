// WhatsApp Donation Tracking — GA4 + Meta Pixel
// YPSMA — Donation Tracking (GA4 + Meta Pixel + Meta CAPI)
// Central tracking for all WA interactions and e-commerce funnel events
// Enhanced with campaign-level parameters for granular retargeting
import { DONATION_TYPES, CONTACT_INFO } from './constants';

/** Monotonic counter for unique event IDs (deduplication between Pixel & CAPI) */
let _eventIdSeq = 0;
function nextEventId(): string {
  return `ypsma_${Date.now()}_${++_eventIdSeq}`;
}

/** Standard extra params for every fbq event — campaign context */
export interface FbqExtra {
  campaign_slug?: string;
  campaign_name?: string;
  donation_type?: string;
}

/** Safe fbq call with enhanced campaign params.
 *  Generates `eventID` for dedup and returns it so the caller can share it with CAPI.
 *  Adds extra fields if provided. */
export function fbqEvent(
  event: string,
  params: Record<string, unknown> = {},
  extra?: FbqExtra,
): string | undefined {
  if (typeof window === 'undefined') return;
  const w = window as Window & { fbq?: Function };
  if (typeof w.fbq !== 'function') return;
  const eventID = nextEventId();
  const enhanced = extra ? { ...params, ...extra } : params;
  try {
    w.fbq('track', event, enhanced, { eventID });
    return eventID;
  } catch { /* fbq unavailable */ }
}

/** Send server-side event to Meta CAPI endpoint (ad-blocker resilient).
 *  Pass `eventID` for dedup with the client-side Pixel event. */
export async function trackCapi(
  event: string,
  params: Record<string, unknown> = {},
  eventID?: string,
) {
  const data = { event, params, url: window.location.href, event_id: eventID };
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch { /* CAPI unavailable — non-blocking */ }
}

/** Fire both Pixel and CAPI for the same event with shared eventID for dedup.
 *  Returns the eventID for logging/debugging. */
export function trackBoth(
  event: string,
  params: Record<string, unknown> = {},
  extra?: FbqExtra,
): string | undefined {
  const eventID = fbqEvent(event, params, extra);
  trackCapi(event, { ...params, ...extra }, eventID);
  return eventID;
}
export interface WaGreeting {
  /** Teks yang muncul di tombol */
  label: string;
  /** Pesan WA yang dikirim */
  message: string;
  /** Nama campaign untuk tracking */
  campaign: string;
}

const WA_BASE = CONTACT_INFO.wa;

const WA_GREETINGS: Record<string, WaGreeting> = {
  'sedekah-pangan-santri': {
    label: 'Donasi Pangan Santri via WA',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk program Pangan Santri di YPSM Jombang. Mohon info cara donasi dan nominal yang bisa disalurkan.',
    campaign: 'Pangan Santri',
  },
  'sedekah-al-quran': {
    label: 'Donasi Al-Qur\'an via WA',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk program Sedekah Al-Qur\'an di YPSM Jombang. Mohon info cara donasi dan nominalnya.',
    campaign: 'Sedekah Al-Qur\'an',
  },
  'orang-tua-asuh': {
    label: 'Jadi Orang Tua Asuh via WA',
    message: 'Assalamu\'alaikum, saya tertarik menjadi Orang Tua Asuh di YPSM Jombang. Mohon info lebih lanjut tentang program ini.',
    campaign: 'Orang Tua Asuh',
  },
  'patungan-listrik': {
    label: 'Donasi Listrik via WA',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk program Patungan Listrik di YPSM Jombang. Mohon info cara donasi.',
    campaign: 'Patungan Listrik',
  },
  'sumur-air-bersih': {
    label: 'Donasi Sumur & MCK via WA',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk program Sumur Air Bersih & MCK di YPSM Jombang. Mohon info lebih lanjut.',
    campaign: 'Sumur & MCK',
  },
  'sarana-prasarana': {
    label: 'Donasi Sarpras via WA',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk program Sarana & Prasarana di YPSM Jombang. Mohon info cara donasi.',
    campaign: 'Sarana Prasarana',
  },
  'pengelolaan-sampah': {
    label: 'Donasi Kelola Sampah via WA',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk program Pengelolaan Sampah di YPSM Jombang. Mohon info lebih lanjut.',
    campaign: 'Kelola Sampah',
  },
  'sedekah-anak-yatim': {
    label: 'Santuni Yatim via WA',
    message: 'Assalamu\'alaikum, saya ingin menyantuni anak yatim di YPSM Jombang. Mohon info cara donasi dan nominalnya.',
    campaign: 'Santunan Yatim',
  },
  'umum': {
    label: 'Donasi via WhatsApp',
    message: 'Assalamu\'alaikum, saya ingin berdonasi untuk YPSM Jombang. Mohon info lebih lanjut.',
    campaign: 'Donasi Umum',
  },
};

/** Dapatkan greeting dan buat URL WhatsApp untuk campaign tertentu */
export function getWaUrl(slug?: string): { url: string; greeting: WaGreeting } {
  const greeting = (slug && WA_GREETINGS[slug]) || WA_GREETINGS['umum'];
  const text = encodeURIComponent(greeting.message);
  return { url: `https://wa.me/${WA_BASE}?text=${text}`, greeting };
}

/** Track event ke GA4 + Meta Pixel */
export function trackWaClick(slug?: string, action: string = 'click') {
  const g = (slug && WA_GREETINGS[slug]) || WA_GREETINGS['umum'];

  // GA4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: Function; fbq?: Function };
    if (typeof w.gtag === 'function') {
      try {
        w.gtag('event', 'whatsapp_click', {
          campaign: g.campaign,
          action,
          page_path: window.location.pathname,
        });
      } catch { /* ga4 unavailable */ }
    }
  }

  // Meta Pixel
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: Function; fbq?: Function };
    if (typeof w.fbq === 'function') {
      try {
        w.fbq('track', 'Contact', {
          content_name: `WA: ${g.campaign}`,
          content_category: 'whatsapp-donasi',
        });
      } catch { /* fbq unavailable */ }
    }
  }
}
