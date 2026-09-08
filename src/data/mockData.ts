import { FlashcardDeck, FlashcardQuestion, ScheduleSession, TaskItem, WeeklyStudyStat, UserProfile } from '../types';

export const ASSET_IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByI8DJsAqJ45hNVl8kF2jUTRV5XnROmQRDPS-jf9xuuhV1JRzB0jI-L3bdtVTw-8HOB745Xp-m53Xj4h5D5KBXJJQ024IWDvodV8WwpZC7WDUjkH05q5-_jqdh9O9tPgrQ2nJ3-pa7pdHq9C1yEzhQX1ED28Iu-r8huSSjMwbQaNFHLh66Nevlzy2-mLwQ1Ls7rltAB3d6YRrVX2dJEVDsx_g8XkjWpDii50PWn-Fp7xToL1kOF4lsGw',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO-RSgsN1b8TOYL7eEbunhqLexHlHFC8nUVzPxTElgNHzGJMcTCTbSWxEk0hDhsZPjHCQn7kskan7pujRwoVccMhRXfV12YshwFoAgYJKLgapL-06VUWXRgz5RVPPVKelp9XWv17pKimQK-wcAkKHLdAnqHYj6nUmTSPR59E31DoCmgEjdV5IJlwcqTZpcBGbaq9sXu3wKDJIlaqAIPRITs1j6UqD-iDlYUlR5ihmVmC9ob4QgtrXMGQ',
  desk1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV5_7R8eNZtX07z61pw5ojyR9w_9Pk4DPYs1dLv6Ww5bWb_3KZ51lWv9M7svqJS4I0zPe1VojwjuNiOKB7gAvh_Nd9dtKfiZH-HUJctPYef3G3KQZ6LRMbwJR8vTQbkiq7WNGRKOslWU5eNSobAmguE16EmiR-Z5lXySsGpcN4je5Gsc_gyGAmrKt3rMDu3247rJJ2RkBAJjpROsygpasa4u96-_jE9_3Fp0cZGTTcNhwiqlLeAW1cLQ',
  desk2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxxTi4ZxwOI4Bi9Gt_3EcbAkfQ4CBkD0hrLl-SilStd6XjP1rQbRSOGD-H2o-cWvEK-RTRGrIMTZPmVvvhtT5DPLjiqgYSwzLtF73SqZw4fjD-Za_xk1FHxcpwfUioiILKQI876wfPSuEnq3d-32nTJlx_CLA45vbXqFnW2-eA9CwUnrcIh8PLLneXqIKxO1JtMapaMrcYf_O-Aun2q1u5Kpj5fyKDxTwKniJ59Fu3jTrIBS7wbsW_pw',
  mentor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCBf4o1XZBdfqvx8-66osGe59SfOsqc8okcxHxOHSqNwb1pH_j01gMD1xg4DtgwIdzhyVZ-i5WlYs49EyjMwb3DxH-rQeMYp-78--c6dnkIm7iUBjK3t5ZzSWRolN-GrgdVKUw120evRqEVjvGlljv-ISIUafdXvmIjOptr6L_o3Eyx_2pLac6xnegugPqU4CyQCvrfbUxOzRZiUiI5av3amu5yTDsQac7EAvkSMZfcTnhdE5XVHurDw',
  deckEnglish: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMobjFTCDIXXr-OVA02zvsuBj-0rwdRZfVyu3Rvn5pxb9B-TlYzRLXGYWuDmTxPvFJ5GwCcz5Ed5Ps0wquapg2Auhyowc_02-HdAv3Wt7omdfXv7b9aa--ghgjsJJE4DK32rVSm6Z25e8AiCk1lZxyFhl8LQ4G8U8euoTSfdMZL7u119k0EY0aximCWeLlMUk-mccZkApqOLoKvO0sCMQW7sSYrQTh2bWq8MAuEFrw_193NipyQDFjw',
  deckPhysics: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBibg0vci4oFfg4AytFlQToe6gU_9cy-lnTP8_wf7Ivb1lEvKBQ0qla9R6QKvbYTLjk_KKTDym9P-KL2g_-3YtclCSqeeDc6KekxMYjg4N77zPH3BNMqIXWuvIEz_H2oM9RUFTlRr4uNWT27UEG0cGCB2oe7QiQspF6PdwCRrUx98pASITomrHhvOKwxW-un_dCHwlMjsB3u6iTWdnYR98jjviCza7TeEQ-ytujBsRJuqPJ_leSpjNR8Q',
  deckLogic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpaG47T1GIkR9S5UjHlOPJJTbWYXDO93ewWllhOORJe4CkOA9EGvNweIizRQ9yi9Pp8BIllNjFFCYC-NgQLTxfpcfQwKwgnXKcCOSteZ30e0C61zHX02ZdfdqYOfxGCC_jUokn9Ebbzjpslnl3k84cm7k9DHneb5k2sSiA2bJTJmGgFsPaf-Qh75GIFhLTrBeKiBGGktJYpy1sYUA_uv1oM_72VmCS_tcz4kLX8-3GXqSfUnIMUsqvcg',
  deckChemistry: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFiIj0HuGpb8nEwt48eQX3HCODIZtkcAALnnNxVq-5E_7r3130io6TgCJ2zdxTxRj6x1-uwuAF69FqqmXxlwaQg0OwNw3weGqGVkQldkaaFjR8eIL0KW2clU1AFNLsmaEb_fq8Z7HnMU_SusjlOjT6aeOqTOOx54yyZAKx9OfNl_9bqFXYtgFxbUHzpNqnd0c9IKF-ZRUIOs6dC6jDi7GlEpGmdssz5v8l6Zfrz-XWJmJqJ8RCphOMgw'
};

export const INITIAL_USER: UserProfile = {
  name: 'Muhammad Hilal Alfaris',
  school: 'SMA Negeri 1 Surabaya',
  targetPTN: 'Teknik Elektro - ITS (Institut Teknologi Sepuluh Nopember)',
  targetMajor: 'Teknik Elektro',
  targetCampus: 'ITS',
  avatar: '/its-logo.svg',
  streakDays: 16,
  daysUntilUTBK: 78,
  readinessPercent: 78,
  lastTOScore: 692,
  currentScore: 692,
  passingGrade: 680,
  targetScore: 730,
  dailyCompletedSessions: 4,
  dailyTargetSessions: 5,
  totalQuestionsSolved: 540,
  solvedYesterday: 35,
  focusHours: 46
};

export const INITIAL_DAILY_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Selesaikan 25 Soal Rangkaian Listrik & Hukum Kirchhoff',
    completed: true,
    xp: 60,
    subtitle: 'Tuntas 25/25 • Akurasi 92% (Persiapan Teknik Elektro)',
    badge: 'Selesai'
  },
  {
    id: 'task-2',
    title: 'Review Flashcard Gelombang & Medan Magnetik',
    completed: false,
    xp: 40,
    subtitle: 'Sedang Berjalan ⏳ 18/25 Kartu Dipelajari',
    badge: 'Berjalan'
  },
  {
    id: 'task-3',
    title: 'Simulasi Try Out Mini Penalaran Matematika UTBK',
    completed: false,
    xp: 80,
    subtitle: 'Estimasi Waktu: 30 Menit • 20 Soal HOTS BPPP',
    badge: 'Terkunci'
  }
];

export const INITIAL_HABITS: TaskItem[] = [
  {
    id: 'habit-1',
    title: 'Ikut Live Class Drill Soal TPS (14:00)',
    completed: true
  },
  {
    id: 'habit-2',
    title: 'Membaca 2 Jurnal Ilmiah / Artikel Literasi Inggris',
    completed: true
  },
  {
    id: 'habit-3',
    title: 'Olahraga & Stretching 15 Menit sebelum Fokus',
    completed: false
  },
  {
    id: 'habit-4',
    title: 'Review 30 Flashcard Spaced Repetition sebelum tidur',
    completed: false
  }
];

export const INITIAL_FOCUS_CHECKLIST: TaskItem[] = [
  {
    id: 'pomo-chk-1',
    title: 'Kuasai Analisis Loop Hukum II Kirchhoff dan Hambatan Pengganti',
    completed: true
  },
  {
    id: 'pomo-chk-2',
    title: 'Kerjakan 10 soal HOTS Gaya Lorentz & Induksi Faraday',
    completed: false
  },
  {
    id: 'pomo-chk-3',
    title: 'Catat trik kilat eliminasi 15 detik limit fungsi trigonometri',
    completed: false
  }
];

export const WEEKLY_FOCUS_STATS: WeeklyStudyStat[] = [
  { day: 'Senin', shortDay: 'Sen', hours: 3.2, heightPx: 65 },
  { day: 'Selasa', shortDay: 'Sel', hours: 4.0, heightPx: 82 },
  { day: 'Rabu', shortDay: 'Rab', hours: 3.5, heightPx: 72 },
  { day: 'Kamis', shortDay: 'Kam', hours: 4.8, heightPx: 96 },
  { day: 'Jumat', shortDay: 'Jum', hours: 2.5, heightPx: 50 },
  { day: 'Sabtu', shortDay: 'Sab', hours: 3.75, heightPx: 78, isToday: true },
  { day: 'Minggu', shortDay: 'Min', hours: 1.2, heightPx: 25 }
];

// 1. KUMPULAN SOAL EYD V (EJAAN YANG DIBAHARUI EDISI V) & PBM
export const QUESTIONS_EYD_V: FlashcardQuestion[] = [
  {
    id: 'eyd-1',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Kosakata Baku KBBI VI',
    level: 'Level Sedang',
    category: 'pbm',
    targetSeconds: 35,
    question: 'Manakah kalimat berikut yang SELURUH kata serapannya menggunakan bentuk BAKU sesuai KBBI VI dan EYD V?',
    hint: 'Perhatikan penulisan kata: "risiko" (bukan resiko), "kualitas" (bukan kwalitas), dan "sistem" (bukan sistim).',
    answer: 'Manajemen harus menghitung risiko investasi demi meningkatkan kualitas sistem operasional perusahaan.',
    steps: [
      {
        title: 'Langkah 1: Identifikasi Kata Baku vs Tidak Baku',
        description: 'Kata "risiko" baku (salah: resiko), "kualitas" baku (salah: kwalitas), "sistem" baku (salah: sistim).'
      },
      {
        title: 'Langkah 2: Evaluasi Kalimat',
        description: 'Seluruh bentuk serapan dalam kalimat tersebut sesuai kaidah tata kata baku bahasa Indonesia.'
      }
    ]
  },
  {
    id: 'eyd-2',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Tanda Koma (,) Pertentangan',
    level: 'Level Sedang',
    category: 'pbm',
    targetSeconds: 30,
    question: 'Sesuai aturan EYD V, manakah penggunaan tanda koma (,) yang BENAR pada kalimat majemuk pertentangan?',
    hint: 'Tanda koma wajib diletakkan SEBELUM kata hubung pertentangan seperti "tetapi", "melainkan", dan "sedangkan".',
    answer: 'Ia bukan seorang dokter, melainkan seorang peneliti di bidang bioteknologi.',
    steps: [
      {
        title: 'Langkah 1: Cek Konjungsi Pertentangan',
        description: 'Kata "melainkan", "tetapi", dan "sedangkan" memisahkan dua klausa yang berlawanan.'
      },
      {
        title: 'Langkah 2: Penempatan Tanda Baca',
        description: 'Tanda koma wajib diletakkan sebelum konjungsi tersebut (..., melainkan ...).'
      }
    ]
  },
  {
    id: 'eyd-3',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Serial Comma (Koma Perincian)',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 40,
    question: 'Berdasarkan kaidah EYD V, bagaimana penulisan tanda koma yang tepat pada perincian lebih dari dua unsur?',
    hint: 'EYD V mewajibkan tanda koma sebelum kata hubung "dan" atau "atau" di akhir rincian (unsur1, unsur2, dan unsur3).',
    answer: 'Peserta ujian wajib membawa kartu ujian, pensil 2B, dan kartu identitas asli.',
    steps: [
      {
        title: 'Langkah 1: Aturan Perincian 3 Unsur atau Lebih',
        description: 'Antara unsur-unsur dalam rincian wajib dipisahkan dengan tanda koma.'
      },
      {
        title: 'Langkah 2: Penegasan Sebelum Konjungsi',
        description: 'Sebelum kata "dan" di akhir perincian wajib ada koma untuk menghindari ketaksaan/ambiguitas.'
      }
    ]
  },
  {
    id: 'eyd-4',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Anak Kalimat & Induk Kalimat',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 45,
    question: 'Kalimat manakah yang TEPAT dalam penggunaan tanda koma berdasarkan letak anak kalimatnya?',
    hint: 'Jika anak kalimat di DEPAN induk kalimat, gunakan koma. Jika induk kalimat di DEPAN anak kalimat, TIDAK menggunakan koma.',
    answer: 'Karena hujan deras mengguyur kota, pertandingan terpaksa ditunda.',
    steps: [
      {
        title: 'Langkah 1: Anak Kalimat Mendahului Induk',
        description: '"Karena hujan deras mengguyur kota" (anak) di depan -> wajib koma sebelum "pertandingan..." (induk).'
      },
      {
        title: 'Langkah 2: Induk Kalimat Mendahului Anak',
        description: 'Sebaliknya: "Pertandingan ditunda karena hujan deras mengguyur kota." (tanpa koma).'
      }
    ]
  },
  {
    id: 'eyd-5',
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'EYD V • Konjungsi Antarkalimat',
    level: 'Level Sedang',
    category: 'literasi-indo',
    targetSeconds: 35,
    question: 'Mengapa kata "Oleh karena itu", "Dengan demikian", dan "Selain itu" wajib diikuti tanda koma di awal kalimat?',
    hint: 'Kata-kata tersebut adalah konjungsi antarkalimat yang menghubungkan gagasan dengan kalimat sebelumnya.',
    answer: 'Karena merupakan ungkapan penghubung antarkalimat yang menandai jeda dan batas modalitas di awal kalimat.',
    steps: [
      {
        title: 'Langkah 1: Ketentuan Konjungsi Antarkalimat',
        description: 'Ungkapan seperti "Oleh karena itu,", "Dengan demikian,", "Selain itu," selalu berada di awal kalimat baru.'
      },
      {
        title: 'Langkah 2: Wajib Tanda Koma',
        description: 'EYD V mewajibkan tanda koma tepat setelah konjungsi antarkalimat tersebut.'
      }
    ]
  },
  {
    id: 'eyd-6',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Penulisan Bentuk Terikat',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 40,
    question: 'Sesuai aturan EYD V, manakah penulisan bentuk terikat (pasca, sub, antar, multi) yang BENAR?',
    hint: 'Bentuk terikat ditulis serangkai dengan kata dasar yang mengikutinya (tanpa spasi), kecuali diikuti kata kapital (-).',
    answer: 'Mahasiswa pascasarjana mengadakan penelitian antarnegara mengenai subsektor industri.',
    steps: [
      {
        title: 'Langkah 1: Penggabungan Bentuk Terikat',
        description: 'pasca + sarjana = pascasarjana; antar + negara = antarnegara; sub + sektor = subsektor.'
      },
      {
        title: 'Langkah 2: Pengecualian Kata Kapital',
        description: 'Jika diikuti kata berhuruf kapital, gunakan tanda hubung (misal: anti-Amerika, non-APBN).'
      }
    ]
  },
  {
    id: 'eyd-7',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Penggunaan Tanda Titik Dua (:)',
    level: 'Level Sedang',
    category: 'pbm',
    targetSeconds: 35,
    question: 'Kapan tanda titik dua (:) BENAR digunakan dalam penguraian perincian sesuai EYD V?',
    hint: 'Tanda titik dua hanya dipakai jika rincian merupakan pelengkap dari pernyataan yang diakhiri kalimat lengkap.',
    answer: 'Fakultas tersebut memiliki tiga jurusan: Teknik Sipil, Teknik Elektro, dan Teknik Mesin.',
    steps: [
      {
        title: 'Langkah 1: Cek Kelengkapan Pengantar',
        description: '"Fakultas tersebut memiliki tiga jurusan" adalah kalimat berpredikat utuh, sehingga boleh pakai titik dua (:).'
      },
      {
        title: 'Langkah 2: Pengecualian Titik Dua',
        description: 'Jika rincian langsung menyambung predikat ("Jurusan fakultas itu adalah Teknik..."), TIDAK boleh pakai titik dua.'
      }
    ]
  },
  {
    id: 'eyd-8',
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'EYD V • Koreksi Ejaan Tidak Baku',
    level: 'Level Sedang',
    category: 'literasi-indo',
    targetSeconds: 35,
    question: 'Manakah di antara opsi berikut yang memuat pasangan kata TIDAK baku berdasarkan KBBI VI?',
    hint: 'Cari bentuk yang sering salah kaprah seperti "praktek", "apotik", "analisa", atau "hierarki".',
    answer: 'Kata "praktek" dan "analisa" (Bentuk baku: "praktik" dan "analisis").',
    steps: [
      {
        title: 'Langkah 1: Cek Kata Serapan Belanda/Inggris',
        description: 'Practice -> praktik (bukan praktek); Analysis -> analisis (bukan analisa).'
      },
      {
        title: 'Langkah 2: Cek Perubahan Akhiran',
        description: 'Akhiran -is (bukan -esa/-isa) pada kata analisis, sintesis, hipotesis.'
      }
    ]
  },
  {
    id: 'eyd-9',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Tanda Titik Koma (;)',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 40,
    question: 'Dalam kondisi apakah tanda titik koma (;) digunakan dalam kalimat menurut aturan EYD V?',
    hint: 'Titik koma dapat memisahkan klausa setara tanpa kata hubung atau memisahkan rincian berfrasa yang sudah mengandung koma.',
    answer: 'Menggantikan kata hubung untuk memisahkan kalimat setara, serta memisahkan perincian majemuk.',
    steps: [
      {
        title: 'Langkah 1: Pengganti Konjungsi Setara',
        description: 'Contoh: "Hari sudah malam; anak-anak masih membaca buku."'
      },
      {
        title: 'Langkah 2: Perincian Kompleks',
        description: 'Memisahkan kelompok barang yang masing-masing sudah dipisahkan tanda koma.'
      }
    ]
  },
  {
    id: 'eyd-10',
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'EYD V • Kata Depan di/ke vs Awalan di-/ke-',
    level: 'Level Sedang',
    category: 'literasi-indo',
    targetSeconds: 30,
    question: 'Manakah penulisan kata depan "di" dan "ke" yang 100% TEPAT sesuai kaidah EYD V?',
    hint: 'Kata depan (di/ke) dipisah jika menunjukkan tempat/arah. Awalan (di-/ke-) disambung jika membentuk kata kerja pasif.',
    answer: 'Surat dokumen tersebut sudah dikirimkan ke kantor cabang yang berlokasi di Surabaya.',
    steps: [
      {
        title: 'Langkah 1: Identifikasi Awalan Pasif',
        description: '"dikirimkan" = awalan di- + kata kerja -> ditulis serangkai (disambung).'
      },
      {
        title: 'Langkah 2: Identifikasi Kata Depan Tempat',
        description: '"ke kantor" & "di Surabaya" = penunjuk tempat/arah -> ditulis terpisah (pakai spasi).'
      }
    ]
  },
  {
    id: 'eyd-11',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'EYD V • Huruf Kapital Nama Geografi & Jabatan',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 40,
    question: 'Bagaimana aturan penulisan huruf kapital untuk unsur geografi dan nama jabatan sesuai EYD V?',
    hint: 'Huruf kapital digunakan jika geografi/jabatan diikuti nama diri. Huruf kecil jika berupa nama jenis umum.',
    answer: 'Gubernur Jawa Barat meninjau sungai di wilayah Danau Toba setelah menyantap gula jawa.',
    steps: [
      {
        title: 'Langkah 1: Jabatan & Geografi Diri (Kapital)',
        description: '"Gubernur Jawa Barat" dan "Danau Toba" kapital karena menyebut nama diri spesifik.'
      },
      {
        title: 'Langkah 2: Jenis Umum (Huruf Kecil)',
        description: '"sungai" dan "gula jawa" huruf kecil karena penunjuk jenis umum / nama buah / nama makanan.'
      }
    ]
  },
  {
    id: 'eyd-12',
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'EYD V • Penulisan Kuitansi, Ijazah, Jadwal, Februari',
    level: 'Level Sedang',
    category: 'literasi-indo',
    targetSeconds: 30,
    question: 'Manakah deretan kata baku yang seluruh penulisannya BENAR menurut KBBI VI & EYD V?',
    hint: 'Cari deretan yang tidak menggunakan "kwitansi", "ijasah", "jadwal" (dengan w), atau "pebruari".',
    answer: 'Kuitansi, ijazah, jadwal, dan Februari.',
    steps: [
      {
        title: 'Langkah 1: Evaluasi Kata Serapan Baku',
        description: 'Kuitansi (bukan kwitansi), Ijazah (bukan ijasah), Jadwal (baku), Februari (bukan pebruari).'
      },
      {
        title: 'Langkah 2: Konfirmasi EYD V',
        description: 'Seluruh kata dalam deretan tersebut memenuhi standar kata baku resmi BPPP.'
      }
    ]
  }
];

// 2. PEMAHAMAN BACAAN & MENULIS (PBM)
export const QUESTIONS_PBM: FlashcardQuestion[] = [
  ...QUESTIONS_EYD_V.filter(q => q.category === 'pbm'),
  {
    id: 'pbm-1',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'Kalimat Efektif & Kehematan Kata',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 40,
    question: 'Di antara kalimat berikut, manakah yang merupakan kalimat TIDAK efektif karena bermakna ganda (ambigu) atau tidak hemat kata?',
    hint: 'Cari penggunaan kata ulang berlebihan seperti "banyak siswa-siswa" atau frasa "adalah merupakan".',
    answer: 'Kalimat: "Banyak siswa-siswa yang menghadiri seminar tersebut adalah merupakan calon mahasiswa."',
    steps: [
      {
        title: 'Langkah 1: Identifikasi Pleonasme',
        description: 'Penggunaan "Banyak" yang diikuti kata ulang "siswa-siswa" adalah pemborosan kata (pleonasme).'
      },
      {
        title: 'Langkah 2: Identifikasi Kata Kerja Pemeringkat',
        description: 'Penggabungan "adalah" dan "merupakan" secara bersamaan tidak efektif. Pilih salah satu.'
      },
      {
        title: 'Langkah 3: Perbaikan Kalimat Efektif',
        description: '"Banyak siswa yang menghadiri seminar tersebut merupakan calon mahasiswa."'
      }
    ]
  },
  {
    id: 'pbm-2',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'Penggunaan Ejaan (EBI/PUEBI) & Konjungsi',
    level: 'Level Sedang',
    category: 'pbm',
    targetSeconds: 35,
    question: 'Manakah penulisan kata berimbuhan dan konjungsi antarparagraf yang BENAR sesuai kaidah bahasa Indonesia?',
    hint: 'Kata "di" sebagai kata depan pisah jika menunjukkan tempat; konjungsi antarkalimat seperti "Namun," harus diikuti tanda koma.',
    answer: 'Penulisan: "Namun, penelitian yang dilakukan di laboratorium tersebut menunjukkan hasil positif."',
    steps: [
      {
        title: 'Langkah 1: Cek Konjungsi Antarkalimat',
        description: '"Namun," di awal kalimat wajib diikuti koma.'
      },
      {
        title: 'Langkah 2: Cek Kata Depan vs Awalan',
        description: '"di laboratorium" ditulis terpisah karena kata depan penunjuk tempat.'
      }
    ]
  },
  {
    id: 'pbm-3',
    subtest: 'Pemahaman Bacaan & Menulis (PBM)',
    topic: 'Penentuan Judul Teks & Gagasan Utama',
    level: 'Level HOTS',
    category: 'pbm',
    targetSeconds: 45,
    question: 'Apa syarat utama judul yang BAIK dan EFEKTIF untuk sebuah paragraf eksplanasi ilmiah?',
    hint: 'Judul harus mewakili keseluruhan isi, singkat, padat, menarik, dan tidak berupa kalimat berpredikat lengkap.',
    answer: 'Mewakili inti topik, berbentuk frasa (bukan kalimat), dan mencakup variabel utama pembahasan.',
    steps: [
      {
        title: 'Langkah 1: Evaluasi Kelengkapan Cakupan',
        description: 'Judul tidak boleh terlalu luas atau terlalu sempit dari isi pembahasan teks.'
      },
      {
        title: 'Langkah 2: Cek Bentuk Sintaksis',
        description: 'Judul idealnya berupa frasa nominal/verbal, bukan kalimat ber-Subjek & Predikat utuh.'
      }
    ]
  }
];

// 3. LITERASI BAHASA INDONESIA
export const QUESTIONS_LITERASI_INDO: FlashcardQuestion[] = [
  ...QUESTIONS_EYD_V.filter(q => q.category === 'literasi-indo'),
  {
    id: 'lit-indo-1',
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'Ide Pokok & Paragraf Deduktif-Induktif',
    level: 'Level Sedang',
    category: 'literasi-indo',
    targetSeconds: 35,
    question: 'Bagaimana trik cepat menemukan ide pokok pada teks bacaan panjang UTBK SNBT?',
    hint: 'Skim kalimat pertama dan kalimat terakhir paragraf. Cari kata kunci yang berulang (repetisi).',
    answer: 'Cek kalimat 1 (Pernyataan umum) & kalimat terakhir (Simpulan). Cari kata penegas repetisi.',
    steps: [
      {
        title: 'Langkah 1: Deteksi Kalimat Utama',
        description: 'Jika kalimat ke-2 berisi rincian/contoh dari kalimat 1, maka ide pokok berada di kalimat pertama (Deduktif).'
      },
      {
        title: 'Langkah 2: Deteksi Simpulan Induktif',
        description: 'Jika paragraf diawali rincian dan diakhiri konjungsi "Dengan demikian", ide pokok berada di akhir.'
      }
    ]
  },
  {
    id: 'lit-indo-2',
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'Inferensi Implisit & Evaluasi Argumen',
    level: 'Level HOTS',
    category: 'literasi-indo',
    targetSeconds: 50,
    question: 'Apa perbedaan utama antara "Informasi Tersurat" (Stated Detail) dan "Simpulan Implisit" (Inference)?',
    hint: 'Informasi tersurat ada langsung di teks; inferensi membutuhkan logika deduktif dari premis yang ada.',
    answer: 'Inferensi memerlukan kesimpulan logis dari gabungan fakta teks tanpa menambah spekulasi luar.',
    steps: [
      {
        title: 'Langkah 1: Hindari Jebakan Salinan Harfiah',
        description: 'Pilihan yang menyalin teks 100% harfiah seringkali bukan jawaban inferensi yang tepat.'
      },
      {
        title: 'Langkah 2: Verifikasi Kebenaran Logis',
        description: 'Simpulan harus 100% didukung oleh bukti-bukti ilmiah dalam teks.'
      }
    ]
  }
];

// 4. LITERASI BAHASA INGGRIS
export const QUESTIONS_LITERASI_INGGRIS: FlashcardQuestion[] = [
  {
    id: 'lit-ing-1',
    subtest: 'Literasi Bahasa Inggris',
    topic: 'Academic Vocabulary & Contextual Synonym',
    level: 'Level HOTS',
    category: 'literasi-inggris',
    targetSeconds: 40,
    question: 'In the sentence: "The newly developed semiconductor demonstrated unprecedented resilience under extreme electrical fluctuations," what is the closest synonym for "unprecedented"?',
    hint: 'Look at the root word "precedent" (prior example). The prefix "un-" signals negation: never seen before.',
    answer: 'Unrivaled / Never seen before (Belum pernah ada sebelumnya)',
    steps: [
      {
        title: 'Step 1: Morphological Analysis',
        description: 'Un- (not) + precedent (prior instance) + -ed = having no previous precedent.'
      },
      {
        title: 'Step 2: Contextual Fit',
        description: 'The semiconductor shows durability that exceeds all previous technologies.'
      }
    ]
  },
  {
    id: 'lit-ing-2',
    subtest: 'Literasi Bahasa Inggris',
    topic: 'Author Tone & Attitude Analysis',
    level: 'Level Sedang',
    category: 'literasi-inggris',
    targetSeconds: 45,
    question: 'If an author states: "While the theoretical framework is captivating, conclusive empirical validation remains notably elusive," what is the author\'s attitude?',
    hint: '"Captivating" praises the theory, but "elusive" points out lack of proof. This signals a critical yet objective stance.',
    answer: 'Cautiously skeptical / Critical yet interested (Kritis objektif)',
    steps: [
      {
        title: 'Step 1: Transition Words',
        description: '"While..." sets up a contrast between interest in theory and demand for empirical data.'
      },
      {
        title: 'Step 2: Determine Attitude',
        description: 'The author values the idea but requires concrete proof before accepting it.'
      }
    ]
  }
];

export const SAMPLE_QUESTIONS: FlashcardQuestion[] = [
  ...QUESTIONS_PBM,
  ...QUESTIONS_LITERASI_INDO,
  ...QUESTIONS_LITERASI_INGGRIS
];

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-eyd-v',
    title: 'Master EYD V: Kosakata Baku & Tanda Baca (Titik/Koma)',
    subtitle: 'Drill 12 soal HOTS EYD V: ejaan baku KBBI VI, penempatan koma, titik dua, titik koma, & kata depan.',
    category: 'pbm',
    categoryLabel: 'Pemahaman Bacaan & Menulis',
    totalCards: QUESTIONS_EYD_V.length,
    masteryPercent: 92,
    tag: 'Spesial EYD V ⭐️',
    tagColor: 'bg-primary text-on-primary',
    image: ASSET_IMAGES.deckLogic,
    altText: 'Tata Bahasa & EYD V Ejaan Bahasa Indonesia',
    questions: QUESTIONS_EYD_V
  },
  {
    id: 'deck-pbm-1',
    title: 'Master PBM: Ejaan, Konjungsi & Kalimat Efektif',
    subtitle: 'Kuasai kehematan kata, ejaan EBI/EYD V, penulisan imbuhan, dan struktur kalimat efektif.',
    category: 'pbm',
    categoryLabel: 'Pemahaman Bacaan & Menulis',
    totalCards: QUESTIONS_PBM.length,
    masteryPercent: 88,
    tag: 'Fokus Utama',
    tagColor: 'bg-primary text-on-primary',
    image: ASSET_IMAGES.deckLogic,
    altText: 'Desk notes on writing and grammar',
    questions: QUESTIONS_PBM
  },
  {
    id: 'deck-indo-1',
    title: 'Literasi Bahasa Indonesia: Ide Pokok, EYD V & Inferensi',
    subtitle: 'Trik cepat membedakan paragraf deduktif-induktif, kata baku KBBI VI, dan makna kata.',
    category: 'literasi-indo',
    categoryLabel: 'Literasi Bahasa Indonesia',
    totalCards: QUESTIONS_LITERASI_INDO.length,
    masteryPercent: 82,
    tag: 'Prioritas UTBK',
    tagColor: 'bg-secondary text-on-secondary',
    image: ASSET_IMAGES.deckChemistry,
    altText: 'Indonesian literature notes',
    questions: QUESTIONS_LITERASI_INDO
  },
  {
    id: 'deck-ing-1',
    title: 'Literasi Bahasa Inggris: Academic Vocab & Author Tone',
    subtitle: 'Contextual synonyms, reading comprehension strategies, and tone analysis.',
    category: 'literasi-inggris',
    categoryLabel: 'Literasi Bahasa Inggris',
    totalCards: QUESTIONS_LITERASI_INGGRIS.length,
    masteryPercent: 75,
    tag: 'HOTS English',
    tagColor: 'bg-tertiary text-on-tertiary',
    image: ASSET_IMAGES.deckEnglish,
    altText: 'English academic reading cards',
    questions: QUESTIONS_LITERASI_INGGRIS
  }
];

export const INITIAL_SCHEDULE_SESSIONS: ScheduleSession[] = [
  // SENIN
  {
    id: 'sen-1',
    day: 'Senin',
    timeRange: '15:30 - 17:00',
    title: 'Penalaran Kuantitatif & Aljabar',
    description: 'Drill 25 Soal Geometri & Aljabar Dasar',
    subtest: 'TPS Kuantitatif',
    durationMinutes: 90,
    status: 'completed',
    badge: 'Selesai ✅'
  },
  {
    id: 'sen-2',
    day: 'Senin',
    timeRange: '19:30 - 21:00',
    title: 'Try Out Mandiri TPS & Skoring IRT',
    description: 'Simulasi waktu real: Penalaran Umum & PBM',
    subtest: 'Simulasi Mandiri',
    durationMinutes: 90,
    status: 'completed',
    badge: 'Selesai ✅'
  },
  // SELASA
  {
    id: 'sel-1',
    day: 'Selasa',
    timeRange: '16:00 - 17:30',
    title: 'Literasi Bahasa Indonesia & Inggris',
    description: 'Ide Pokok, Inferensi, & Fakta Opini Teks Ilmiah',
    subtest: 'Literasi BI & EN',
    durationMinutes: 90,
    status: 'completed',
    badge: 'Selesai ✅'
  },
  {
    id: 'sel-2',
    day: 'Selasa',
    timeRange: '20:00 - 21:30',
    title: 'Diskusi Soal Bahas Fisika HOTS',
    description: 'Bedah soal rangkaian listrik & gelombang elektro bersama mentor',
    subtest: 'TKA Saintek',
    durationMinutes: 90,
    status: 'completed',
    badge: 'Selesai ✅'
  },
  // RABU
  {
    id: 'rab-1',
    day: 'Rabu',
    timeRange: '16:00 - 17:30',
    title: 'TPS Pemahaman Umum & Logika Proposisi',
    description: 'Logika Proposisi & Analisis Pola Bilangan Bertingkat',
    subtest: 'TPS Penalaran',
    durationMinutes: 90,
    status: 'active',
    badge: 'Aktif ⏳'
  },
  {
    id: 'rab-2',
    day: 'Rabu',
    timeRange: '19:30 - 21:00',
    title: 'TKA Fisika Listrik Dinamis & Magnet',
    description: 'Hukum Kirchhoff, Gaya Lorentz, dan Induksi Faraday',
    subtest: 'TKA Fisika',
    durationMinutes: 90,
    status: 'upcoming',
    badge: 'Mendatang ⏰'
  },
  // KAMIS
  {
    id: 'kam-1',
    day: 'Kamis',
    timeRange: '16:30 - 18:00',
    title: 'Review Pembahasan Flashcard & Rumus Cepat',
    description: 'Spaced repetition kartu ragu & salah try out pekanan',
    subtest: 'Evaluasi Harian',
    durationMinutes: 90,
    status: 'upcoming',
    badge: 'Mendatang ⏰'
  },
  // JUMAT
  {
    id: 'jum-1',
    day: 'Jumat',
    timeRange: '15:30 - 17:00',
    title: 'Drill Literasi Bahasa Inggris Akademik',
    description: 'Speed reading 4 teks panjang dan vocabulary mastery',
    subtest: 'Literasi Inggris',
    durationMinutes: 90,
    status: 'upcoming',
    badge: 'Mendatang ⏰'
  },
  // SABTU
  {
    id: 'sab-1',
    day: 'Sabtu',
    timeRange: '08:00 - 11:30',
    title: 'Try Out Mingguan (Standar BPPP)',
    description: '155 Soal UTBK SNBT format resmi',
    subtest: 'Simulasi Harian',
    durationMinutes: 210,
    status: 'upcoming',
    badge: 'Simulasi 📝'
  },
  // MINGGU
  {
    id: 'ming-1',
    day: 'Minggu',
    timeRange: '10:00 - 12:00',
    title: 'Evaluasi & Refleksi Belajar Pekanan',
    description: 'Analisis kelemahan subtes & penyusunan ulang target minggu depan',
    subtest: 'Evaluasi Total',
    durationMinutes: 120,
    status: 'upcoming',
    badge: 'Refleksi 💡'
  }
];
