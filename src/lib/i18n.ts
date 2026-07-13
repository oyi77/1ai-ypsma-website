const id: Record<string, string> = {
  'site.title': 'YPSM Jombang — Yayasan Pendidikan & Sosial Ma\'arif',
  'site.desc': 'Yayasan Pendidikan dan Sosial Ma\'arif (YPSM) Jombang — mengelola RA Perwanida, MI Miftahul Ulum, SMP Plus Ma\'arif, dan PPTQ. Berdiri sejak 1968, mencetak 3.000+ alumni berprestasi.',

  'nav.home': 'Beranda',
  'nav.beranda': 'Beranda',
  'nav.programs': 'Program',
  'nav.program': 'Program',
  'nav.about': 'Tentang',
  'nav.tentang-kami': 'Tentang Kami',
  'nav.contact': 'Kontak',
  'nav.kontak': 'Kontak',
  'nav.transparansi': 'Transparansi',
  'nav.cerita-dampak': 'Cerita Dampak',
  'nav.donate': 'Donasi Sekarang',
  'hero.title': 'Mencetak Generasi Qur\'ani yang Unggul & Berkarakter',
  'hero.subtitle': 'Yayasan Pendidikan & Sosial Ma\'arif (YPSM) — pendidikan Islam berkualitas, peduli sosial, dan pemberdayaan umat sejak 1968.',
  'hero.cta': 'Donasi Sekarang',
  'hero.learn': 'Pelajari Lebih Lanjut',

  'programs.title': 'Program Donasi',
  'programs.subtitle': 'Pilih program donasi yang sesuai dengan keinginan Anda untuk memberikan dampak terbaik bagi masyarakat.',

  'cta.santunan.title': 'Santunan Ikhlasku',
  'cta.santunan.desc': 'Donasi dengan nominal berapapun. Setiap rupiah Anda berarti bagi pendidikan dan kesejahteraan santri.',
  'cta.santunan.cta': 'Santun Sekarang',
  'cta.ota.title': 'Adopsi Orang Tua Asuh',
  'cta.ota.desc': 'Jadi orang tua asuh — Rp300.000/bln untuk biaya pendidikan, makan, dan perlengkapan santri kurang mampu.',
  'cta.ota.cta': 'Jadi Orang Tua Asuh',
  'cta.wakaf.title': 'Wakaf Abadi Koperasi',
  'cta.wakaf.desc': 'Wakaf produktif untuk koperasi yayasan. Hasilnya mendanai operasional pendidikan secara berkelanjutan.',
  'cta.wakaf.cta': 'Wakaf Sekarang',
  'cta.title': 'Mulai Donasi & Jadi Bagian dari Perubahan',
  'cta.subtitle': 'Setiap rupiah yang Anda donasikan akan menjadi cahaya bagi masa depan mereka',


  'calc.title': 'Hitung Zakat & Sedekah',
  'calc.subtitle': 'Kalkulator sederhana untuk menghitung zakat mal',

  'footer.tagline': 'Mencetak generasi Qur\'ani yang unggul, berkarakter, dan bermanfaat bagi masyarakat. Berdiri sejak 1968.',
  'footer.address': 'Ds. Gondek, Mojowarno, Jombang, Jawa Timur 61475',
  'footer.quicklinks': 'Tautan Cepat',
  'footer.follow': 'Ikuti Kami',
  'footer.copyright': 'Hak Cipta © {year} YPSM Jombang. Seluruh hak dilindungi.',
  'footer.made-with': 'Dibuat dengan',

  'donate.title': 'Donasi Sekarang',
};

const en: Record<string, string> = {
  'site.title': 'YPSM Jombang — Islamic Education & Social Foundation',
  'site.desc': 'Yayasan Pendidikan dan Sosial Ma\'arif (YPSM) Jombang — managing RA Perwanida, MI Miftahul Ulum, SMP Plus Ma\'arif, and PPTQ. Established since 1968, producing 3,000+ accomplished alumni.',

  'nav.home': 'Home',
  'nav.programs': 'Programs',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.donate': 'Donate Now',
  'nav.beranda': 'Home',
  'nav.program': 'Programs',
  'nav.tentang-kami': 'About Us',
  'nav.kontak': 'Contact',
  'nav.transparansi': 'Transparency',
  'nav.cerita-dampak': 'Impact Stories',

  'hero.title': 'Raising a Qur\'anic Generation of Excellence & Character',
  'hero.subtitle': 'Islamic Education & Social Foundation (YPSM) — quality Islamic education, social care, and community empowerment since 1968.',
  'hero.cta': 'Donate Now',
  'hero.learn': 'Learn More',

  'programs.title': 'Donation Programs',
  'programs.subtitle': 'Choose a donation program that suits your desire to make the greatest impact for the community.',

  'cta.santunan.title': 'Sincerity Donation',
  'cta.santunan.desc': 'Donate any amount. Every rupiah counts for the education and welfare of our students.',
  'cta.santunan.cta': 'Donate Now',
  'cta.ota.title': 'Adopt a Foster Parent',
  'cta.ota.desc': 'Become a foster parent — Rp300,000/month for education, meals, and supplies for underprivileged students.',
  'cta.title': 'Start Donating & Be Part of the Change',
  'cta.subtitle': 'Every rupiah you donate will be a light for their future',

  'cta.ota.cta': 'Become a Foster Parent',
  'cta.wakaf.title': 'Cooperative Waqf',
  'cta.wakaf.desc': 'Productive endowment for the foundation\'s cooperative. Proceeds fund educational operations sustainably.',
  'cta.wakaf.cta': 'Endow Now',

  'calc.title': 'Zakat & Charity Calculator',
  'calc.subtitle': 'A simple calculator to compute your zakat mal',

  'footer.tagline': 'Raising a Qur\'anic generation of excellence, character, and benefit to society. Established since 1968.',
  'footer.address': 'Ds. Gondek, Mojowarno, Jombang, East Java 61475',
  'footer.quicklinks': 'Quick Links',
  'footer.follow': 'Follow Us',
  'footer.copyright': 'Copyright © {year} YPSM Jombang. All rights reserved.',
  'footer.made-with': 'Made with',

  'donate.title': 'Donate Now',
};

export type Lang = 'id' | 'en';
export const LANG_COOKIE = 'ypsma-lang';

export function t(key: string, lang: Lang): string {
  const dict = lang === 'en' ? en : id;
  return dict[key] ?? id[key] ?? key;
}

export function getInitialLang(): Lang {
  if (typeof document === 'undefined') return 'id';
  const m = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]*)`));
  if (m && (m[1] === 'en' || m[1] === 'id')) return m[1];
  return 'id';
}

export function setLangCookie(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000;SameSite=Lax`;
}
