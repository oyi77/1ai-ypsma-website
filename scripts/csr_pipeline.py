#!/usr/bin/env python3
"""
CSR Pipeline — research → draft → enrich → outreach
Usage:
    python3 scripts/csr_pipeline.py --stage all [--dry-run] [--force] [--company <key>]

Stages:
  research   Auto-discover CSR contact info via web scraping + verification
  draft      Generate proposal markdown from config template (skips existing unless --force)
  enrich     Add budget table, program costs & company-specific personalization
  outreach   Send proposals via SMTP (reuses send_csr_proposals.py logic)
  all        Run all stages in sequence

Config: csr_config.yaml (YPSMA profile + company targets)
"""

import argparse
import json
import re
import os
import smtplib
import subprocess
import sys
import textwrap
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import yaml


BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.environ.get('CSR_CONFIG', os.path.join(BASE, 'csr_config.yaml'))

# ── SMTP (mirrors send_csr_proposals.py) ──────────────────────────────
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', 'grahainsanmandiri@gmail.com')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
FROM_ADDR = os.environ.get('FROM_ADDR', 'admin@ypsma.org')
FROM_NAME = os.environ.get('FROM_NAME', "YPSMA - Yayasan Pendidikan dan Sosial Ma'arif")


# ── Config ─────────────────────────────────────────────────────────────

def load_config():
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


def get_companies(cfg, key_filter=None):
    """Return list of companies matching key_filter (None = all)."""
    all_c = cfg['companies']
    if not key_filter or key_filter == 'all':
        return all_c
    matches = [c for c in all_c if c['key'] == key_filter]
    if not matches:
        print(f"  ✗ Unknown company key: {key_filter}")
        sys.exit(1)
    return matches


# ── STAGE: research ────────────────────────────────────────────────────

# Customised greeting per company — matches send_csr_proposals.py
_GREETINGS = {
    'Bank Jatim':
        'Sebagai Bank Pembangunan Daerah Jawa Timur, kami percaya Bank Jatim memiliki komitmen '
        'kuat dalam memajukan pendidikan di Jawa Timur melalui program CSR.',
    'Bank Syariah Indonesia':
        'Sebagai bank syariah terbesar di Indonesia, kami percaya BSI memiliki perhatian besar '
        'pada pendidikan dan pemberdayaan umat melalui program CSR dan ZISWAF.',
    'Pertamina':
        'Sebagai perusahaan energi nasional, kami percaya Pertamina memiliki komitmen kuat '
        'terhadap pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'PLN':
        'Sebagai perusahaan listrik negara, kami percaya PLN memiliki perhatian pada pendidikan '
        'dan pengembangan sumber daya manusia melalui program CSR.',
    'PT Semen Indonesia (SIG)':
        'Sebagai perusahaan semen terkemuka di Indonesia, kami percaya SIG memiliki komitmen '
        'terhadap pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'Telkom Indonesia':
        'Sebagai perusahaan telekomunikasi nasional, kami percaya Telkom memiliki komitmen kuat '
        'dalam mendorong transformasi digital pendidikan melalui program CSR dan TJSL.',
    'Bank Central Asia (BCA)':
        'Sebagai bank swasta terbesar di Indonesia, kami percaya Bakti BCA memiliki perhatian besar '
        'pada peningkatan kualitas pendidikan melalui program perpustakaan pintar dan renovasi sekolah.',
    'Bank Mandiri':
        'Sebagai bank BUMN terkemuka, kami percaya Mandiri Peduli memiliki komitmen kuat pada '
        'pendidikan melalui program beasiswa dan pengembangan literasi.',
    'Bank Rakyat Indonesia (BRI)':
        'Sebagai bank rakyat Indonesia, kami percaya BRI Peduli dan YBM BRILiaN memiliki perhatian '
        'besar pada pendidikan, khususnya bagi masyarakat kurang mampu.',
    'Bank Negara Indonesia (BNI)':
        'Sebagai bank BUMN yang telah lama berkontribusi pada pendidikan nasional, kami percaya '
        'BNI Peduli memiliki komitmen terhadap peningkatan akses pendidikan berkualitas.',
    'PT Kereta Api Indonesia':
        'Sebagai perusahaan transportasi nasional yang melayani jutaan penumpang, kami percaya KAI '
        'memiliki perhatian pada pendidikan masyarakat di wilayah operasionalnya melalui program TJSL.',
    'Astra International':
        'Sebagai perusahaan swasta nasional terkemuka, kami percaya Astra memiliki kepedulian tinggi '
        'pada pengembangan sumber daya manusia melalui program pendidikan dan kewirausahaan.',
    'Adhi Karya':
        'Sebagai BUMN konstruksi terkemuka, kami percaya Adhi Karya memiliki komitmen terhadap '
        'pembangunan infrastruktur pendidikan dan pemberdayaan masyarakat melalui program TJSL.',
    'Bali TV':
        'Sebagai televisi lokal yang dekat dengan masyarakat Bali, kami percaya Bali TV memiliki '
        'perhatian pada pendidikan dan pelestarian budaya Bali melalui program CSR.',
    'Bank BJB':
        'Sebagai Bank Pembangunan Daerah Jawa Barat, kami percaya BJB memiliki komitmen kuat '
        'dalam memajukan pendidikan di Jawa Barat melalui program CSR dan TJSL.',
    'Barata Indonesia':
        'Sebagai BUMN manufaktur, kami percaya Barata Indonesia memiliki kepedulian pada '
        'pendidikan vokasi dan pemberdayaan masyarakat di sekitar wilayah operasionalnya.',
    'Blue Bird':
        'Sebagai perusahaan transportasi terkemuka, kami percaya Blue Bird Peduli memiliki '
        'perhatian pada pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'Brantas Abipraya':
        'Sebagai BUMN konstruksi yang telah banyak membangun infrastruktur sosial, kami percaya '
        'Brantas Abipraya memiliki komitmen pada pendidikan dan pemberdayaan masyarakat.',
    'INKA':
        'Sebagai BUMN perkeretaapian satu-satunya di Indonesia, kami percaya INKA memiliki '
        'perhatian pada pendidikan vokasi dan pengembangan SDM industri perkeretaapian.',
    'JTV Surabaya':
        'Sebagai televisi lokal Jawa Timur, kami percaya JTV memiliki perhatian pada pendidikan '
        'dan pengembangan literasi masyarakat Jawa Timur.',
    'Kimia Farma':
        'Sebagai BUMN farmasi terkemuka, kami percaya Kimia Farma Peduli memiliki komitmen '
        'pada pendidikan kesehatan dan peningkatan kualitas kesehatan masyarakat.',
    'Len Industri':
        'Sebagai BUMN elektronik dan telematika nasional, kami percaya Len Industri memiliki '
        'perhatian pada pendidikan teknologi dan inovasi digital melalui program TJSL.',
    'Pelabuhan Indonesia':
        'Sebagai BUMN pelabuhan terbesar di Indonesia, kami percaya Pelindo Peduli memiliki '
        'komitmen pada pendidikan dan pemberdayaan masyarakat pesisir.',
    'Perum Peruri':
        'Sebagai BUMN percetakan uang negara, kami percaya Peruri memiliki perhatian pada '
        'pendidikan dan pemberdayaan masyarakat melalui program TJSL.',
    'Pindad':
        'Sebagai BUMN industri pertahanan nasional, kami percaya Pindad Peduli memiliki '
        'komitmen pada pendidikan vokasi dan pengembangan SDM Indonesia.',
    'Pupuk Indonesia':
        'Sebagai BUMN pupuk terbesar di Indonesia, kami percaya Pupuk Indonesia memiliki '
        'perhatian pada pendidikan dan pemberdayaan petani melalui program TJSL.',
    'Waskita Karya':
        'Sebagai BUMN konstruksi nasional, kami percaya Waskita Karya memiliki komitmen pada '
        'pembangunan infrastruktur pendidikan dan pemberdayaan masyarakat melalui TJSL.',
    'Wijaya Karya':
        'Sebagai BUMN konstruksi terkemuka, kami percaya Wijaya Karya (WIKA) memiliki perhatian '
        'pada pendidikan dan pemberdayaan masyarakat melalui program TJSL.',
}

def _search_query(c):
    return f'CSR {c["name"]} {" ".join(c["csr_focus"][:2])} kontak email'


def _check_domain(email):
    """Basic domain validity check — resolves MX or A record."""
    domain = email.split('@')[-1]
    try:
        import dns.resolver
        try:
            mx = dns.resolver.resolve(domain, 'MX')
            return True
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
            try:
                dns.resolver.resolve(domain, 'A')
                return True
            except Exception:
                return False
    except ImportError:
        return None  # dns not available — skip check


def _scrape_tjsl(company):
    """Try to fetch a known TJSL page for a BUMN company."""
    name_slug = company['name'].lower().replace(' ', '-').replace('(persero)', '').strip()
    patterns = [
        f'https://{name_slug}.co.id/tjsl',
        f'https://{name_slug}.com/tjsl',
        f'https://{name_slug}.co.id/csr',
        f'https://{name_slug}.com/csr',
        f'https://{name_slug}.co.id/tentang-kami/tjsl',
        f'https://{name_slug}.co.id/id/tjsl',
    ]
    import urllib.request
    import urllib.error
    for url in patterns:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                text = resp.read().decode('utf-8', errors='replace')
                found = set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text))
                csr_related = {e for e in found if any(k in e.lower()
                    for k in ('csr', 'tjsl', 'corsec', 'corporate.secretary', 'info', 'contact'))}
                if csr_related or found:
                    print(f"         ✓ Scraped {url}")
                    print(f"         Emails found: {', '.join(sorted(csr_related or found)[:3])}")
                    return csr_related or found
        except (urllib.error.HTTPError, urllib.error.URLError, ConnectionError,
                TimeoutError, OSError):
            continue
    return None


def stage_research(cfg, companies, dry_run):
    """Research CSR contact info via web scraping + domain verification."""
    print(f"\n{'='*60}")
    print("STAGE: research")
    print(f"{'='*60}\n")

    verified = 0
    found_online = 0
    no_verify = 0

    for c in companies:
        name = c['name']
        key = c['key']
        email = c.get('email', '')
        pf = c.get('proposal_file', '')
        has_proposal = os.path.isfile(os.path.join(BASE, pf)) if pf else False
        status = '✓' if has_proposal else ' '

        print(f"  [{status}] {name} ({key})")
        print(f"         Email di config: {email}")
        print(f"         CSR Program: {c['csr_name']}")

        # 1. Validate email domain
        if email and '@' in email:
            if email.endswith('@gmail.com') or email.endswith('@yahoo.com'):
                print(f"         ⚠  Email pakai {email.split('@')[1]} — cari alamat korporat")
                no_verify += 1
            else:
                domain_ok = _check_domain(email)
                if domain_ok is True:
                    print(f"         ✓ Domain {email.split('@')[1]} valid (MX records found)")
                    verified += 1
                elif domain_ok is None:
                    print(f"         ~ Domain check skipped (pip install dnspython utk verifikasi)")
                else:
                    print(f"         ✗ Domain {email.split('@')[1]} tdk ditemukan — email mungkin invalid")
                    no_verify += 1
        else:
            print(f"         ✗ Tdak ada email di config — perlu research manual")
            no_verify += 1

        # 2. Try to scrape TJSL page for better contacts
        if not dry_run:
            result = _scrape_tjsl(c)
            if result:
                found_online += 1
                csr_specific = [e for e in result if 'csr' in e.lower() or 'tjsl' in e.lower()]
                if csr_specific:
                    print(f"         ⚡ CSR-specific email found: {csr_specific[0]}")
        else:
            print(f"         Search query: {_search_query(c)}")

        print()

    # Summary
    print(f"  ── Research Summary ──")
    print(f"     Companies: {len(companies)}")
    print(f"     ✓ Domain verified:  {verified}")
    print(f"     ⚡ Online scraped:   {found_online}")
    print(f"     ✗ Needs attention:  {no_verify}")
    if dry_run:
        print("     [dry-run] — tidak ada web scraping.\n")
    else:
        print()




# ── STAGE: draft (base proposal generation) ────────────────────────────

_DRAFT_TEMPLATE = textwrap.dedent("""\
    # PROPOSAL CSR — {company[name]}

    **Pengirim:** {ypsma[name]} ({ypsma[acronym]})
    **Website:** {ypsma[website]}
    **Kontak:** {ypsma[email]} / {ypsma[phone]}

    ---

    ## Ringkasan Eksekutif

    YPSMA mengelola {ypsma[total_students]} siswa/santri di {len(ypsma[units])} unit pendidikan di Mojowarno, Jombang.
    Kami mengajukan kemitraan CSR melalui **{company[csr_name]}** untuk mendukung pendidikan dan pemberdayaan masyarakat.

    ## Profil Yayasan

    | Item | Detail |
    |---|---|
    | Nama | {ypsma[aka]} |
    | Alamat | {ypsma[address]} |
    | Tahun Berdiri | {ypsma[established]} |
    | Legalitas | SK Kemenkumham {ypsma[ahu]} |
    | Unit Pendidikan | {_units_summary(ypsma)} |
    | Total | {ypsma[total_students]} jiwa |
    | Guru/Pengurus | {ypsma[total_staff]} orang |

    ## Program yang Diajukan

    _[DRAFT — silakan sesuaikan program dan anggaran dengan prioritas CSR {company[name]}]_

    Program-program yang kami ajukan:

    {_programs_desc(company)}

    ## Kesesuaian dengan Program CSR {company[csr_name]}

    {company[csr_name]} memiliki fokus pada:
    {_focus_list(company)}

    Program yang kami ajukan sejalan dengan fokus CSR tersebut. Detail lengkap RAB
    dan dokumen pendukung tersedia dan dapat dikirimkan sesuai permintaan.

    ## Donasi Langsung

    Jika program CSR belum memungkinkan, YPSMA menerima donasi langsung melalui:

    - **Sociabuzz:** {ypsma[donation][sociabuzz]}
    - **Bank:** {ypsma[donation][bank_account][bank]} {ypsma[donation][bank_account][number]} a.n. {ypsma[donation][bank_account][name]}
    - **WhatsApp Donasi:** {ypsma[donation][wa_donasi]}
    - **Website:** {ypsma[donation][qris_url]}

    Wassalamu'alaikum warahmatullahi wabarakatuh,

    _Drs. H. Syamsun Huda Amir_
    Ketua YPSMA
""")


def _units_summary(ypsma):
    parts = [f"{u['name']} ({u['students']} siswa)" for u in ypsma['units']]
    return ', '.join(parts)


def _programs_desc(company):
    # Map program keys to descriptions
    desc_map = {
        'renovasi_kelas':
            '### 1. Renovasi Ruang Kelas dan Perpustakaan\n\n'
            'Renovasi 3 ruang kelas dan perpustakaan MI Sulamuddiniyah untuk menciptakan '
            'lingkungan belajar yang layak bagi 178 siswa.\n',
        'renovasi_sekolah':
            '### 1. Renovasi Sarana Sekolah\n\n'
            'Perbaikan infrastruktur sekolah di 4 unit pendidikan: ruang kelas, sanitasi, '
            'dan area belajar.\n',
        'beasiswa':
            '### 2. Beasiswa untuk 50 Siswa Berprestasi\n\n'
            'Beasiswa @Rp 100.000/siswa/bulan selama 12 bulan untuk siswa berprestasi '
            'dari keluarga kurang mampu.\n',
        'taman_bacaan':
            '### 2. Pembangunan Taman Bacaan & Perpustakaan\n\n'
            'Membangun ruang baca dan taman literasi untuk mendukung minat baca siswa.\n',
        'lab_komputer':
            '### 1. Laboratorium Komputer dan Internet\n\n'
            'Pembangunan lab komputer dengan 10 unit PC dan koneksi internet untuk '
            'mendukung literasi digital siswa.\n',
        'literasi_digital':
            '### 2. Program Literasi Digital\n\n'
            'Pelatihan literasi digital untuk guru dan siswa, termasuk pengenalan '
            'teknologi pembelajaran berbasis digital.\n',
        'pondok_pesantren':
            '### 2. Pengembangan Pondok Pesantren\n\n'
            'Dukungan operasional dan sarana prasarana PPTQ Darussalam yang menaungi '
            '233 santri penghafal Al-Qur\'an.\n',
        'pemberdayaan_ekonomi':
            '### 3. Program Pemberdayaan Ekonomi Orang Tua Santri\n\n'
            'Pelatihan keterampilan dan modal usaha untuk orang tua santri guna '
            'meningkatkan kemandirian ekonomi keluarga.\n',
        'kewirausahaan_santri':
            '### 1. Program Kewirausahaan Santri\n\n'
            'Pelatihan kewirausahaan dan pengembangan life skills untuk santri PPTQ '
            'dan siswa SMP agar memiliki bekal kemandirian ekonomi.\n',
    }
    result = []
    for prog in company.get('programs', []):
        desc = desc_map.get(prog)
        if desc:
            result.append(desc)
    if not result:
        result.append("Program kemitraan pendidikan sesuai kebutuhan yayasan.\n")
    return '\n'.join(result)


def _focus_list(company):
    lines = [f"1. **{f}**" for f in company.get('csr_focus', [])]
    return '\n    '.join(lines)


def stage_draft(cfg, companies, dry_run, force):
    """Generate draft proposals from templates for companies without existing files."""
    print(f"\n{'='*60}")
    print("STAGE: draft — generate base proposals")
    print(f"{'='*60}\n")

    ypsma = cfg['ypsma']
    generated = 0
    skipped = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        proposal_path = os.path.join(BASE, pf) if pf else None

        if proposal_path and os.path.isfile(proposal_path) and not force:
            print(f"  [→] {c['name']} — proposal exists, skipping (--force to regenerate)")
            skipped += 1
            continue

        if dry_run:
            print(f"  [☐] {c['name']} — would generate DRAFT proposal")
            generated += 1
            continue

        # Generate from template
        content = _DRAFT_TEMPLATE.format(
            company=c,
            ypsma=ypsma,
        )

        # Write
        if proposal_path:
            os.makedirs(os.path.dirname(proposal_path), exist_ok=True)
            with open(proposal_path, 'w') as f:
                f.write(f"<!-- DRAFT — generated by csr_pipeline.py -->\n")
                f.write(f"<!-- Review and customize before sending! -->\n\n")
                f.write(content)
            print(f"  [✓] {c['name']} → {pf}  [DRAFT — needs review]")
            generated += 1
        else:
            print(f"  [!] {c['name']} — no proposal_file in config, skipping")

    print(f"\n  Summary: {generated} generated, {skipped} skipped\n")


# ── STAGE: enrich (enrich proposals with budget & personalization) ─────

_ENRICH_BUDGET = {
    'renovasi_kelas': ('Renovasi 3 Ruang Kelas + Perpustakaan', 'Rp 185.000.000'),
    'renovasi_sekolah': ('Renovasi Sarana Sekolah (4 unit)', 'Rp 250.000.000'),
    'beasiswa': ('Beasiswa 50 Siswa/Santri × 12 bln', 'Rp 60.000.000'),
    'taman_bacaan': ('Pembangunan Taman Bacaan & Perpustakaan', 'Rp 75.000.000'),
    'lab_komputer': ('Laboratorium Komputer 10 PC + Internet', 'Rp 120.000.000'),
    'literasi_digital': ('Program Literasi Digital (guru + siswa)', 'Rp 35.000.000'),
    'pondok_pesantren': ('Pengembangan PPTQ Darussalam', 'Rp 150.000.000'),
    'pemberdayaan_ekonomi': ('Program Pemberdayaan Ekonomi Orang Tua Santri', 'Rp 100.000.000'),
    'kewirausahaan_santri': ('Program Kewirausahaan Santri', 'Rp 50.000.000'),
    'santunan_anak_yatim': ('Santunan Anak Yatim & Dhuafa (100 jiwa)', 'Rp 36.000.000'),
    'pelatihan_guru': ('Pelatihan Guru & Tenaga Pendidik', 'Rp 45.000.000'),
    'beasiswa_prestasi': ('Beasiswa Prestasi 20 Siswa × 12 bln', 'Rp 48.000.000'),
}


def _enrich_proposal(content, company):
    """Enrich base proposal with budget table and company-specific data."""
    programs = company.get('programs', {})
    budget_rows = []
    total = 0
    for prog_key, prog_name in sorted(programs.items()):
        line = _ENRICH_BUDGET.get(prog_key)
        if line:
            budget_rows.append(f'| {line[0]} | {line[1]} |')
            total += int(line[1].replace('Rp ', '').replace('.', ''))
        else:
            budget_rows.append(f'| {prog_name} | (estimasi menyusul) |')

    summary_total = f'Rp {total:,}'.replace(',', '.') if total > 0 else '(menyusul)'
    budget_table = f"""\
## Rencana Anggaran (RAB)

Berikut estimasi anggaran program yang diajukan:

| Program | Estimasi Biaya |
|---------|--------------|
{chr(10).join(budget_rows)}
| **Total** | **{summary_total}** |

"""

    # Insert budget table before donation section
    insertion = '\n' + budget_table + '\n'
    enriched = content.replace(
        '## Donasi Langsung',
        insertion + '## Donasi Langsung'
    )

    # Add enrichment header
    enriched = enriched.replace(
        '<!-- DRAFT',
        '<!-- DRAFT — ENRICHED'
    )

    # Remove old [DRAFT] disclaimer if present
    enriched = enriched.replace(
        '_[DRAFT — silakan sesuaikan program dan anggaran dengan prioritas CSR {company[name]}]_',
        ''
    )

    return enriched


def stage_enrich(cfg, companies, dry_run, force):
    """Enrich draft proposals with budget details and company-specific data."""
    print(f"\n{'='*60}")
    print("STAGE: enrich — add budget & personalization to proposals")
    print(f"{'='*60}\n")

    enriched = 0
    skipped = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        proposal_path = os.path.join(BASE, pf) if pf else None

        if not proposal_path or not os.path.isfile(proposal_path):
            print(f"  [!] {c['name']} — no proposal file, run --stage draft first")
            skipped += 1
            continue

        with open(proposal_path) as f:
            content = f.read()

        if 'ENRICHED' in content and not force:
            print(f"  [→] {c['name']} — already enriched, skipping (--force to re-enrich)")
            skipped += 1
            continue

        if dry_run:
            print(f"  [☐] {c['name']} — would enrich proposal")
            enriched += 1
            continue

        enriched_content = _enrich_proposal(content, c)
        with open(proposal_path, 'w') as f:
            f.write(enriched_content)
        print(f"  [✓] {c['name']} — enriched with budget & CSR alignment")
        enriched += 1

    print(f"\n  Summary: {enriched} enriched, {skipped} skipped\n")


# ── STAGE: outreach (send proposals via SMTP) ────────────────────────────
def _md_to_html(proposal_text):
    """Convert proposal markdown to basic HTML inline (mirrors send_csr_proposals.py)."""
    parts = []

    for line in proposal_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        if line.startswith('## '):
            parts.append(f'<h3 style="color:#1a5276;margin-top:20px">{line[3:]}</h3>')
        elif line.startswith('### '):
            parts.append(f'<h4 style="color:#2c3e50">{line[4:]}</h4>')
        elif line.startswith('- '):
            parts.append(f'<li>{line[2:]}</li>')
        elif line.startswith('|') and '---' not in line:
            continue
        elif line.startswith('**') and line.endswith('**'):
            parts.append(f'<p><strong>{line.strip("*")}</strong></p>')
        elif line:
            parts.append(f'<p>{line}</p>')
    return '\n'.join(parts)


def _build_email(comp_name, proposal_path, to_email, greeting, dry_run=False):
    """Build HTML email body from proposal markdown file."""
    with open(proposal_path) as f:
        proposal_text = f.read()

    title = proposal_text.split('\n')[0].replace('# PROPOSAL CSR — ', '').strip()
    html_body = _md_to_html(proposal_text)

    html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;margin:0;padding:0;background:#f5f5f5">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
<table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
<tr><td style="background:#1a5276;padding:25px;text-align:center">
<h1 style="color:#fff;margin:0;font-size:24px">YPSMA</h1>
<p style="color:#aed6f1;margin:4px 0 0;font-size:13px">Yayasan Pendidikan dan Sosial Ma'arif</p>
</td></tr>
<tr><td style="padding:30px">
<p style="font-size:15px;color:#555">Kepada Yth.<br><strong>Tim CSR {comp_name}</strong></p>
<p>Assalamu'alaikum warahmatullahi wabarakatuh,</p>
<p>Dengan hormat,</p>
<p>{greeting}</p>
<p>Kami dari <strong>Yayasan Pendidikan dan Sosial Ma'arif (YPSMA)</strong> — Jl Diponegoro, Mojowarno, Jombang, Jawa Timur — mengajukan proposal kemitraan program CSR untuk mendukung pendidikan 574 siswa/santri di 4 unit pendidikan yang kami kelola.</p>
<p>Berikut ringkasan proposal yang kami ajukan:</p>
<hr style="border:none;border-top:1px solid #eee;margin:20px 0">
{html_body}
<hr style="border:none;border-top:1px solid #eee;margin:20px 0">
<p style="font-size:14px">Proposal lengkap, RAB, dan dokumentasi pendukung tersedia dan dapat dikirimkan sesuai permintaan.</p>
<p style="font-size:14px">Kami sangat berharap {comp_name} dapat berkenan menerima dan mendukung program yang kami ajukan. Besar harapan kami untuk dapat bertemu atau berdiskusi lebih lanjut.</p>
<p>Wassalamu'alaikum warahmatullahi wabarakatuh,</p>
<p style="margin-top:20px"><strong>Drs. H. Syamsun Huda Amir</strong><br>
Ketua YPSMA<br>
<em>Yayasan Pendidikan dan Sosial Ma'arif</em></p>
<p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:15px;margin-top:25px">
<strong>Donasi langsung:</strong> {FROM_NAME}<br>
Bank BRI: 0585-01-000742-56-3 | Sociabuzz: https://sociabuzz.com/ypsma/tribe<br>
WA Donasi: 0321-493147 | Web: https://ypsma.org</p>
</td></tr></table></td></tr></table></body></html>"""

    msg = MIMEMultipart('alternative')
    msg['From'] = f'{FROM_NAME} <{FROM_ADDR}>'
    msg['To'] = to_email
    msg['Subject'] = f'Proposal CSR — {title} — YPSMA Jombang'

    msg.attach(MIMEText(proposal_text[:500], 'plain', 'utf-8'))
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    return msg


def stage_outreach(cfg, companies, dry_run):
    """Send proposals via SMTP."""
    print(f"\n{'='*60}")
    print("STAGE: outreach — send proposals via SMTP")
    print(f"{'='*60}\n")


    smtp_conn = None
    if not SMTP_PASS:
        if dry_run:
            print("  [dry-run] SMTP_PASS not set — showing preview only\n")
        else:
            print("  ✗ SMTP_PASS not set. Set env var to send.\n")
            print("  Use --dry-run to preview without sending.\n")
            return
    if not dry_run:
        try:
            smtp_conn = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
            smtp_conn.starttls()
            smtp_conn.login(SMTP_USER, SMTP_PASS)
            print(f"  ✓ Connected to {SMTP_HOST}:{SMTP_PORT} as {SMTP_USER}\n")
        except Exception as e:
            print(f"  ✗ SMTP connection failed: {e}\n")
            return

    sent = 0
    errors = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        proposal_path = os.path.join(BASE, pf) if pf else None
        to_email = c.get('email', '')
        comp_name = c['name']
        greeting = _GREETINGS.get(comp_name, 'Kami mengajukan proposal kemitraan CSR untuk mendukung program pendidikan YPSMA.')

        if not proposal_path or not os.path.isfile(proposal_path):
            print(f"  [!] {comp_name} — proposal file not found ({pf})")
            errors += 1
            continue

        if not to_email:
            print(f"  [!] {comp_name} — no email in config")
            errors += 1
            continue

        msg = _build_email(comp_name, proposal_path, to_email, greeting, dry_run)

        if dry_run:
            print(f"  [☐] TO: {to_email}")
            print(f"       SUBJECT: {msg['Subject']}")
            sent += 1
            continue

        try:
            smtp_conn.sendmail(FROM_ADDR, [to_email], msg.as_string())
            print(f"  [✓] {comp_name} → {to_email}")
            sent += 1
        except Exception as e:
            print(f"  [✗] {comp_name} → {to_email}: {e}")
            errors += 1

    if smtp_conn:
        smtp_conn.quit()

    print(f"\n  Summary: {sent} sent, {errors} errors\n")


# ── CLI ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='CSR Pipeline — research → draft → enrich → outreach',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              python3 scripts/csr_pipeline.py --stage all --dry-run
              SMTP_PASS='xxx' python3 scripts/csr_pipeline.py --stage outreach
              python3 scripts/csr_pipeline.py --stage enrich --company bca --force
        """),
    )
    parser.add_argument('--stage', choices=['research', 'draft', 'enrich', 'outreach', 'all'],
                        default='all', help='Pipeline stage to run (default: all)')
    parser.add_argument('--company', default='all',
                        help='Company key from config, or "all" (default: all)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without side effects')
    parser.add_argument('--force', action='store_true',
                        help='Overwrite existing proposal files on draft/enrich')
    parser.add_argument('--verbose', action='store_true',
                        help='Detailed output')

    args = parser.parse_args()

    # Load config
    cfg = load_config()
    companies = get_companies(cfg, args.company)

    print(f"CSR Pipeline — {args.stage} stage")
    if args.dry_run:
        print("  [dry-run mode — no changes made]\n")

    stages = ['research', 'draft', 'enrich', 'outreach'] if args.stage == 'all' else [args.stage]

    for stage in stages:
        if stage == 'research':
            stage_research(cfg, companies, args.dry_run)
        elif stage == 'draft':
            stage_draft(cfg, companies, args.dry_run, args.force)
        elif stage == 'enrich':
            stage_enrich(cfg, companies, args.dry_run, args.force)
        elif stage == 'outreach':
            stage_outreach(cfg, companies, args.dry_run)

    print("Pipeline complete.\n")


if __name__ == '__main__':
    main()
