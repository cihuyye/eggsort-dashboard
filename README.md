# 🥚 EggSort-AI: Industrial Vision Dashboard

> **Frontend Dashboard Telemetri & Kontrol Sortir Mutu Telur Otomatis (SNI 3926:2023)**  
> Dibangun dengan **Vue 3 (Composition API)**, **Vite**, dan terintegrasi dengan **Backend Flask API (Port 8000)** serta **Google Gemini LLM**.

---

## 🖥️ Ringkasan Antarmuka Pengguna

Dashboard ini dirancang khusus untuk memonitor lini konveyor sortir telur ayam konsumsi industri secara *real-time*:

* **Live Inspection Stream**: Menampilkan citra inspeksi multi-sudut (ESP32-CAM stream atau simulasi berkas multi-sudut 360°).
* **Klasifikasi Mutu Otomatis (SNI 3926:2023)**:
  - **Mutu I (Grade A / Prima)** $\rightarrow$ Baki Kemasan Ritel Berlabel
  - **Mutu II (Grade B / Standar)** $\rightarrow$ Wadah Industri Olahan Pangan
  - **Mutu III (Reject / Afkir)** $\rightarrow$ Wadah Karantina Pangan
* **Telemetri Fisik Telur (OpenCV Vision)**:
  - Panjang ($L$) & Lebar ($W$) dalam milimeter
  - **Egg Shape Index (ESI)**: Rasio bentuk telur (Normal 72–76%, Lonjong <72%, Bulat >76%)
  - Estimasi Bobot Gram & Kategori Ukuran SNI (Kecil, Sedang, Besar, Sangat Besar)
* **Auditor Mutu AI & Konsultasi SNI (Google Gemini)**:
  - Halaman tanya-jawab cerdas seputar regulasi SNI 3926:2023.
  - Dilengkapi jendela modal **`[ ℹ️ Info & Standar ]`** yang memuat seluruh tabel acuan SNI, pilar anti-halusinasi, dan arsitektur model.
  - Modal **`[ 🔑 Setel API Key ]`** untuk menyimpan Google Gemini API Key secara lokal (`localStorage`).
  - Fitur toggle **"Kaitkan Data Telur"** untuk beralih antara Mode Bebas dan Mode Audit Telur Aktif.
* **Telemetri Aktuator Konveyor**:
  - Status Gate 1 (Solenoid Piston Mutu I)
  - Status Gate 2 (Solenoid Piston Mutu II)
  - Status Reject Ejector (Afkir Mutu III)

---

## 🛠️ Teknologi & Dependensi

* **Framework**: [Vue 3](https://vuejs.org/) (SFC `<script setup>`, Composition API)
* **Build Tool**: [Vite 8](https://vitejs.dev/) (Fast Hot Module Replacement)
* **HTTP Client**: [Axios](https://axios-http.com/) dengan interceptor & auto-fallback timeout
* **Chart Library**: [Chart.js](https://www.chartjs.org/) & `vue-chartjs`
* **Realtime Integration**: Firebase Realtime Database SDK
* **Font & Styling**: Plus Jakarta Sans, JetBrains Mono, Custom Industrial Dark/Light CSS

---

## 📂 Struktur Berkas Frontend

```text
eggsort-dashboard/
├── index.html                   # HTML Entry Point
├── package.json                 # Konfigurasi dependensi & npm scripts
├── vite.config.js               # Konfigurasi bundling Vite
├── src/
│   ├── main.js                  # Inisialisasi aplikasi Vue
│   ├── App.vue                  # Root Application Component
│   ├── style.css                # Desain sistem & variabel tema (Light/Dark)
│   ├── components/
│   │   ├── AiChatView.vue       # Halaman Auditor Mutu AI (Gemini Chat + Modal Info)
│   │   ├── CameraStream.vue     # Komponen tampilan kamera & bounding box cacat
│   │   ├── Sidebar.vue          # Navigasi utama dashboard
│   │   └── ...                  # Komponen telemetri, metrik, & simulator
│   ├── composables/
│   │   └── useEggSort.js        # State management reaktif telemetri sortir
│   └── services/
│       └── eggApiService.js     # Layanan komunikasi REST API ke Flask (Port 8000)
└── dist/                        # Berkas produksi hasil kompilasi siap deploy
```

---

## 🚀 Panduan Instalasi & Pengoperasian

### 1. Instalasi Paket Node.js
Pastikan Node.js (v18+) telah terpasang di komputer Anda:
```powershell
npm install
```

### 2. Jalankan Mode Pengembangan (Dev Server)
```powershell
npm run dev
```
Dashboard akan aktif di alamat lokal: **`http://localhost:5173/`**.

> **Catatan**: Pastikan Backend Flask API (`app_flask.py`) sudah berjalan di `http://127.0.0.1:8000` agar seluruh fitur prediksi dan chat AI terhubung.

### 3. Kompilasi untuk Produksi (Build)
```powershell
npm run build
```
Hasil build yang dioptimasi dan ter-minifikasi akan tersimpan di dalam folder `dist/`.

### 4. Menjalankan Preview Hasil Build
```powershell
npm run preview
```

---

## ⚙️ Konfigurasi Backend URL

Alamat default backend dikonfigurasi pada file [`src/services/eggApiService.js`](file:///d:/github_rama/eggsort-dashboard/src/services/eggApiService.js):
```javascript
const DEFAULT_API_URL = 'http://127.0.0.1:8000'
```
Jika backend Flask Anda berjalan di host/port lain (misalnya jaringan lokal atau IP ESP32), Anda dapat menyesuaikan variabel tersebut atau memanggil fungsi `eggApiService.setBaseUrl('http://IP_BARU:PORT')`.
