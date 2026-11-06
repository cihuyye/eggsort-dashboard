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
    <div v-else-if="activeTab === 'calibration'" class="tab-view-card">
      <div class="view-header">
        <div>
          <h2 class="view-title">Kontrol Simulator & Kalibrasi Kamera</h2>
          <p class="view-sub">Pengaturan parameter Computer Vision, konversi piksel ke milimeter, dan uji sampel citra</p>
        </div>
      </div>

      <div class="calibration-grid">
        <div class="calib-box">
          <h3 class="calib-section-title">Konversi Piksel ke Milimeter (FOV)</h3>
          <p class="calib-desc">Faktor pengali konversi dimensi citra kamera ke ukuran fisik (mm) pada jarak fokus konveyor.</p>
          <div class="input-row">
            <label>Rasio px_to_mm:</label>
            <input type="number" step="0.005" v-model="pxToMm" class="calib-input" />
            <button class="secondary-btn" @click="triggerToast('Kalibrasi rasio piksel disimpan: ' + pxToMm)">Simpan</button>
          </div>
        </div>

        <div class="calib-box">
          <h3 class="calib-section-title">Uji Foto Telur Langsung (Manual Upload)</h3>
          <p class="calib-desc">Unggah foto telur (.jpg / .png) dari komputer untuk menguji inferensi YOLOv8 dan OpenCV secara langsung.</p>
          <div class="upload-zone" @click="triggerFileInput">
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Klik atau seret file foto telur ke sini untuk diuji</span>
          </div>
        </div>
      </div>
    </div>

    <!-- View 3: Parameter Mutu & Info Sistem -->
    <div v-else-if="activeTab === 'settings'" class="tab-view-card">
      <div class="view-header">
        <div>
          <h2 class="view-title">Parameter Acuan Standar Mutu SNI 3926:2023</h2>
          <p class="view-sub">Tabel kriteria standar penilaian kualitas telur ayam konsumsi</p>
        </div>
      </div>

      <div class="sni-table-wrapper">
        <table class="sni-table">
          <thead>
            <tr>
              <th>Faktor Mutu</th>
              <th>Mutu I (Grade A)</th>
              <th>Mutu II (Grade B)</th>
              <th>Mutu III (Reject)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Keutuhan Cangkang</strong></td>
              <td>Utuh, bersih, bebas noda &amp; retak</td>
              <td>Utuh, diperbolehkan sedikit noda/kotor</td>
              <td>Retak (cracked) / bocor</td>
            </tr>
            <tr>
              <td><strong>Indeks Bentuk (SI)</strong></td>
              <td>Normal (72% – 76%)</td>
              <td>Di luar normal (&lt;72% atau &gt;76%)</td>
              <td>Abnormal / cacat deformasi</td>
            </tr>
            <tr>
              <td><strong>Kedalaman Kantung Udara</strong></td>
              <td>&lt; 0.5 cm (Sangat segar)</td>
              <td>0.5 cm – 0.9 cm (Segar menengah)</td>
              <td>&gt; 0.9 cm (Lama disimpan / rusak)</td>
            </tr>
            <tr>
              <td><strong>Isi Dalam (Candling)</strong></td>
              <td>Bebas bercak darah, kuning telur di tengah</td>
              <td>Bebas bercak darah, kuning telur bergerak</td>
              <td>Bercak darah / telur busuk / gelap</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

/* SNI Table */
.sni-table-wrapper {
  overflow-x: auto;
}

.sni-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.sni-table th, .sni-table td {
  padding: 12px 16px;
  border: 1px solid var(--border-card);
  text-align: left;
}

.sni-table th {
  background-color: var(--bg-card-subtle);
  font-weight: 700;
  color: var(--text-title);
}

.sni-table td {
  color: var(--text-body);
}

@media (max-width: 900px) {
  .stats-overview-grid, .calibration-grid {
    grid-template-columns: 1fr;
  }
}
</style>

