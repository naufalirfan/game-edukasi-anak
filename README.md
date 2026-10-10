# 🎮 Game Edukasi Interaktif Anak (4–8 Tahun)

> Aplikasi mobile edukasi + storytelling — mini-game kognitif, aman tanpa iklan, dengan Parental Dashboard.

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](./web)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](./web)
[![Unity](https://img.shields.io/badge/Unity-2022.3%20LTS-black?logo=unity)](./unity)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://web-three-kappa-43.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#lisensi)

**Sumber PRD:** Dokumen Gemini — [share.gemini.google/9XX4OVgMdWUl](https://share.gemini.google/9XX4OVgMdWUl)  
**Live demo (web):** **https://web-three-kappa-43.vercel.app**  
Preview (SSO): `https://game-edukasi-anak-rdn5di7ju-naufal6.vercel.app` — butuh bypass token (`vercel curl`)

---

## ✨ Fitur Utama (sesuai PRD)

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| **Multi-Profil** | 1 akun orang tua → maks 3 profil anak, avatar & progres terpisah | Tinggi |
| **Modul Pembelajaran** | 3 kategori: Logika/Matematika, Bahasa/Kosakata, Kreativitas | Tinggi |
| **Parental Dashboard** | Math gate PIN, laporan progres, batas waktu layar (30 menit/hari) | Tinggi |
| **Voice-Over Navigasi** | Semua instruksi pakai narator — anak buta baca tetap bisa main | Tinggi |
| **Reward Positif** | Stiker/lencana virtual tanpa efek adiktif | Menengah |
| **Mode Offline** | Modul dasar tanpa internet + sinkron saat online | Menengah |

**Monetisasi:** Freemium (3 dunia pertama gratis) → Subscription bulanan/tahunan — **mutlak bebas iklan**.

---

## 📁 Struktur Repo

```
game-edukasi-anak/
├── web/                    # Web prototype — Vite + React + TypeScript (deploy ke Vercel)
│   ├── src/
│   │   ├── App.tsx         # Routing via state: Home, ProfileSelector, Worlds, Games, ParentalDashboard
│   │   ├── store.ts        # localStorage (profiles, progress, premium), Web Speech API id-ID
│   │   ├── index.css       # Kid-friendly theme, touch target ≥48dp
│   │   └── components/     # ModuleCard, MiniGame*, ParentalDashboard, MathGate
│   ├── vercel.json         # Vite preset, build: npm run build → dist
│   └── vite.config.ts
├── unity/                  # Unity scaffold — 2022.3.20f1, bundle com.mas.gameedukasi
│   ├── Assets/Scripts/Core/      # ProfileManager, ProgressManager, ParentalGate, ScreenTime, Audio
│   ├── Assets/Scripts/Modules/   # LogikaModule, BahasaModule, KreativitasModule
│   ├── Assets/Scripts/UI/        # ProfileSelectorUI, ModuleCardUI, RewardUI
│   ├── Assets/Scenes/            # Main, ProfileSelect, Gameplay, ParentalDashboard
│   ├── ProjectSettings/          # ProjectVersion + PlayerSettings (2D, bundle ID)
│   └── Packages/                 # manifest (UGUI, TextMeshPro, Timeline, 2D)
└── README.md               # ← kamu di sini
```

---

## 🚀 Quick Start — Web Prototype

**Syarat:** Node 20+

```bash
git clone https://github.com/naufalirfan/game-edukasi-anak.git
cd game-edukasi-anak/web
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run preview  # preview build
```

### Cara pakai (alur anak)
1. **Pilih profil** — buat hingga 3 anak (nama + avatar), tap untuk aktifkan.
2. **Pilih dunia** — Logika / Bahasa / Kreativitas (card besar, suara `🔊 Ucapkan`).
3. **Main mini-game:**
   - *Logika:* Hitung Benda (hitung objek, nyawa & skor), Cocokkan Bentuk (drag)
   - *Bahasa:* Tebak Huruf (dengar → pilih huruf), Susun Kata (shuffle → susun, premium lock)
   - *Kreativitas:* Mewarnai (canvas sentuh/mouse, palet warna, outline putus-putus)
4. **Dapat stiker** — tiap modul selesai, stiker tersimpan per profil (localStorage).
5. **Parental Dashboard** — tap 🔒 di header → jawab soal matematika acak → lihat progres, atur screen-time, stiker, toggle premium.

### Detail teknis web

| Aspek | Implementasi |
|---|---|
| Routing | State `View` (tanpa react-router — sesuaikan PRD: simpel) |
| State | `localStorage`: `edu_profiles_v1`, `edu_progress_v1`, `edu_premium` |
| Voice-over | `speechSynthesis` Web Speech API `id-ID` (fallback: toast) |
| Offline | `navigator.onLine` + event `online/offline`, bar indikator |
| Gaya | CSS native, touch target ≥48px, kontras tinggi, drag & tap saja |
| Build | Vite 7, `tsc -b && vite build` — 242 KB JS (gzip ~75 KB) |

---

## 🎮 Unity Scaffold

| Item | Nilai |
|---|---|
| Versi | **2022.3.20f1** LTS |
| Bundle ID | `com.mas.gameedukasi` |
| Render | 2D |
| Package | UGUI, TextMeshPro, Timeline, 2D Sprite, Audio |

**Buka di Unity Hub:**
1. Install Unity **2022.3 LTS** via Unity Hub.
2. `Add` → pilih folder `unity/` (yang berisi `ProjectSettings/` & `Packages/`).
3. Open — jika diminta upgrade packages, accept.

**Skrip (namespace `MAS.GameEdukasi`, compilable, ada TODO):**

```
Assets/Scripts/Core/       ProfileManager, ProgressManager, ParentalGate, ScreenTimeManager, AudioManager
Assets/Scripts/Modules/    LogikaModule, BahasaModule, KreativitasModule
Assets/Scripts/UI/         ProfileSelectorUI, ModuleCardUI, RewardUI
```

**Scene minimal (YAML valid, kosong — tambah Camera/Canvas di editor):** `Main`, `ProfileSelect`, `Gameplay`, `ParentalDashboard`

> Next: buat prefab UI & wire ke skrip, tambah Firebase SDK / Amplify, Addressables untuk paket audio offline.

---

## ☁️ Deploy — Vercel

| Item | Nilai |
|---|---|
| Project | `game-edukasi-anak` — ID `prj_Rp5gBh7srQRTWR8Q5RpsZAxoAAhk` |
| Team | `team_z4dCt5o3TVVjz12tpTW2b0Ew` (`naufal6`) |
| Framework | `vite` |
| Root Directory | `web` |
| Build | `npm run build` → `dist` |
| Node | `24.x` |
| Auto-deploy | `git push origin main` → build otomatis |
| Prod URL (publik) | **https://web-three-kappa-43.vercel.app** |

```bash
# manual deploy dari repo root
vercel deploy --prod --yes
# bypass SSO untuk preview URL
vercel curl https://game-edukasi-anak-rdn5di7ju-naufal6.vercel.app
```

**Struktur:** `web/` di-deploy, `unity/` ikut di repo tapi tidak di-build oleh Vercel.

---

## 📋 Checklist Implementasi (ringkas)

> Detail lengkap ada di `prd-game-edukasi/PRD-checklist-dan-review.md` (18 slide deck juga tersedia).

- **Fase 0 — Fondasi & Legal:** daftar Apple/Google Play, pelajari Families/Kids policy, rancang consent COPPA, audit SDK (matikan IDFA/AAID), skema DB `parent_account/child_profile/progress_event/entitlement`, CI Unity iOS/Android.
- **Fase 1 — Konten & Desain (1–1.5 bln):** naskah 3 kategori × 10 aktivitas, voice-over per modul (download-on-demand), maskot & palet, wireframe 5 layar, uji 5 anak + 5 ortu, lisensi aset.
- **Fase 2 — Core Dev (2–3 bln):** multi-profile, vertical slice Logika dulu, voice engine + reward + offline resync, Parental Dashboard (Math gate acak + cooldown), IAP StoreKit 2 + Play Billing v7, test (scoring, progres, timer, entitlement).
- **Fase 3 — Alpha & Beta (1 bln):** QA device lawas (<150 MB, load <5 dtk), beta 10–20 keluarga, audit COPPA.
- **Fase 4 — Launch (0.5 bln):** ASO, halaman privasi, promo early bird 50%, staged rollout 10→50→100%, dashboard KPI (D1/D7/D30 + crash + churn).

**Definition of Done per fitur:** jalan di iOS+Android · lolos QA device lawas · tidak ada akses keluar di luar Parental Gate · tanpa PII anak · test hijau.

---

## 🔍 Review Kritis PRD (ringkas)

| # | Temuan | Dampak |
|---|---|---|
| 1 | **Risiko penolakan App Store / Play Families tidak ada di PRD** — child-directed + IAP paling sering ditolak | Blocker jadwal |
| 2 | **Consent COPPA cuma “kepatuhan ketat”** tanpa mekanisme verifikasi, retensi, penghapusan | Blocker legal |
| 3 | **50.000 unduhan + konversi 5% tanpa funnel/CAC/anggaran** (typical 2–4%) | Target dekoratif |
| 4 | **KPI tanpa D1/D7/D30 retention** — download + DAU sembunyikan churn | Metrik bocor |
| 5 | **Screen-time limit lemah** — timer in-app mudah di-bypass, API OS tidak terbuka penuh | Klaim perlu definisi ulang |
| 6 | **Offline ↔ subscription bentrok** — cek entitlement tanpa jaringan belum ada skema | Premium/bajak issue |

Lainnya: ukuran <150 MB vs audio voice-over (butuh opus / download-on-demand), Fase 1 terlalu padat, tanpa analisis kompetitor, MRR belum potong fee store 15–30% + biaya konten bulanan, roadmap AR v2.0 terlalu dini.

---

## 🗺️ Roadmap (PRD)

- **v1.1 (bulan 2):** modul Bahasa Inggris (alphabet), stiker animasi
- **v1.5 (bulan 4):** buku cerita interaktif + notifikasi email mingguan ke ortu
- **v2.0 (6+ bulan):** AR hewan virtual 3D — *tunda sampai data retensi valid*

---

## 📄 Dokumen

- PRD ringkas + checklist + review: `prd-game-edukasi/` (di scratch lokal)
- Deck 18 slide: `PRD-Game-Edukasi-Deck.pptx` + `.pdf` + preview `render/slide-*.png`

---

## 🤝 Kontribusi

```bash
git checkout -b feat/nama-fitur
# edit web/ atau unity/
git commit -m "feat: deskripsi"
git push origin feat/nama-fitur
# buka PR ke main — Vercel akan buat Preview deployment
```

---

## Lisensi

MIT — bebas pakai untuk belajar & prototipe. Untuk rilis toko app, lengkapi kebijakan privasi child-directed & consent COPPA terlebih dahulu.
