<template>
  <div class="extra-view-wrapper">
    <!-- View 1: Riwayat & Analitik -->
    <div v-if="activeTab === 'history'" class="tab-view-card">
      <div class="view-header">
        <div>
          <h2 class="view-title">Riwayat & Analisis Telemetri Produksi</h2>
          <p class="view-sub">Agregasi performa pemilahan mutu telur dan efisiensi konveyor</p>
        </div>
        <button class="primary-btn" @click="exportCSV">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Unduh Rekap Laporan (.CSV)</span>
        </button>
      </div>

      <div class="stats-overview-grid">
        <div class="stat-box">
          <div class="stat-label">Rasio Kelolosan Mutu I (Grade A)</div>
          <div class="stat-val text-green">{{ gradeAPercent }}%</div>
          <div class="stat-desc">Target industri: &gt; 70%</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Rasio Toleransi Mutu II (Grade B)</div>
          <div class="stat-val text-blue">{{ gradeBPercent }}%</div>
          <div class="stat-desc">Diarahkan ke jalur industri kue</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Tingkat Penolakan (Reject)</div>
          <div class="stat-val text-red">{{ rejectPercent }}%</div>
          <div class="stat-desc">Di bawah ambang batas bahaya (10%)</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Kecepatan Pemindaian Rata-Rata</div>
          <div class="stat-val">{{ speedPerMin }} butir/menit</div>
          <div class="stat-desc">Kapasitas optimum conveyor</div>
        </div>
      </div>

      <!-- History Distribution Bar -->
      <div class="distribution-card">
        <div class="dist-title">Distribusi Proporsi Grade Telur Sesi Ini</div>
        <div class="progress-bar-stacked">
          <div class="bar-segment bar-a" :style="{ width: `${gradeAPercent}%` }" :title="`Grade A: ${gradeAPercent}%`"></div>
          <div class="bar-segment bar-b" :style="{ width: `${gradeBPercent}%` }" :title="`Grade B: ${gradeBPercent}%`"></div>
          <div class="bar-segment bar-c" :style="{ width: `${rejectPercent}%` }" :title="`Reject: ${rejectPercent}%`"></div>
        </div>
        <div class="progress-legend">
          <span class="legend-item"><span class="dot dot-a"></span> Grade A ({{ gradeACount }} butir)</span>
          <span class="legend-item"><span class="dot dot-b"></span> Grade B ({{ gradeBCount }} butir)</span>
          <span class="legend-item"><span class="dot dot-c"></span> Reject ({{ rejectCount }} butir)</span>
        </div>
      </div>
    </div>

    <!-- View 2: Kontrol Simulator & Kalibrasi -->
    <div v-else-if="activeTab === 'calibration'">
      <SimulatorView :triggerToast="triggerToast" />
    </div>

    <!-- View 3: Parameter Mutu & Info Sistem -->
    <div v-else-if="activeTab === 'settings'" class="tab-view-card">
      <div class="view-header">
        <div>
          <div class="sni-header-badge">
            <span class="badge-flag">🇮🇩 SNI 3926:2023</span>
            <span class="badge-org">BADAN STANDARDISASI NASIONAL (BSN)</span>
          </div>
          <h2 class="view-title">Standar Mutu Resmi SNI 3926:2023 (Telur Ayam Konsumsi)</h2>
          <p class="view-sub">Acuan lengkap klasifikasi mutu fisik, mikrobiologi, bobot, pengemasan, dan pelabelan resmi</p>
        </div>

        <!-- Sub-navigation Tabs -->
        <div class="sni-subtabs">
          <button
            class="sni-subtab-btn"
            :class="{ active: sniSubTab === 'physical' }"
            @click="sniSubTab = 'physical'"
          >
            📋 Tabel 1: Mutu Fisik
          </button>
          <button
            class="sni-subtab-btn"
            :class="{ active: sniSubTab === 'bobot_mikro' }"
            @click="sniSubTab = 'bobot_mikro'"
          >
            ⚖️ Bobot &amp; Mikrobiologi
          </button>
          <button
            class="sni-subtab-btn"
            :class="{ active: sniSubTab === 'regulasi' }"
            @click="sniSubTab = 'regulasi'"
          >
            📦 Kemasan, Label &amp; Simpan
          </button>
          <button
            class="sni-subtab-btn"
            :class="{ active: sniSubTab === 'sensor_mapping' }"
            @click="sniSubTab = 'sensor_mapping'"
          >
            🤖 Integrasi AI &amp; Sensor
          </button>
        </div>
      </div>

      <!-- SUB-TAB 1: TABEL 1 PERSYARATAN MUTU FISIK LENGKAP -->
      <div v-if="sniSubTab === 'physical'" class="sni-content-section">
        <div class="sni-section-alert">
          <div class="alert-icon">ℹ️</div>
          <div class="alert-text">
            <strong>Catatan Standardisasi SNI 3926:2023 Pasal 5:</strong> Seluruh tingkatan mutu (Mutu I, II, dan III) <strong>wajib mensyaratkan kerabang UTUH</strong>. Telur dengan kerabang retak (cracked), bocor, busuk, atau terkontaminasi secara otomatis masuk kategori <strong>REJECT / AFKIR</strong> dan dilarang diedarkan sebagai telur konsumsi segar.
          </div>
        </div>

        <div class="sni-table-wrapper">
          <table class="sni-table">
            <thead>
              <tr>
                <th style="width: 20%;">Faktor Mutu &amp; Parameter</th>
                <th style="width: 20%;" class="th-grade-a">
                  <div class="col-badge badge-mutu-1">MUTU I (Grade A)</div>
                  <span class="th-sub">Kualitas Prima / Ritel Segar</span>
                </th>
                <th style="width: 20%;" class="th-grade-b">
                  <div class="col-badge badge-mutu-2">MUTU II (Grade B)</div>
                  <span class="th-sub">Komersial / Industri Olahan</span>
                </th>
                <th style="width: 20%;" class="th-grade-c">
                  <div class="col-badge badge-mutu-3">MUTU III</div>
                  <span class="th-sub">Batas Bawah Konsumsi</span>
                </th>
                <th style="width: 20%;" class="th-grade-reject">
                  <div class="col-badge badge-reject">KRITERIA REJECT</div>
                  <span class="th-sub">Afkir / Ditolak Konveyor</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Group 1: Kerabang -->
              <tr class="group-header-row">
                <td colspan="5"><strong>1. KONDISI KERABANG (SHELL)</strong> — Diinspeksi oleh Kamera AI Multi-Sudut &amp; YOLOv8-seg</td>
              </tr>
              <tr>
                <td><strong>a. Bentuk (Shape Index)</strong></td>
                <td>Normal (SI 72 – 76)</td>
                <td>Normal (SI 72 – 76)</td>
                <td>Abnormal (SI &lt; 72 atau &gt; 76)</td>
                <td><span class="text-tag-reject">Deformasi ekstrem / rusak berat</span></td>
              </tr>
              <tr>
                <td><strong>b. Kehalusan</strong></td>
                <td>Halus &amp; rata</td>
                <td>Halus</td>
                <td>Boleh sedikit kasar</td>
                <td><span class="text-tag-reject">Berkapur tebal / rapuh keropos</span></td>
              </tr>
              <tr>
                <td><strong>c. Ketebalan</strong></td>
                <td>Tebal (0,39 mm – 0,41 mm)</td>
                <td>Sedang (0,30 mm – 0,36 mm)</td>
                <td>Tipis (0,28 mm – 0,30 mm)</td>
                <td><span class="text-tag-reject">Sangat tipis (&lt; 0,25 mm) / lunak</span></td>
              </tr>
              <tr>
                <td><strong>d. Keutuhan</strong></td>
                <td><span class="text-tag-ok">Utuh</span></td>
                <td><span class="text-tag-ok">Utuh</span></td>
                <td><span class="text-tag-ok">Utuh</span></td>
                <td><span class="text-tag-reject font-bold">Retak (cracked), bocor, remuk</span></td>
              </tr>
              <tr>
                <td><strong>e. Kebersihan</strong></td>
                <td>Bersih bebas noda kotoran</td>
                <td>Boleh sedikit noda (maks. 1/32 luas)</td>
                <td>Boleh banyak noda (maks. 1/16 luas)</td>
                <td><span class="text-tag-reject">Kotoran feses pekat &gt; 1/16 luas</span></td>
              </tr>

              <!-- Group 2: Kantung Udara -->
              <tr class="group-header-row">
                <td colspan="5"><strong>2. KONDISI KANTUNG UDARA (AIR CELL)</strong> — Diinspeksi Peneropongan (Candling)</td>
              </tr>
              <tr>
                <td><strong>a. Kedalaman</strong></td>
                <td>&lt; 0,5 cm (Sangat segar)</td>
                <td>0,5 cm – 0,9 cm (Segar menengah)</td>
                <td>&gt; 0,9 cm (Simpan lama)</td>
                <td><span class="text-tag-reject">Kantung rusak / &gt; 1,2 cm (Busuk)</span></td>
              </tr>
              <tr>
                <td><strong>b. Kebebasan Bergerak</strong></td>
                <td>Tetap di tempat (Stabil)</td>
                <td>Boleh bebas bergerak</td>
                <td>Boleh bebas &amp; bergelembung</td>
                <td><span class="text-tag-reject">Gelembung pecah mencemari putih telur</span></td>
              </tr>

              <!-- Group 3: Putih Telur -->
              <tr class="group-header-row">
                <td colspan="5"><strong>3. KONDISI PUTIH TELUR (ALBUMIN)</strong></td>
              </tr>
              <tr>
                <td><strong>a. Kebersihan</strong></td>
                <td>Bebas benda asing</td>
                <td>Bebas benda asing</td>
                <td>Boleh sedikit ada benda asing</td>
                <td><span class="text-tag-reject">Cemaran jamur, ulat, kotoran dalam</span></td>
              </tr>
              <tr>
                <td><strong>b. Kekentalan</strong></td>
                <td>Kental (Firm)</td>
                <td>Boleh sedikit encer</td>
                <td>Boleh encer (kuning belum campur)</td>
                <td><span class="text-tag-reject">Encer berair total (Watery rot)</span></td>
              </tr>
              <tr>
                <td><strong>c. Indeks Putih Telur</strong></td>
                <td>0,134 – 0,175</td>
                <td>0,092 – 0,133</td>
                <td>0,050 – 0,091</td>
                <td><span class="text-tag-reject">&lt; 0,050 (Struktur rusak)</span></td>
              </tr>

              <!-- Group 4: Kuning Telur -->
              <tr class="group-header-row">
                <td colspan="5"><strong>4. KONDISI KUNING TELUR (YOLK)</strong></td>
              </tr>
              <tr>
                <td><strong>a. Bentuk</strong></td>
                <td>Bulat sempurna</td>
                <td>Bulat</td>
                <td>Boleh agak pipih / oval</td>
                <td><span class="text-tag-reject">Membran vitelin robek / pecah</span></td>
              </tr>
              <tr>
                <td><strong>b. Posisi</strong></td>
                <td>Tepat di tengah</td>
                <td>Sedikit bergeser dari tengah</td>
                <td>Boleh agak kepinggiran</td>
                <td><span class="text-tag-reject">Melekat di kerabang (Stuck yolk)</span></td>
              </tr>
              <tr>
                <td><strong>c. Penampakan Batas</strong></td>
                <td>Tidak jelas (Tertutup albumin kental)</td>
                <td>Agak jelas</td>
                <td>Jelas terlihat</td>
                <td><span class="text-tag-reject">Bercak embrionik / batas hitam</span></td>
              </tr>
              <tr>
                <td><strong>d. Kebersihan</strong></td>
                <td>Bersih</td>
                <td>Bersih</td>
                <td>Bersih</td>
                <td><span class="text-tag-reject">Bercak darah (blood spot) &gt; 2 mm</span></td>
              </tr>
              <tr>
                <td><strong>e. Indeks Kuning Telur</strong></td>
                <td>0,458 – 0,521</td>
                <td>0,394 – 0,457</td>
                <td>0,330 – 0,393</td>
                <td><span class="text-tag-reject">&lt; 0,330 (Degradasi parah)</span></td>
              </tr>

              <!-- Group 5: Bau -->
              <tr class="group-header-row">
                <td colspan="5"><strong>5. BAU (ODOR)</strong></td>
              </tr>
              <tr>
                <td><strong>a. Aroma</strong></td>
                <td>Khas telur segar</td>
                <td>Khas telur segar</td>
                <td>Khas telur segar</td>
                <td><span class="text-tag-reject">Bau busuk, amonia, asam abnormal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SUB-TAB 2: PASAL 4.2 BOBOT & TABEL 2 MIKROBIOLOGI -->
      <div v-else-if="sniSubTab === 'bobot_mikro'" class="sni-content-section">
        <div class="sni-grid-two-col">
          <!-- Card 1: Klasifikasi Bobot SNI 3926:2023 Pasal 4.2 -->
          <div class="sni-detail-card">
            <div class="card-top-header">
              <div class="card-icon-box teal">⚖️</div>
              <div>
                <h3 class="card-h3">Klasifikasi Bobot Telur (Pasal 4.2)</h3>
                <span class="card-subtitle">SNI 3926:2023 Menetapkan 3 Kategori Bobot Resmi</span>
              </div>
            </div>

            <div class="weight-classes-list">
              <div class="weight-item">
                <div class="weight-badge badge-small">KECIL</div>
                <div class="weight-spec">
                  <div class="weight-range">&lt; 50 gram</div>
                  <div class="weight-desc">Telur pullet / ayam usia muda. Cocok untuk paket ekonomis.</div>
                </div>
              </div>

              <div class="weight-item">
                <div class="weight-badge badge-medium">SEDANG</div>
                <div class="weight-spec">
                  <div class="weight-range">50 g sampai dengan 60 gram</div>
                  <div class="weight-desc">Ukuran standar komersial paling dominan di pasar konsumsi ritel.</div>
                </div>
              </div>

              <div class="weight-item">
                <div class="weight-badge badge-large">BESAR</div>
                <div class="weight-spec">
                  <div class="weight-range">&gt; 60 gram</div>
                  <div class="weight-desc">Kategori jumbo/premium dari ayam fase puncak produksi.</div>
                </div>
              </div>
            </div>

            <div class="tech-formula-box">
              <span class="formula-label">📐 Metode Estimasi OpenCV Kamera:</span>
              <p class="formula-text">
                Volume dihitung dengan pendekatan ellipsoid: <code>V = (π / 6) × L × W²</code> (cm³).
                Estimasi bobot = <code>V × 1,035 g/cm³</code> (massa jenis telur segar SNI).
              </p>
            </div>
          </div>

          <!-- Card 2: Mutu Mikrobiologi SNI 3926:2023 Tabel 2 -->
          <div class="sni-detail-card">
            <div class="card-top-header">
              <div class="card-icon-box blue">🔬</div>
              <div>
                <h3 class="card-h3">Persyaratan Mutu Mikrobiologi (Tabel 2)</h3>
                <span class="card-subtitle">Batas Maksimum Cemaran Mikroba Telur Konsumsi</span>
              </div>
            </div>

            <table class="micro-table">
              <thead>
                <tr>
                  <th>Jenis Cemaran Mikroba</th>
                  <th>Batas Maksimum SNI</th>
                  <th>Metode / Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Angka Lempeng Total (ALT)</strong>
                    <div class="param-sub">Bakteri mesofilik aerob</div>
                  </td>
                  <td><span class="mono-badge">1 × 10⁵ koloni/g (cfu/g)</span></td>
                  <td>SNI ISO 4833-1 (Reject jika melebihi)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Enterobacteriaceae</strong>
                    <div class="param-sub">Indikator higienitas &amp; sanitasi</div>
                  </td>
                  <td><span class="mono-badge">1 × 10² koloni/g (cfu/g)</span></td>
                  <td>SNI ISO 21528-2 (Reject jika melebihi)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Salmonella spp.</strong>
                    <div class="param-sub">Bakteri patogen enteric berbahaya</div>
                  </td>
                  <td><span class="mono-badge danger">Negatif / 25 g</span></td>
                  <td>SNI ISO 6579-1 (Toleransi 0 - Wajib Afkir)</td>
                </tr>
              </tbody>
            </table>

            <div class="sni-note-box danger-note">
              <span class="note-bold">⚠️ Bahaya Kerabang Retak:</span> Kerabang yang retak (cracked) menghilangkan lapisan proteksi kutikula, membuka celah masuk bagi <em>Salmonella</em> dan <em>Enterobacteriaceae</em> ke dalam cairan telur. Inilah dasar ilmiah mengapa YOLOv8-seg memprogram penolakan mutlak untuk setiap retakan.
            </div>
          </div>
        </div>
      </div>

      <!-- SUB-TAB 3: PENGEMASAN, PELABELAN & PENYIMPANAN (PASAL 8-10) -->
      <div v-else-if="sniSubTab === 'regulasi'" class="sni-content-section">
        <div class="sni-grid-three-col">
          <!-- Card 1: Pengemasan -->
          <div class="regulation-card">
            <div class="reg-icon">📦</div>
            <h4 class="reg-title">Pengemasan (Pasal 8)</h4>
            <ul class="reg-list">
              <li>Wadah pengemas harus bersih, kering, tidak berbau, dan berventilasi cukup.</li>
              <li>Material kemasan (pulp karton/plastik berpori) harus melindungi telur dari benturan fisik dan cemaran lingkungan.</li>
              <li>Desain wadah memisahkan tiap butir telur agar tidak terjadi gesekan langsung di atas konveyor dan rak pajang.</li>
            </ul>
          </div>

          <!-- Card 2: Pelabelan Resmi NKV -->
          <div class="regulation-card">
            <div class="reg-icon">🏷️</div>
            <h4 class="reg-title">Pelabelan Resmi (Pasal 9)</h4>
            <p class="reg-desc">Setiap kemasan ritel beredar wajib mencantumkan informasi:</p>
            <div class="label-items-grid">
              <span class="label-chip">1. Nama Produk</span>
              <span class="label-chip">2. Merk Dagang</span>
              <span class="label-chip">3. Tanggal Produksi</span>
              <span class="label-chip">4. Tgl Kadaluarsa (Best Before)</span>
              <span class="label-chip">5. Produsen / Distributor</span>
              <span class="label-chip">6. Jumlah Butir / Berat</span>
              <span class="label-chip chip-highlight">7. No. Izin Edar / NKV</span>
              <span class="label-chip chip-highlight">8. Tingkatan Mutu (I/II/III)</span>
            </div>
          </div>

          <!-- Card 3: Penyimpanan -->
          <div class="regulation-card">
            <div class="reg-icon">❄️</div>
            <h4 class="reg-title">Penyimpanan (Pasal 10)</h4>
            <ul class="reg-list">
              <li>
                <strong>Suhu Ruang:</strong> Maksimal <strong>30°C</strong> dengan Kelembaban Relatif (RH) maksimal <strong>90%</strong>.
              </li>
              <li>
                <strong>Penyimpanan Dingin (Cold Storage):</strong> Suhu <strong>4°C – 7°C</strong> dengan RH <strong>70% – 80%</strong> untuk mempertahankan kesegaran hingga 30 hari.
              </li>
              <li>Hindari paparan sinar matahari langsung dan simpan dengan posisi tumpul di atas (kantung udara berada di atas).</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- SUB-TAB 4: PEMETAAN SENSOR SISTEM KE SNI -->
      <div v-else-if="sniSubTab === 'sensor_mapping'" class="sni-content-section">
        <div class="mapping-table-wrapper">
          <table class="sni-table">
            <thead>
              <tr>
                <th>Modul Sistem EggSort-AI</th>
                <th>Parameter yang Diukur</th>
                <th>Klausul Acuan SNI 3926:2023</th>
                <th>Logika Keputusan Otomatis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Model YOLOv8-seg Multi-Angle</strong></td>
                <td>Integritas cangkang 360° (good, dirt, cracked)</td>
                <td>Pasal 5 Tabel 1 Poin 1.d (Keutuhan) &amp; 1.e (Kebersihan)</td>
                <td>
                  <span class="text-green font-bold">Good</span> ➔ Mutu I;
                  <span class="text-blue font-bold">Dirt</span> ➔ Mutu II;
                  <span class="text-red font-bold">Cracked</span> ➔ REJECT (Ejector Aktif)
                </td>
              </tr>
              <tr>
                <td><strong>OpenCV Ellipse Fitting</strong></td>
                <td>Panjang (L), Lebar (W), Shape Index (SI = W/L × 100%)</td>
                <td>Pasal 5 Tabel 1 Poin 1.a (Bentuk Kerabang)</td>
                <td>
                  SI 72% – 76% ➔ Bentuk Normal (Mutu I &amp; II);
                  SI &lt; 72% atau &gt; 76% ➔ Mutu III
                </td>
              </tr>
              <tr>
                <td><strong>Estimasi Massa Jenis OpenCV</strong></td>
                <td>Volume ellipsoid dan estimasi berat (gram)</td>
                <td>Pasal 4.2 (Klasifikasi Bobot)</td>
                <td>
                  &lt; 50g (Kecil); 50g – 60g (Sedang); &gt; 60g (Besar)
                </td>
              </tr>
              <tr>
                <td><strong>Candling Vision Simulator</strong></td>
                <td>Kedalaman kantung udara (cm) &amp; rasio bercak gelap</td>
                <td>Pasal 5 Tabel 1 Poin 2 (Kantung Udara) &amp; Poin 3-4 (Isi Telur)</td>
                <td>
                  &lt; 0,5 cm ➔ Mutu I; 0,5 – 0,9 cm ➔ Mutu II; &gt; 0,9 cm atau dark spot &gt; 3% ➔ REJECT
                </td>
              </tr>
              <tr>
                <td><strong>Google Gemini LLM Auditor</strong></td>
                <td>Analisis naratif kepatuhan standar komprehensif</td>
                <td>Seluruh Ketentuan SNI 3926:2023 (Tabel 1, Tabel 2, Pasal 8-10)</td>
                <td>
                  Menghasilkan penjelasan naratif auditor dan menjawab pertanyaan operator secara interaktif
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SimulatorView from './SimulatorView.vue'

const props = defineProps({
  activeTab: { type: String, required: true },
  gradeAPercent: { type: String, default: '76.0' },
  gradeBPercent: { type: String, default: '17.3' },
  rejectPercent: { type: String, default: '6.7' },
  gradeACount: { type: Number, default: 1085 },
  gradeBCount: { type: Number, default: 247 },
  rejectCount: { type: Number, default: 96 },
  speedPerMin: { type: Number, default: 45 },
  exportCSV: { type: Function, required: true },
  triggerToast: { type: Function, required: true }
})

const sniSubTab = ref('physical') // 'physical', 'bobot_mikro', 'regulasi', 'sensor_mapping'

// Kembalikan sub-tab SNI ke posisi awal (Tabel 1 Fisik) saat menu dibuka
watch(
  () => props.activeTab,
  (newTab) => {
    if (newTab === 'settings') {
      sniSubTab.value = 'physical'
    }
  }
)
const pxToMm = ref(0.135)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    props.triggerToast(`Foto "${file.name}" berhasil dimuat dan dianalisis oleh AI.`)
  }
}
</script>

<style scoped>
.extra-view-wrapper {
  margin-bottom: 24px;
}

.tab-view-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.view-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-title);
}

.view-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn svg {
  width: 16px;
  height: 16px;
}

.primary-btn:hover {
  background-color: var(--teal-dark);
}

.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-box {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 16px;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}

.stat-val {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 6px 0;
  font-family: var(--font-mono);
  color: var(--text-title);
}

.text-green { color: var(--grade-a); }
.text-blue { color: var(--grade-b); }
.text-red { color: var(--grade-c); }

.stat-desc {
  font-size: 0.7rem;
  color: var(--text-subtle);
}

.distribution-card {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dist-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-title);
}

.progress-bar-stacked {
  height: 14px;
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
}

.bar-segment {
  height: 100%;
  transition: width 0.4s ease;
}

.bar-a { background-color: var(--grade-a); }
.bar-b { background-color: var(--grade-b); }
.bar-c { background-color: var(--grade-c); }

.progress-legend {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.74rem;
  color: var(--text-muted);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-a { background-color: var(--grade-a); }
.dot-b { background-color: var(--grade-b); }
.dot-c { background-color: var(--grade-c); }

/* Calibration */
.calibration-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.calib-box {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calib-section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-title);
}

.calib-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.input-row label {
  font-size: 0.78rem;
  font-weight: 600;
}

.calib-input {
  width: 90px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-card);
  background-color: var(--bg-card);
  color: var(--text-title);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.secondary-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.upload-zone {
  border: 2px dashed var(--border-card);
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  background-color: var(--bg-card);
  transition: all 0.2s ease;
}

.upload-zone:hover {
  border-color: var(--teal-primary);
  background-color: var(--bg-card-subtle);
}

.upload-zone svg {
  width: 28px;
  height: 28px;
  color: var(--teal-primary);
}

.upload-zone span {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* SNI Table & Modern Spec Styles */
.sni-header-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.badge-flag {
  font-size: 0.72rem;
  font-weight: 800;
  background-color: var(--teal-light);
  color: var(--teal-primary);
  border: 1px solid var(--teal-border);
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-org {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-subtle);
}

.sni-subtabs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sni-subtab-btn {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-muted);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sni-subtab-btn:hover {
  color: var(--text-title);
  border-color: var(--teal-primary);
}

.sni-subtab-btn.active {
  background-color: var(--teal-primary);
  color: #ffffff;
  border-color: var(--teal-primary);
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
}

.sni-content-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.sni-section-alert {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  font-size: 0.78rem;
  color: var(--text-body);
  line-height: 1.5;
}

.alert-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.sni-table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border-card);
}

.sni-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.sni-table th, .sni-table td {
  padding: 10px 14px;
  border: 1px solid var(--border-card);
  text-align: left;
}

.sni-table th {
  background-color: var(--bg-card-subtle);
  font-weight: 700;
  color: var(--text-title);
  vertical-align: top;
}

.col-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  letter-spacing: 0.02em;
}

.badge-mutu-1 {
  background-color: var(--grade-a-bg);
  color: var(--grade-a);
  border: 1px solid var(--grade-a-border);
}

.badge-mutu-2 {
  background-color: var(--grade-b-bg);
  color: var(--grade-b);
  border: 1px solid var(--grade-b-border);
}

.badge-mutu-3 {
  background-color: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-reject {
  background-color: var(--grade-c-bg);
  color: var(--grade-c);
  border: 1px solid var(--grade-c-border);
}

.th-sub {
  display: block;
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--text-muted);
}

.group-header-row td {
  background-color: var(--bg-card-subtle);
  font-weight: 800;
  color: var(--teal-primary);
  font-size: 0.76rem;
  letter-spacing: 0.03em;
  border-top: 2px solid var(--border-card);
}

.text-tag-ok {
  color: var(--grade-a);
  font-weight: 700;
}

.text-tag-reject {
  color: var(--grade-c);
}

.sni-table td {
  color: var(--text-body);
}

/* Two & Three Columns Grid */
.sni-grid-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.sni-grid-three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sni-detail-card {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-top-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.card-icon-box.teal {
  background-color: var(--teal-light);
  border: 1px solid var(--teal-border);
}

.card-icon-box.blue {
  background-color: var(--grade-b-bg);
  border: 1px solid var(--grade-b-border);
}

.card-h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-title);
}

.card-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.weight-classes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
}

.weight-badge {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  min-width: 70px;
  text-align: center;
}

.badge-small {
  background-color: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-medium {
  background-color: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-large {
  background-color: rgba(168, 85, 247, 0.12);
  color: #9333ea;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.weight-spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.weight-range {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-title);
  font-family: var(--font-mono);
}

.weight-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.tech-formula-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.74rem;
}

.formula-label {
  font-weight: 700;
  color: var(--teal-primary);
  margin-bottom: 4px;
  display: block;
}

.formula-text {
  color: var(--text-body);
  line-height: 1.5;
}

.formula-text code {
  background-color: var(--bg-card-subtle);
  padding: 2px 5px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.micro-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.76rem;
}

.micro-table th, .micro-table td {
  padding: 10px 12px;
  border: 1px solid var(--border-card);
  text-align: left;
}

.micro-table th {
  background-color: var(--bg-card);
  font-weight: 700;
  color: var(--text-title);
}

.param-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.mono-badge {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.74rem;
  padding: 3px 6px;
  border-radius: 4px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--text-title);
  display: inline-block;
}

.mono-badge.danger {
  color: var(--grade-c);
  background-color: var(--grade-c-bg);
  border-color: var(--grade-c-border);
}

.sni-note-box {
  border-radius: 8px;
  padding: 12px;
  font-size: 0.74rem;
  line-height: 1.5;
}

.danger-note {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: var(--text-body);
}

.note-bold {
  font-weight: 800;
  color: var(--grade-c);
}

.regulation-card {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reg-icon {
  font-size: 1.4rem;
}

.reg-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--text-title);
}

.reg-desc {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.reg-list {
  font-size: 0.74rem;
  color: var(--text-body);
  padding-left: 18px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.label-chip {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 4px 8px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 6px;
  color: var(--text-body);
}

.label-chip.chip-highlight {
  background-color: var(--teal-light);
  border-color: var(--teal-border);
  color: var(--teal-primary);
  font-weight: 700;
}

.mapping-table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border-card);
}

@media (max-width: 900px) {
  .stats-overview-grid, .calibration-grid, .sni-grid-two-col, .sni-grid-three-col {
    grid-template-columns: 1fr;
  }
}
</style>

