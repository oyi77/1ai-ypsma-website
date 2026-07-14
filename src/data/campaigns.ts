export interface CampaignBudgetItem {
  label: string;
  amount: string;
}

export interface Campaign {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  heroImage: string;
  badge: string;
  stats: { value: string; label: string }[];
  stories: { icon: string; title: string; body: string }[];
  budgetLabel: string;
  budgetItems: CampaignBudgetItem[];
  budgetTotal: string;
  galleryImages: string[];
  tiers: { amount: number; label: string; impact: string; featured?: boolean }[];
  faqs: { question: string; answer: string }[];
  accent: string; // Tailwind-style hue name
}

export const CAMPAIGNS: Campaign[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. SEDEKAH PANGAN SANTRI — ⭐⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sedekah-pangan-santri',
    title: 'Sedekah Pangan Santri',
    subtitle: 'Penuhi Gizi 250 Santri Penghafal Al-Qur\'an',
    description: 'Bantu penuhi kebutuhan makan 3x sehari untuk 250 santri penghafal Al-Qur\'an di PPTQ Darussalam Jombang. Rp 58,8 juta/target bulanan untuk gizi santri dhuafa.',
    ogTitle: 'Sedekah Pangan Santri — Penuhi Gizi 250 Santri Penghafal Al-Qur\'an',
    ogDescription: 'Bantu penuhi kebutuhan makan 3x sehari untuk 250 santri penghafal Al-Qur\'an di PPTQ Darussalam Jombang.',
    heroImage: '/images/drive-new/makan/bagi-makan-1.webp',
    badge: 'Program Pangan Santri — Rutin Bulanan',
    stats: [
      { value: '250', label: 'Santri Mukim' },
      { value: 'Rp 58,8jt', label: 'Target Bulanan' },
      { value: '3x Sehari', label: 'Makan Bergizi' },
    ],
    stories: [
      {
        icon: '🍚',
        title: 'Lapar Bukan Alasan untuk Berhenti Hafal',
        body: 'Sejak subuh hingga malam, 250 santri PPTQ Darussalam menghafal Al-Qur\'an. Tanpa asupan gizi yang cukup, konsentrasi mereka buyar. Setiap Rp 50.000 donasi Anda hari ini mengubah perut kosong 2 santri menjadi kenyang.',
      },
      {
        icon: '📊',
        title: 'Transparansi Penuh',
        body: 'Seluruh donasi tercatat dan dilaporkan. Mulai dari pembelian beras, lauk-pauk, sayur, hingga gas dapur — semuanya teraudit dan bisa Anda akses kapan saja.',
      },
      {
        icon: '🤲',
        title: 'Pahala Berkelanjutan',
        body: 'Setiap suapan yang sampai ke santri adalah amal jariyah yang terus mengalir. Satu porsi makanan yang Anda sedekahkan hari ini akan menjadi energi bagi mereka dalam menghafal ayat-ayat Allah.',
      },
    ],
    budgetLabel: 'Rincian Biaya Pangan Bulanan (250 Santri)',
    budgetItems: [
      { label: 'Beras 2.500 kg (karung 25kg × 100)', amount: 'Rp 17.500.000' },
      { label: 'Lauk-pauk (ayam, ikan, telur, tempe,tahu)', amount: 'Rp 15.000.000' },
      { label: 'Sayur & buah segar', amount: 'Rp 7.000.000' },
      { label: 'Bumbu dapur, minyak, gas elpiji', amount: 'Rp 5.500.000' },
      { label: 'Susu & vitamin santri', amount: 'Rp 5.000.000' },
    ],
    budgetTotal: 'Rp 50.000.000',
    galleryImages: [
      '/images/drive-new/makan/bagi-makan-1.webp',
      '/images/drive-new/makan/bagi-makan-2.webp',
      '/images/drive-new/makan/bagi-makan-3.webp',
      '/images/drive-new/makan/bagi-makan-4.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000', impact: 'Makan 1 santri 3 hari' },
      { amount: 100000, label: 'Rp 100.000', impact: 'Makan 2 santri 3 hari' },
      { amount: 250000, label: 'Rp 250.000', impact: 'Makan 5 santri 3 hari', featured: true },
      { amount: 500000, label: 'Rp 500.000', impact: 'Makan 10 santri 3 hari' },
    ],
    faqs: [
      { question: 'Apakah donasi saya tersalurkan 100%?', answer: 'Ya, kami transparan. Setiap donasi tercatat dan dilaporkan penggunaannya. Biaya operasional yayasan dipisahkan dan sudah termasuk dalam target donasi (maks 15%).' },
      { question: 'Bisa donasi rutin setiap bulan?', answer: 'Bisa! Anda bisa menjadi donatur tetap dengan nominal berapa pun. Kami kirimkan laporan dampak setiap bulan.' },
      { question: 'Bagaimana cara konfirmasi transfer?', answer: 'Kirim bukti transfer ke WhatsApp 0822-3455-1160. Kami akan konfirmasi dan doakan.' },
    ],
    accent: 'emerald',
  },

  // ═══════════════════════════════════════════════════════════
  // 2. SEDEKAH AL-QUR'AN — ⭐⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sedekah-al-quran',
    title: 'Sedekah Al-Qur\'an',
    subtitle: '600 Mushaf untuk 600 Penghafal Al-Qur\'an',
    description: 'Harga kertas melonjak imbas kurs Dolar. Bantu sedekahkan 1 mushaf Al-Qur\'an hafalan untuk santri dan siswa YPSMA. Rp 100.000/mushaf.',
    ogTitle: 'Sedekah Al-Qur\'an YPSMA — 600 Mushaf untuk Penghafal Al-Qur\'an',
    ogDescription: 'Harga kertas naik imbas Dolar. Bantu sedekahkan Al-Qur\'an hafalan untuk 600 santri dan siswa YPSMA.',
    heroImage: '/images/drive-new/wisuda/wisuda-1.webp',
    badge: 'Program Sedekah Al-Qur\'an — Satu Kali',
    stats: [
      { value: '600', label: 'Mushaf Dibutuhkan' },
      { value: 'Rp 100rb', label: 'Per Mushaf' },
      { value: 'Rp 70,6jt', label: 'Total Target' },
    ],
    stories: [
      {
        icon: '📖',
        title: 'Al-Qur\'an yang Usang',
        body: 'Banyak santri menghafal dari mushaf yang sudah robek dan buram karena penggunaan bertahun-tahun. Satu mushaf dipakai bergantian 3-4 santri. Kertas tipis dan mudah sobek.',
      },
      {
        icon: '📈',
        title: 'Harga Melonjak Drastis',
        body: 'Kenaikan harga pulp impor membuat harga Al-Qur\'an naik hingga 40%. Dari yang biasa Rp 70.000, kini Rp 100.000 per mushaf. Namun kebutuhan tidak bisa ditunda.',
      },
      {
        icon: '🤲',
        title: 'Pahala Mengalir Setiap Ayat',
        body: 'Setiap ayat yang dibaca dari mushaf hasil donasi Anda, pahalanya terus mengalir meski Anda sudah tiada. Sedekah jariyah yang tak pernah putus.',
      },
    ],
    budgetLabel: 'Rincian Pengadaan Al-Qur\'an',
    budgetItems: [
      { label: 'Pembelian 600 mushaf Al-Qur\'an hafalan × Rp 100.000', amount: 'Rp 60.000.000' },
      { label: 'Biaya operasional & distribusi (15%)', amount: 'Rp 10.588.235' },
    ],
    budgetTotal: 'Rp 70.588.235',
    galleryImages: [
      '/images/drive-new/wisuda/wisuda-1.webp',
      '/images/drive-new/wisuda/wisuda-2.webp',
      '/images/drive-new/wisuda/wisuda-3.webp',
      '/images/drive-new/wisuda/wisuda-4.webp',
    ],
    tiers: [
      { amount: 50000, label: '½ Mushaf', impact: '½ Al-Qur\'an untuk 1 santri' },
      { amount: 100000, label: '1 Mushaf', impact: '1 Al-Qur\'an untuk 1 santri', featured: true },
      { amount: 250000, label: '2,5 Mushaf', impact: '2-3 Al-Qur\'an' },
      { amount: 500000, label: '5 Mushaf', impact: '5 Al-Qur\'an — untuk 1 kamar' },
    ],
    faqs: [
      { question: 'Al-Qur\'an jenis apa yang dibeli?', answer: 'Al-Qur\'an hafalan ukuran A5 dengan kertas kualitas terbaik, warna blok tajwid, dan terjemahan. Cocok untuk santri yang sedang menghafal.' },
      { question: 'Apada Al-Qur\'an dikirim ke santri langsung?', answer: 'Ya, setiap mushaf didistribusikan langsung ke santri/siswa YPSMA. Kami juga akan memberi stiker doa dari donatur.' },
      { question: 'Bisa titip nama di mushaf?', answer: 'Bisa! Untuk donasi 1 mushaf atau lebih, kami tempel nama/hafalan doa dari donatur di sampul mushaf.' },
    ],
    accent: 'amber',
  },

  // ═══════════════════════════════════════════════════════════
  // 3. ORANG TUA ASUH SANTRI — ⭐⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'orang-tua-asuh',
    title: 'Orang Tua Asuh Santri',
    subtitle: 'Jadi Orang Tua Asuh untuk 1 Santri Dhuafa',
    description: 'Rp 10jt/anak/tahun untuk 1 santri dhuafa. Jadi Orang Tua Asuh dan ubah masa depan mereka — SPP, asrama, makan, kitab, kesehatan.',
    ogTitle: 'Orang Tua Asuh Santri YPSMA — Ubah Masa Depan Santri Dhuafa',
    ogDescription: 'Jadi orang tua asuh untuk santri dhuafa. Rp 10jt/anak/tahun mencakup SPP, asrama, makan, kitab, dan kesehatan.',
    heroImage: '/images/campaigns/Berdoa.webp',
    badge: 'Program Orang Tua Asuh — Tahunan',
    stats: [
      { value: '237', label: 'Santri Aktif' },
      { value: 'Rp 10jt', label: 'Per Anak/Tahun' },
      { value: '100%', label: 'Laporan Transparan' },
    ],
    stories: [
      {
        icon: '🎓',
        title: 'Mereka Hanya Butuh Kesempatan',
        body: 'Mereka datang dari keluarga dhuafa — buruh tani, pemulung, penjual jamu — dengan mimpi yang sama besarnya dengan anak siapa pun. Tanpa uluran tangan kita, banyak yang harus putus sekolah.',
      },
      {
        icon: '🤝',
        title: 'Apa itu "Orang Tua Asuh"?',
        body: 'Anda berkomitmen membiayai kebutuhan pendidikan satu santri dhuafa selama satu tahun penuh. Bukan hanya SPP, tetapi juga asrama, 3x makan sehari, kitab/buku, dan jaminan kesehatan.',
      },
      {
        icon: '📈',
        title: 'Dampak yang Bisa Anda Pantau',
        body: 'Setiap 3 bulan Anda mendapat laporan rapor, foto, dan surat dari santri asuh. Anda bisa melihat langsung bagaimana donasi Anda mengubah masa depan mereka.',
      },
    ],
    budgetLabel: 'Rincian Biaya Seorang Santri per Tahun',
    budgetItems: [
      { label: 'SPP & Pendidikan', amount: 'Rp 3.000.000' },
      { label: 'Biaya Asrama', amount: 'Rp 2.400.000' },
      { label: 'Makan 3x Sehari', amount: 'Rp 2.500.000' },
      { label: 'Kitab, Buku & Alat Tulis', amount: 'Rp 800.000' },
      { label: 'Kesehatan Dasar', amount: 'Rp 600.000' },
      { label: 'Kegiatan Ekstrakurikuler', amount: 'Rp 700.000' },
    ],
    budgetTotal: 'Rp 10.000.000',
    galleryImages: [
      '/images/campaigns/Berdoa.webp',
      '/images/campaigns/IMG_1829.webp',
      '/images/campaigns/IMG_1834.webp',
      '/images/campaigns/IMG_1883.webp',
      '/images/campaigns/IMG_1885.webp',
      '/images/IMG_7540.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000/bln', impact: '1/17 biaya santri per bulan' },
      { amount: 100000, label: 'Rp 100.000/bln', impact: '1/8 biaya santri per bulan' },
      { amount: 250000, label: 'Rp 250.000/bln', impact: '1/3 biaya santri per bulan', featured: true },
      { amount: 833000, label: 'Rp 833.000/bln', impact: '💎 1 FULL santri asuh!' },
    ],
    faqs: [
      { question: 'Apa bedanya dengan donasi biasa?', answer: 'Donasi biasa bersifat umum. Orang Tua Asuh adalah komitmen spesifik untuk 1 santri — Anda mendapat laporan perkembangan santri tersebut secara berkala.' },
      { question: 'Bisa pilih santri tertentu?', answer: 'Bisa. Kami akan kirimkan profil beberapa santri yang membutuhkan orang tua asuh. Anda bisa memilih.' },
      { question: 'Komitmen minimal berapa lama?', answer: 'Komitmen ideal 1 tahun ajaran. Namun jika berhalangan, donasi bisa dialihkan ke program lain.' },
    ],
    accent: 'blue',
  },

  // ═══════════════════════════════════════════════════════════
  // 4. PATUNGAN LISTRIK — ⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'patungan-listrik',
    title: 'Patungan Listrik',
    subtitle: 'Terangi 600 Santri & Siswi dalam Belajar',
    description: 'Bantu biaya listrik operasional yayasan untuk 600 santri, siswa, dan aktivitas belajar mengajar. Rp 5,9 juta/target bulanan.',
    ogTitle: 'Patungan Listrik YPSMA — Terangi 600 Santri Belajar',
    ogDescription: 'Bantu biaya listrik operasional yayasan untuk 600 santri dan siswa.',
    heroImage: '/images/campaigns/IMG_1860.webp',
    badge: 'Program Listrik — Rutin Bulanan',
    stats: [
      { value: '600+', label: 'Santri & Siswa' },
      { value: 'Rp 5,9jt', label: 'Target Bulanan' },
      { value: '24 Jam', label: 'Listrik Nyala' },
    ],
    stories: [
      {
        icon: '💡',
        title: 'Belajar di Bawah Lampu Temaram',
        body: 'Kelas dan asrama membutuhkan listrik 24 jam — untuk belajar malam, penerangan asrama, pompa air, dan komputer administrasi. Ketika listrik padam, aktivitas belajar terhenti.',
      },
      {
        icon: '📊',
        title: 'Rincian Pemakaian Listrik',
        body: 'Listrik kelas & kantor (siang), asrama & pondok (malam), pompa air, dan dapur. Total pemakaian mencapai Rp 5 juta per bulan. Dana ini belum termasuk perawatan instalasi.',
      },
      {
        icon: '🤲',
        title: 'Donasi Kecil, Dampak Besar',
        body: 'Rp 50.000 Anda sudah bisa menerangi asrama selama 2 malam. Cukup Rp 10.000/hari, Anda jadi donatur tetap listrik yayasan.',
      },
    ],
    budgetLabel: 'Rincian Kebutuhan Listrik Bulanan',
    budgetItems: [
      { label: 'Listrik kelas & kantor (siang)', amount: 'Rp 1.800.000' },
      { label: 'Listrik asrama & pondok (malam)', amount: 'Rp 1.500.000' },
      { label: 'Listrik pompa air', amount: 'Rp 600.000' },
      { label: 'Listrik dapur & penerangan umum', amount: 'Rp 800.000' },
      { label: 'Biaya operasional (15%)', amount: 'Rp 882.353' },
    ],
    budgetTotal: 'Rp 5.882.353',
    galleryImages: [
      '/images/campaigns/IMG_1860.webp',
      '/images/campaigns/IMG_1829.webp',
    ],
    tiers: [
      { amount: 50000, label: 'Rp 50.000', impact: 'Terangi asrama 2 malam' },
      { amount: 100000, label: 'Rp 100.000', impact: 'Terangi 1 kelas 1 minggu' },
      { amount: 250000, label: 'Rp 250.000', impact: 'Listrik dapur 1 bulan', featured: true },
      { amount: 500000, label: 'Rp 500.000', impact: 'Listrik pompa air 1 bulan' },
    ],
    faqs: [
      { question: 'Apakah listrik benar-benar diperlukan 24 jam?', answer: 'Ya. Asrama santri dihuni 24 jam. Kegiatan hafalan dimulai jam 4 pagi (subuh) hingga malam. Kelas reguler siang hari. Pompa air untuk sumur juga butuh listrik.' },
      { question: 'Kenapa tidak pakai panel surya?', answer: 'Investasi awal panel surya untuk kapasitas 600 orang sangat besar (Rp 200jt+). Saat ini kami fokus pada kebutuhan operasional dasar dulu.' },
    ],
    accent: 'yellow',
  },

  // ═══════════════════════════════════════════════════════════
  // 5. SUMUR AIR BERSIH — ⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sumur-air-bersih',
    title: 'Sumur Air Bersih & MCK',
    subtitle: 'Selamatkan 600 Santri dari Krisis Kamar Mandi',
    description: 'Pembangunan sumur bor dalam dan 8 pintu kamar mandi/WC baru. Saat ini 2 kamar mandi dipakai bergantian oleh 600 orang — darurat!',
    ogTitle: 'Sumur Air Bersih & MCK YPSMA — Akhiri Krisis Kamar Mandi 600 Santri',
    ogDescription: 'Bangun sumur bor dalam dan 8 kamar mandi baru. Saat ini 2 kamar mandi untuk 600 orang — situasi darurat!',
    heroImage: '/images/drive-new/sarpras/11.webp',
    badge: 'Program Infrastruktur — Satu Kali',
    stats: [
      { value: '600', label: 'Santri & Siswa' },
      { value: '2→8', label: 'Kamar Mandi' },
      { value: 'Rp 176jt', label: 'Total Target' },
    ],
    stories: [
      {
        icon: '🚰',
        title: 'Antre Panjang Setiap Pagi',
        body: '2 kamar mandi untuk 600 orang. Bayangkan antrean setiap pagi sebelum subuh dan sekolah. Santri harus bangun jauh lebih awal hanya untuk mandi. Situasi ini sudah berlangsung bertahun-tahun.',
      },
      {
        icon: '💧',
        title: 'Sumur Eksisting Mulai Kering',
        body: 'Sumur lama sudah tidak mencukupi. Debit air menurun drastis di musim kemarau. Kami perlu sumur bor dalam (50-60 meter) dengan pompa besar untuk mencukupi kebutuhan 600 orang.',
      },
      {
        icon: '🛠️',
        title: 'Solusi Permanen',
        body: 'Pembangunan 8 pintu kamar mandi/WC baru tipe komunal, lengkap dengan septic tank bio-filter, toren air 5.000 liter, dan instalasi pipa terintegrasi. Solusi jangka panjang untuk 600 orang.',
      },
    ],
    budgetLabel: 'Rincian Pembangunan Sumur & MCK',
    budgetItems: [
      { label: 'Pengeboran sumur artesis 50-60m', amount: 'Rp 18.000.000' },
      { label: 'Pompa submersible 2HP + panel otomatis', amount: 'Rp 8.500.000' },
      { label: 'Toren 5.000 liter + tower besi', amount: 'Rp 16.500.000' },
      { label: 'Pembangunan gedung MCK 8 pintu (fondasi, bata, keramik, kloset, pintu, atap)', amount: 'Rp 88.000.000' },
      { label: 'Instalasi pipa PVC + septic tank bio-filter', amount: 'Rp 19.000.000' },
    ],
    budgetTotal: 'Rp 176.470.588',
    galleryImages: [
      '/images/drive-new/sarpras/11.webp',
      '/images/drive-new/sarpras/12.webp',
      '/images/drive-new/sarpras/5.webp',
      '/images/drive-new/sarpras/10.webp',
      '/images/drive-new/sarpras/6.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1 meter pipa instalasi' },
      { amount: 100000, label: '100rb', impact: '1/12 kloset + pintu PVC' },
      { amount: 500000, label: '500rb', impact: '1/6 biaya 1 pintu kamar mandi' },
      { amount: 2000000, label: 'Wakaf 1 Pintu MCK', impact: '💎 Bangun 1 kamar mandi penuh', featured: true },
    ],
    faqs: [
      { question: 'Apakah sudah ada survey lokasi?', answer: 'Sudah. Tim teknis sudah survey dan memastikan titik pengeboran. Kontraktor borongan sudah siap eksekusi begitu dana terkumpul 50%.' },
      { question: 'Berapa lama pembangunan?', answer: 'Estimasi 2-3 minggu untuk pengeboran sumur, 3-4 minggu pembangunan gedung MCK. Total maksimal 2 bulan.' },
      { question: 'Bisa wakaf 1 kamar mandi penuh?', answer: 'Bisa! Biaya 1 pintu kamar mandi lengkap ± Rp 12-15jt. Anda bisa wakaf dan nama Anda diabadikan di gedung MCK.' },
    ],
    accent: 'cyan',
  },

  // ═══════════════════════════════════════════════════════════
  // 6. SARANA PRASARANA — ⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sarana-prasarana',
    title: 'Sarana Prasarana',
    subtitle: 'Perbaiki Kelas & Asrama untuk 600 Siswa',
    description: 'Perbaikan atap bocor, meja-kursi rusak, pengecatan, dan kasur asrama. Seluruhnya terdampak kenaikan harga material bangunan.',
    ogTitle: 'Sarana Prasarana YPSMA — Perbaiki Fasilitas 600 Siswa',
    ogDescription: 'Perbaikan atap bocor, meja-kursi, pengecatan, dan kasur asrama yang terdampak kenaikan harga material.',
    heroImage: '/images/drive-new/sarpras/1.webp',
    badge: 'Program Sarpras — Satu Kali',
    stats: [
      { value: '600', label: 'Siswa Terdampak' },
      { value: 'Rp 76,5jt', label: 'Total Target' },
      { value: '4 Item', label: 'Perbaikan' },
    ],
    stories: [
      {
        icon: '🏚️',
        title: 'Belajar di Bawah Atap Bocor',
        body: 'Musim hujan membuat beberapa ruang kelas tidak bisa dipakai karena atap bocor. Plafon gypsum rusak dan rembesan air merusak dinding. Siswa terpaksa belajar di lorong atau asrama.',
      },
      {
        icon: '🪑',
        title: 'Meja-Kursi Rusak',
        body: 'Puluhan meja dan kursi belajar sudah tidak layak pakai — patah, goyang, dan membahayakan. Semakin banyak santri baru, semakin bertambah kebutuhan fasilitas dasar.',
      },
      {
        icon: '🛏️',
        title: 'Kasur Bertingkat Menipis',
        body: 'Kasur busa asrama sudah kempis dan tidak nyaman. Banyak santri tidur di lantai beralas kardus. Kenyamanan istirahat sangat mempengaruhi semangat hafalan mereka.',
      },
    ],
    budgetLabel: 'Rincian Perbaikan Sarpras',
    budgetItems: [
      { label: 'Perbaikan atap bocor & ganti plafon gypsum', amount: 'Rp 15.000.000' },
      { label: 'Pengadaan meja-kursi baru', amount: 'Rp 18.000.000' },
      { label: 'Pengecatan ulang dinding', amount: 'Rp 12.000.000' },
      { label: 'Kasur busa bertingkat + lemari', amount: 'Rp 20.000.000' },
    ],
    budgetTotal: 'Rp 76.470.588',
    galleryImages: [
      '/images/drive-new/sarpras/1.webp',
      '/images/drive-new/sarpras/3.webp',
      '/images/drive-new/sarpras/4.webp',
      '/images/drive-new/sarpras/5.webp',
      '/images/drive-new/sarpras/6.webp',
      '/images/drive-new/sarpras/7.webp',
      '/images/drive-new/sarpras/8.webp',
      '/images/drive-new/sarpras/9.webp',
      '/images/drive-new/sarpras/10.webp',
      '/images/drive-new/sarpras/11.webp',
      '/images/drive-new/sarpras/12.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1 kaleng cat tembok' },
      { amount: 100000, label: '100rb', impact: '1 set meja-kursi ½' },
      { amount: 250000, label: '250rb', impact: '1 kasur busa + sprei', featured: true },
      { amount: 500000, label: '500rb', impact: 'Perbaiki atap 1 ruang kelas' },
    ],
    faqs: [
      { question: 'Prioritas perbaikan apa yang paling mendesak?', answer: 'Prioritas 1: atap bocor 2 ruang kelas (darurat). Prioritas 2: 40 set meja-kursi. Prioritas 3: pengecatan dinding lembab.' },
      { question: 'Bisa bantu dalam bentuk barang?', answer: 'Sangat bisa! Kami terima donasi kasur, meja-kursi bekas layak pakai, atau cat tembok. Hubungi kami untuk koordinasi.' },
    ],
    accent: 'slate',
  },

  // ═══════════════════════════════════════════════════════════
  // 7. PENGELOLAAN SAMPAH & LIMBAH — ⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'pengelolaan-sampah',
    title: 'Pengelolaan Sampah & Limbah',
    subtitle: 'Atasi Volume Sampah 600 Orang per Hari',
    description: 'Sampah dari 600 orang per hari sangat besar. Butuh motor roda 3, bak sampah beton, dan sistem pembuangan teratur.',
    ogTitle: 'Pengelolaan Sampah YPSMA — Atasi Sampah 600 Santri',
    ogDescription: 'Pengadaan motor roda 3, TPS beton, dan sistem pengelolaan sampah untuk 600 santri dan siswa.',
    heroImage: '/images/campaigns/IMG_1860.webp',
    badge: 'Program Lingkungan — Satu Kali',
    stats: [
      { value: '600', label: 'Orang per Hari' },
      { value: 'Rp 53jt', label: 'Total Target' },
      { value: '4 Item', label: 'Kebutuhan' },
    ],
    stories: [
      {
        icon: '🗑️',
        title: 'Sampah Menumpuk Setiap Hari',
        body: 'Dengan 600 orang, volume sampah mencapai puluhan kilogram per hari. Tidak ada armada pengangkut, sampah sering dibakar atau dibuang sembarangan. Berdampak buruk pada kesehatan santri.',
      },
      {
        icon: '🛵',
        title: 'Butuh Armada Pengangkut',
        body: 'Kami membutuhkan motor roda 3 (angkong) yang kuat untuk mengangkut sampah ke TPS desa. Harga unit naik karena suku cadang impor terdampak kenaikan Dolar.',
      },
      {
        icon: '🌱',
        title: 'Lingkungan Sehat untuk Hafalan',
        body: 'Lingkungan yang bersih dan sehat sangat mempengaruhi konsentrasi belajar dan menghafal. Pengelolaan sampah yang baik juga mengajarkan santri tentang kebersihan sebagai bagian dari iman.',
      },
    ],
    budgetLabel: 'Rincian Pengelolaan Sampah',
    budgetItems: [
      { label: 'Motor roda 3 angkong sampah', amount: 'Rp 26.000.000' },
      { label: 'Pembangunan TPS beton', amount: 'Rp 8.000.000' },
      { label: '20 tong sampah besar', amount: 'Rp 6.000.000' },
      { label: 'APD petugas & obat pengurai limbah', amount: 'Rp 5.000.000' },
    ],
    budgetTotal: 'Rp 52.941.176',
    galleryImages: [
      '/images/campaigns/IMG_1860.webp',
      '/images/campaigns/IMG_1829.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1 tong sampah besar ½' },
      { amount: 100000, label: '100rb', impact: 'APD petugas 1 bulan' },
      { amount: 250000, label: '250rb', impact: '1/40 motor roda 3', featured: true },
      { amount: 500000, label: '500rb', impact: '1/4 bak sampah beton' },
    ],
    faqs: [
      { question: 'Sampahnya akan dibawa ke mana?', answer: 'Motor roda 3 akan mengangkut sampah ke TPS Desa yang sudah bekerjasama dengan yayasan. Tidak ada pembakaran sampah lagi.' },
      { question: 'Ada program daur ulang?', answer: 'Rencana ke depan: sampah organik diolah jadi kompos untuk kebun yayasan. Sampah plastik dipilah untuk didaur ulang. Tahap awal fokus pada pengangkutan dan TPS dulu.' },
    ],
    accent: 'lime',
  },

  // ═══════════════════════════════════════════════════════════
  // 8. SEDEKAH ANAK YATIM PIATU — ⭐⭐⭐⭐
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'sedekah-anak-yatim',
    title: 'Sedekah Anak Yatim Piatu',
    subtitle: 'Santunan 58 Anak Yatim — Tunai + Sembako',
    description: 'Santunan rutin untuk 58 anak yatim piatu (10 di yayasan, 48 di sekitar). Per anak Rp 300.000 berupa tunai dan sembako. Harga sembako naik imbas Dolar.',
    ogTitle: 'Sedekah Anak Yatim YPSMA — Santunan 58 Anak Yatim',
    ogDescription: 'Santunan rutin untuk 58 anak yatim piatu. Rp 300.000/anak berupa tunai dan sembako.',
    heroImage: '/images/campaigns/IMG_1860.webp',
    badge: 'Program Anak Yatim — Rutin Bulanan',
    stats: [
      { value: '58', label: 'Anak Yatim' },
      { value: 'Rp 300rb', label: 'Per Anak/Bulan' },
      { value: 'Rp 20,5jt', label: 'Target Bulanan' },
    ],
    stories: [
      {
        icon: '👶',
        title: '58 Anak yang Kehilangan Kasih Sayang',
        body: '10 anak yatim/piatu tinggal di lingkungan yayasan, 48 lainnya tersebar di desa-desa sekitar Mojowarno. Mereka diasuh oleh keluarga yang juga pas-pasan secara ekonomi.',
      },
      {
        icon: '📦',
        title: 'Santunan Tunai + Sembako',
        body: 'Setiap anak mendapat Rp 300.000/bulan berupa uang tunai untuk keperluan sekolah dan paket sembako (beras, minyak, gula, susu, mie). Khusus anak di yayasan, juga mendapat bimbingan belajar.',
      },
      {
        icon: '🤲',
        title: 'Keutamaan Menyantuni Anak Yatim',
        body: 'Rasulullah ﷺ bersabda: "Aku dan orang yang menanggung anak yatim di surga seperti ini" — sambil merapatkan jari telunjuk dan jari tengah. Setiap rupiah Anda adalah investasi surga.',
      },
    ],
    budgetLabel: 'Rincian Santunan Anak Yatim per Bulan',
    budgetItems: [
      { label: '10 anak (yayasan) × Rp 300.000 (tunai + sembako)', amount: 'Rp 3.000.000' },
      { label: '48 anak (luar) × Rp 300.000 (tunai + sembako)', amount: 'Rp 14.400.000' },
      { label: 'Biaya operasional (15%)', amount: 'Rp 3.070.588' },
    ],
    budgetTotal: 'Rp 20.470.588',
    galleryImages: [
      '/images/campaigns/IMG_1860.webp',
      '/images/campaigns/IMG_1829.webp',
    ],
    tiers: [
      { amount: 50000, label: '50rb', impact: '1/6 santunan 1 anak yatim' },
      { amount: 100000, label: '100rb', impact: '1/3 santunan 1 anak yatim' },
      { amount: 300000, label: '300rb', impact: '💎 Santunan 1 anak penuh', featured: true },
      { amount: 500000, label: '500rb', impact: 'Santunan 1 anak + keluarganya' },
    ],
    faqs: [
      { question: 'Anak yatimnya berasal dari mana?', answer: '10 anak berada di lingkungan yayasan PPTQ Darussalam (santri yang yatim/piatu). 48 anak lainnya dari desa-desa sekitar Mojowarno yang sudah terdata oleh yayasan.' },
      { question: 'Apakah santunan rutin setiap bulan?', answer: 'Ya, idealnya rutin setiap bulan. Jika donasi lebih, kami salurkan 2 minggu sekali dengan nominal lebih besar per anak.' },
      { question: 'Bisa jadi donatur tetap anak yatim?', answer: 'Bisa! Anda bisa berkomitmen menyantuni 1 anak yatim secara rutin Rp 300.000/bulan. Kami kirimkan foto dan kabar perkembangan mereka.' },
    ],
    accent: 'rose',
  },
];

// Slug → Campaign lookup
export const CAMPAIGN_BY_SLUG = Object.fromEntries(CAMPAIGNS.map(c => [c.slug, c])) as Record<string, Campaign>;

// Slug list for routing
export const CAMPAIGN_SLUGS = CAMPAIGNS.map(c => c.slug);
