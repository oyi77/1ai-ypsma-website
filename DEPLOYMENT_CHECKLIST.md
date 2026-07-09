# YPSMA Website - Deployment Checklist

## ✅ Completed (2026-07-09)

### SEO Foundations
- [x] robots.txt created with sitemap reference
- [x] sitemap.xml created with all 3 pages (index, lp-beasiswa, lp-ramadan)
- [x] JSON-LD structured data with Organization + WebSite schemas
- [x] Trust signals block added to homepage (AHU 1966, transparent reports, 237 donors)

### Contact Info Updates
- [x] Administrative phone: 082234551160 (pengurus) added to JSON-LD
- [x] Bank account updated: BRI 058501000742563 a.n. Yayasan Pendidikan Dan Sosial Maarif
- [x] All WhatsApp links updated to 082234551160

### Donation Flow Optimization
- [x] WhatsApp pre-filled CTAs for all 3 tiers (Rp 50k, 250k, variable)
- [x] QRIS static QR code section added
- [x] Bank transfer section updated with correct account
- [x] Urgency indicator for Tier 3 (Rp 50jt target, Rp 12jt collected)

## 🔄 Next Steps (Immediate - Week 1)

### Google Search Console Setup
1. Verify domain ownership via DNS TXT record or HTML file upload
2. Submit sitemap.xml (https://ypsma.org/sitemap.xml)
3. Request indexing for all 3 pages
4. Set up email alerts for crawl errors

### Payment Gateway Integration (1ai-payment)
1. Set up API key authentication for YPSMA client
2. Configure gateway routing (Midtrans + Tripay recommended for Indonesian market)
3. Create donation webhook endpoint to receive payment confirmations
4. Update QRIS section to use dynamic QR from payment gateway
5. Add automated receipt generation via email/WhatsApp

### Analytics & Tracking
1. Install Google Analytics 4
2. Set up conversion events (donation button clicks, WhatsApp redirects)
3. Configure Facebook Pixel for retargeting
4. Set up Google Tag Manager for easier tracking management

## 📊 Expected Metrics (90 Days)

### Traffic Goals
- Organic impressions: 100 → 1,000/month (+900%)
- Website visits: 500 → 5,000/month (+900%)
- Donation page visits: 50 → 500/month (+900%)

### Conversion Goals
- Total donations: Rp 5jt → Rp 20jt/month (+300%)
- New recurring donors: 10 → 40/month (+300%)
- WhatsApp inquiry rate: 2% → 5% (+150%)

### SEO Goals
- Google rich snippets visible for "yayasan pendidikan jombang"
- Featured snippet for "beasiswa santri jombang"
- Position #1-3 for 5 target keywords

## 💰 Budget Allocation (Rp 2.17jt/month)

- Google Ads: FREE (Google Ad Grants $10k/month)
- Facebook Ads: Rp 1,000,000/month
- Content creation: Rp 500,000/month
- Payment gateway fees: Rp 420,000/month (2.9% + Rp6,500 per transaction)
- Email marketing: Rp 250,000/month (Mailchimp/Sendgrid)

## 🔗 Integration Points

### 1ai-payment System
- Endpoint: POST /api/payments
- Auth: X-API-Key header
- Response: payment_url for redirect
- Webhook: Receives normalized payment confirmations
- Metadata: Preserve donor info, donation tier, campaign code

### Foundation Data
- Legal entity: Yayasan Pendidikan Dan Sosial Maarif
- AHU registration: 0026672.AH.01.04.Tahun 2020
- Bank: BRI 058501000742563
- Contact: 082234551160 (pengurus)
- Address: Jl.Diponegoro No.34 Rt.1 Rw.6 Gondek Mojowarno Jombang 61475

## 📝 Files Modified

- public/index.html (lines 20-87: JSON-LD, 469-492: trust signals, 493-570: donation section)
- public/styles/main.css (appended .tier-urgency + QRIS styles)
- public/robots.txt (new)
- public/sitemap.xml (new)
