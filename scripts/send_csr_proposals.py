#!/usr/bin/env python3
"""
CSR Proposal Email Sender — YPSMA
Sends 12 personalized CSR proposals to target companies via Gmail SMTP.

Usage:
    python3 scripts/send_csr_proposals.py [--dry-run]

Config via env vars (or defaults):
    SMTP_USER=grahainsanmandiri@gmail.com
    SMTP_PASS=<app-password>
    FROM_ADDR=admin@ypsma.org
"""

import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', 'grahainsanmandiri@gmail.com')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
FROM_ADDR = os.environ.get('FROM_ADDR', 'admin@ypsma.org')
FROM_NAME = os.environ.get('FROM_NAME', "YPSMA - Yayasan Pendidikan dan Sosial Ma'arif")

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (company_name, email, proposal_relpath)
TARGETS = [
    ('Bank Jatim',                'bankjatim@bankjatim.co.id',      'proposals/csr_bankjatim.md'),
    ('Bank Syariah Indonesia',    'cs@bsimashlahat.or.id',          'proposals/csr_bsi.md'),
    ('Pertamina',                 'corpcs@pertamina.com',           'proposals/csr_pertamina.md'),
    ('PLN',                       'plnpeduli@pln.co.id',            'proposals/csr_pln.md'),
    ('Telkom Indonesia',          'sustainability@telkom.co.id',   'proposals/csr_telkom.md'),
    ('Bank Central Asia (BCA)',   'halobca@bca.co.id',            'proposals/csr_bca.md'),
    ('Bank Mandiri',              'customer.care@bankmandiri.co.id', 'proposals/csr_mandiri.md'),
    ('Bank Rakyat Indonesia (BRI)', 'bri@bri.co.id',              'proposals/csr_bri.md'),
    ('Bank Negara Indonesia (BNI)', 'bni@bni.co.id',              'proposals/csr_bni.md'),
    ('PT Kereta Api Indonesia',   'csr@kai.id',                   'proposals/csr_kai.md'),
    ('Astra International',       'info@astra.co.id',             'proposals/csr_astra.md'),
    ('PT Semen Indonesia (SIG)',  'csr@sig.id',                     'proposals/csr_sig.md'),
]

GREETINGS = {
    'Bank Jatim': 'Sebagai Bank Pembangunan Daerah Jawa Timur, kami percaya Bank Jatim memiliki komitmen kuat dalam memajukan pendidikan di Jawa Timur melalui program CSR.',
    'Bank Syariah Indonesia': 'Sebagai bank syariah terbesar di Indonesia, kami percaya BSI memiliki perhatian besar pada pendidikan dan pemberdayaan umat melalui program CSR dan ZISWAF.',
    'Pertamina': 'Sebagai perusahaan energi nasional, kami percaya Pertamina memiliki komitmen kuat terhadap pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'PLN': 'Sebagai perusahaan listrik negara, kami percaya PLN memiliki perhatian pada pendidikan dan pengembangan sumber daya manusia melalui program CSR.',
    'PT Semen Indonesia (SIG)': 'Sebagai perusahaan semen terkemuka di Indonesia, kami percaya SIG memiliki komitmen terhadap pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'Telkom Indonesia': 'Sebagai perusahaan telekomunikasi nasional, kami percaya Telkom memiliki komitmen kuat dalam mendorong transformasi digital pendidikan melalui program CSR dan TJSL.',
    'Bank Central Asia (BCA)': 'Sebagai bank swasta terbesar di Indonesia, kami percaya Bakti BCA memiliki perhatian besar pada peningkatan kualitas pendidikan melalui program perpustakaan pintar dan renovasi sekolah.',
    'Bank Mandiri': 'Sebagai bank BUMN terkemuka, kami percaya Mandiri Peduli memiliki komitmen kuat pada pendidikan melalui program beasiswa dan pengembangan literasi.',
    'Bank Rakyat Indonesia (BRI)': 'Sebagai bank rakyat Indonesia, kami percaya BRI Peduli dan YBM BRILiaN memiliki perhatian besar pada pendidikan, khususnya bagi masyarakat kurang mampu.',
    'Bank Negara Indonesia (BNI)': 'Sebagai bank BUMN yang telah lama berkontribusi pada pendidikan nasional, kami percaya BNI Peduli memiliki komitmen terhadap peningkatan akses pendidikan berkualitas.',
    'PT Kereta Api Indonesia': 'Sebagai perusahaan transportasi nasional yang melayani jutaan penumpang, kami percaya KAI memiliki perhatian pada pendidikan masyarakat di wilayah operasionalnya melalui program TJSL.',
    'Astra International': 'Sebagai perusahaan swasta nasional terkemuka, kami percaya Astra memiliki kepedulian tinggi pada pengembangan sumber daya manusia melalui program pendidikan dan kewirausahaan.',
}

def build_email(comp_name, proposal_path, to_email, dry_run=False):
    with open(os.path.join(BASE, proposal_path)) as f:
        proposal_text = f.read()

    title = proposal_text.split('\n')[0].replace('# PROPOSAL CSR — ', '').strip()
    greeting = GREETINGS.get(comp_name, '')

    # Convert proposal markdown to basic HTML
    html_body = ''
    for line in proposal_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        if line.startswith('## '):
            html_body += f'<h3 style="color:#1a5276;margin-top:20px">{line[3:]}</h3>\n'
        elif line.startswith('### '):
            html_body += f'<h4 style="color:#2c3e50">{line[4:]}</h4>\n'
        elif line.startswith('- '):
            html_body += f'<li>{line[2:]}</li>\n'
        elif line.startswith('|') and '---' not in line:
            continue
        elif line.startswith('**') and line.endswith('**'):
            html_body += f'<p><strong>{line.strip("*")}</strong></p>\n'
        elif line:
            html_body += f'<p>{line}</p>\n'

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
<p style="font-size:14px">Proposal lengkap, RAB, dan dokumentasi pendukung tersedia dan dapat kami kirimkan sesuai permintaan. Kami sangat berharap <strong>{comp_name}</strong> dapat menjadi mitra strategis YPSMA dalam mewujudkan pendidikan berkualitas bagi generasi penerus bangsa.</p>
<hr style="border:none;border-top:1px solid #eee;margin:20px 0">
<h3 style="color:#1a5276;font-size:15px;margin-top:0">Cara Mendukung YPSMA</h3>
<p style="font-size:13px;color:#555">Selain melalui program CSR, YPSMA menerima dukungan langsung dari masyarakat melalui:</p>
<table style="font-size:13px;color:#555;margin-left:15px"><tr><td style="padding:2px 8px">1.</td><td><b>Donasi Online</b>: <a href="https://sociabuzz.com/ypsma/tribe" style="color:#1a5276">sociabuzz.com/ypsma/tribe</a> (GoPay, DANA, OVO, ShopeePay, transfer bank)</td></tr>
<tr><td style="padding:2px 8px">2.</td><td><b>Transfer Bank</b>: BRI 0585-01-000742-56-3 a.n. Yayasan Pendidikan Dan Sosial Maarif</td></tr>
<tr><td style="padding:2px 8px">3.</td><td><b>QRIS</b>: <a href="https://ypsma.org" style="color:#1a5276">ypsma.org</a></td></tr>
<tr><td style="padding:2px 8px">4.</td><td><b>WhatsApp Donasi</b>: 0321-493147</td></tr></table>
<p style="font-size:13px;color:#555;margin-top:8px">Setiap bentuk dukungan — baik melalui CSR perusahaan maupun donasi langsung — sangat berarti bagi masa depan 574 siswa/santri kami.</p>
<p>Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>
<p>Wassalamu'alaikum warahmatullahi wabarakatuh,</p>
<p style="margin-top:20px"><strong>H. Syamsun Huda Amir</strong><br>Ketua YPSMA<br>
<small style="color:#888">admin@ypsma.org | 0321 - 493147 | <a href="https://ypsma.org" style="color:#1a5276">ypsma.org</a></small>
</p>
</td></tr>
<tr><td style="background:#f9f9f9;padding:15px;text-align:center;border-top:1px solid #eee;font-size:11px;color:#999">
YPSMA — Jl Diponegoro RT 001 RW 006, Dsn Ngelo, Ds. Gondek, Mojowarno, Jombang<br>
AHU-0026672.AH.01.04.Tahun 2020
</td></tr>
</table></td></tr></table></body></html>"""

    text = f"""Kepada Yth. Tim CSR {comp_name}

Assalamu'alaikum warahmatullahi wabarakatuh,

{greeting}

Kami dari Yayasan Pendidikan dan Sosial Ma'arif (YPSMA) mengajukan proposal kemitraan program CSR.

{proposal_text}

--
Cara Mendukung YPSMA:

Selain melalui program CSR, YPSMA menerima dukungan langsung dari:

1. Donasi Online: sociabuzz.com/ypsma/tribe (GoPay, DANA, OVO, ShopeePay, transfer bank)
2. Transfer Bank: BRI 0585-01-000742-56-3 a.n. Yayasan Pendidikan Dan Sosial Maarif
3. QRIS: ypsma.org
4. WhatsApp Donasi: 0321-493147

--
H. Syamsun Huda Amir | Ketua YPSMA
admin@ypsma.org | 0321 - 493147 | https://ypsma.org
AHU-0026672.AH.01.04.Tahun 2020"""

    msg = MIMEMultipart('alternative')
    msg['From'] = f'"{FROM_NAME}" <{FROM_ADDR}>'
    msg['To'] = to_email
    msg['Subject'] = f'Proposal CSR {title} — YPSMA'
    msg.attach(MIMEText(text, 'plain'))
    msg.attach(MIMEText(html, 'html'))
    return msg

def main():
    dry_run = '--dry-run' in sys.argv

    if dry_run:
        print('=== DRY RUN ===')
        for comp_name, to_email, prop_file in TARGETS:
            build_email(comp_name, prop_file, to_email)
            print(f'Would send: {comp_name} → {to_email}')
        print()
        print(f'SMTP: {SMTP_HOST}:{SMTP_PORT} as {SMTP_USER}')
        return 0

    if not os.environ.get('SMTP_PASS', ''):
        print('ERROR: SMTP_PASS not set. Set env or edit script.')
        return 1
    smtp_pass = os.environ['SMTP_PASS']

    s = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    s.starttls()
    s.login(SMTP_USER, smtp_pass)

    ok = fail = 0
    for comp_name, to_email, prop_file in TARGETS:
        msg = build_email(comp_name, prop_file, to_email)
        try:
            s.sendmail(FROM_ADDR, [to_email], msg.as_string())
            print(f'✓ {comp_name:30s} → {to_email}')
            ok += 1
        except Exception as e:
            print(f'✗ {comp_name:30s} → {e}')
            fail += 1
    s.quit()

    print(f'\nDone: {ok} sent, {fail} failed')
    return 0 if fail == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
