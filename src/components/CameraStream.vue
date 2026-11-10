<template>
  <div class="camera-card">
    <!-- Camera Card Header -->
    <div class="camera-header">
      <div class="camera-title-box">
        <svg class="cam-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span class="camera-card-title">Live Camera Feed — ESP32-CAM Stream</span>
      </div>

      <!-- Telemetry Tags -->
      <div class="telemetry-tags">
        <span class="tag-online">ONLINE (1080p @ {{ fps }} FPS)</span>
        <span :class="apiOnline ? 'tag-api-online' : 'tag-api-offline'">
          API: {{ apiOnline ? 'ONLINE (Port 8000)' : 'OFFLINE' }}
        </span>
        <!-- Status ESP32-CAM Stream -->
        <span v-if="isRealStreamOn" class="tag-esp32-live">
          <span class="tag-live-dot"></span>ESP32-CAM ONLINE // {{ fps }} FPS
        </span>
        <span v-else-if="streamConnecting" class="tag-esp32-connecting">
          ESP32-CAM CONNECTING…
        </span>
        <span v-else class="tag-esp32-offline">
          ESP32-CAM OFFLINE
        </span>
        <span class="tag-metric">Lat: {{ latency }}ms</span>
        <span class="tag-metric">LED: {{ isLedOn ? 'ON' : 'OFF' }}</span>
      </div>
    </div>

    <!-- Live Viewport Area -->
    <div class="viewport-wrapper" :class="{ 'snapshot-flash': isSnapshotting }">
      <!-- Conveyor Roller Background Simulation -->
      <div class="conveyor-rollers">
        <div class="roller r1"></div>
        <div class="roller r2"></div>
        <div class="roller r3"></div>
        <div class="roller r4"></div>
      </div>

      <!-- ═══ ESP32-CAM REAL LIVESTREAM ═══ -->
      <!-- MJPEG polling layer — tampil di belakang HUD -->
      <img
        v-if="isRealStreamOn && liveFrameSrc"
        :src="liveFrameSrc"
        class="esp32-live-img"
        alt="ESP32-CAM Live"
        @error="handleStreamError"
      />

      <!-- Pesan koneksi / error stream -->
      <div v-if="streamConnecting" class="stream-status-overlay">
        <div class="stream-spinner"></div>
        <span>Menghubungkan ke ESP32-CAM…</span>
        <small>{{ esp32Url }}</small>
      </div>
      <div v-else-if="streamError && isRealStreamOn" class="stream-status-overlay stream-error">
        <span>⚠️ Frame Drop — Menyambung ulang…</span>
      </div>

      <!-- Egg Target Visualizer (simulasi — disembunyikan saat real stream aktif) -->
      <div
        v-if="!isRealStreamOn"
        class="egg-stage"
        :class="streamMode"
        @click="$emit('open-detail')"
        title="Klik untuk membuka pop-up detail inspeksi"
        style="cursor: pointer;"
      >
        <!-- Candling Light Beam (Visible in candling mode) -->
        <div v-if="streamMode === 'candling'" class="candling-beam"></div>

        <!-- Real Image Preview (jika ada gambar dari API) -->
        <div v-if="currentEgg.imageUrl" class="real-egg-wrapper">
          <img :src="currentEgg.imageUrl" class="real-egg-img" alt="Citra Telur Terdeteksi" />
        </div>

        <!-- Egg Silhouette & Texture (Simulasi Bawaan) -->
        <div v-else class="egg-model" :class="[streamMode, currentEgg.grade.toLowerCase().replace(' ', '-')]">
          <!-- Candling Interior Features -->
          <div v-if="streamMode === 'candling'" class="air-cell-visual" :style="{ height: `${Math.min(36, currentEgg.airDepthCm * 30)}px` }">
            <span class="air-cell-label">Kantung Udara: {{ currentEgg.airDepthCm }}cm</span>
          </div>
          <div v-if="streamMode === 'candling'" class="yolk-shadow"></div>

          <!-- Defect Mark (if cracked or dirt) -->
          <div v-if="currentEgg.yoloDefectClass === 'cracked'" class="defect-crack-mark">
            <svg viewBox="0 0 100 100" class="crack-svg">
              <path d="M45,20 L52,40 L44,55 L58,75 L49,90" stroke="#ff4757" stroke-width="2.5" fill="none" stroke-linecap="round" />
            </svg>
          </div>
          <div v-if="currentEgg.yoloDefectClass === 'dirt'" class="defect-dirt-spot"></div>
        </div>
      </div>

      <!-- AI Bounding Box & HUD Reticle — selalu tampil di atas stream/simulasi -->
      <div
        class="bounding-box"
        :class="[currentEgg.grade.toLowerCase().replace(' ', '-'), { 'bounding-box-stream': isRealStreamOn }]"
        @click="$emit('open-detail')"
        style="cursor: pointer;"
      >
        <!-- Corner brackets -->
        <span class="corner tl"></span>
        <span class="corner tr"></span>
        <span class="corner bl"></span>
        <span class="corner br"></span>

        <!-- Crosshairs -->
        <div class="crosshair-h"></div>
        <div class="crosshair-v"></div>

        <!-- Detection Tag -->
        <div class="hud-label-top">
          <span class="label-class">{{ currentEgg.yoloDefectClass === 'good' ? 'EGG-OBJECT' : currentEgg.yoloDefectClass.toUpperCase() }}</span>
          <span class="label-conf">{{ currentEgg.confidence }}%</span>
        </div>

        <!-- Vertical scale bar -->
        <div class="hud-scale-bar">
          <span>58.2mm</span>
        </div>
      </div>

      <!-- Scanline Laser Effect -->
      <div class="scanline-effect"></div>

      <!-- Dark Chamber Vignette -->
      <div class="chamber-vignette"></div>

      <!-- Viewport Bottom Overlay Status Bar -->
      <div class="viewport-hud-bottom">
        <div class="hud-left">
          <span class="hud-tag">Model: YOLOv8-seg (Instance Segmentation)</span>
          <span class="hud-sep">•</span>
          <span class="hud-tag">Inf: {{ inferenceTime }}ms</span>
          <span class="hud-sep">•</span>
          <span class="hud-tag">Pipeline: OpenCV CLAHE → YOLOv8-seg</span>
        </div>
        <div class="hud-right">
          <span class="hud-tag lock-tag">
            <span class="hud-lock-dot"></span> Auto-Focus Lock (F/2.2)
          </span>
        </div>
      </div>
    </div>

    <!-- Camera Control Bar -->
    <div class="camera-controls">
      <div class="ctrl-buttons">
        <!-- Tombol Unggah Citra Real untuk Uji API YOLOv8 & OpenCV -->
        <button
          class="cam-btn cam-btn-api"
          :disabled="apiLoading"
          @click="triggerFileInput"
          title="Unggah foto telur asli untuk dianalisis langsung oleh model YOLOv8 & OpenCV"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{{ apiLoading ? 'Memproses API...' : '⚡ Uji Citra Real (API)' }}</span>
        </button>
        <input
          type="file"
          ref="fileInputRef"
          accept="image/*"
          multiple
          style="display: none;"
          @change="onFileSelected"
        />

        <!-- ═══ Tombol ESP32-CAM LIVESTREAM ═══ -->
        <button
          class="cam-btn"
          :class="{
            'cam-btn-esp32-on':  isRealStreamOn,
            'cam-btn-esp32-off': !isRealStreamOn && !streamConnecting,
            'cam-btn-esp32-connecting': streamConnecting
          }"
          @click="toggleEsp32Stream"
          :title="isRealStreamOn ? `Hentikan stream ESP32-CAM (${esp32Url})` : `Hubungkan ke ESP32-CAM (${esp32Url})`"
        >
          <!-- Ikon kamera ESP32 -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <span v-if="streamConnecting">Menghubungkan…</span>
          <span v-else-if="isRealStreamOn">🔴 LIVE – Hentikan Stream</span>
          <span v-else>📹 Hubungkan ESP32-CAM</span>
          <!-- Dot indikator live -->
          <span v-if="isRealStreamOn" class="live-dot"></span>
        </button>

        <button class="cam-btn" @click="takeSnapshot" title="Ambil cuplikan gambar saat ini">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>Snapshot Manual</span>
        </button>

        <button class="cam-btn mode-switch-btn" @click="toggleStreamMode" :title="`Beralih ke mode ${streamMode === 'top' ? 'Candling' : 'Top-Light'}`">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
          </svg>
          <span>Stream: {{ streamMode === 'top' ? 'Top-Light (Cangkang)' : 'Candling (Interior)' }}</span>
        </button>

        <button class="cam-btn cam-btn-inspect" @click="$emit('open-detail')" title="Buka Pop-up Detail Telur Terdeteksi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>Detail Telur</span>
        </button>

        <button class="cam-btn" @click="triggerToast('Kalibrasi titik fokus lensa selesai (F/2.2 - locked)')" title="Kalibrasi auto-fokus dan exposure">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <span>Kalibrasi Titik Fokus</span>
        </button>
      </div>

      <div class="camera-id-text">
        Camera ID: <code>ESP32-CAM-01A</code>
        <span v-if="isRealStreamOn" class="esp32-ip-badge">{{ esp32Url }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['open-detail'])
const props = defineProps({
  fps: { type: [Number, String], default: 29.8 },
  latency: { type: [Number, String], default: 14 },
  inferenceTime: { type: [Number, String], default: 14.2 },
  isLedOn: { type: Boolean, default: true },
  streamMode: { type: String, default: 'top' },
  toggleStreamMode: { type: Function, required: true },
  takeSnapshot: { type: Function, required: true },
  isSnapshotting: { type: Boolean, default: false },
  currentEgg: { type: Object, required: true },
  triggerToast: { type: Function, required: true },
  apiOnline: { type: Boolean, default: false },
  apiLoading: { type: Boolean, default: false },
  scanRealEgg: { type: Function, default: null },
  // ── ESP32-CAM Live Stream ──
  esp32Url: { type: String, default: 'http://192.168.1.13' }
})

// ── File upload (uji API YOLOv8) ──
const fileInputRef = ref(null)
const triggerFileInput = () => {
  if (fileInputRef.value) fileInputRef.value.click()
}
const onFileSelected = async (event) => {
  const files = event.target.files
  if (!files || !files.length) return
  if (props.scanRealEgg) {
    props.triggerToast(`Mengirim ${files.length} citra ke server YOLOv8...`)
    const previewUrl = URL.createObjectURL(files[0])
    try {
      await props.scanRealEgg(Array.from(files), previewUrl)
    } catch (err) {
      console.error(err)
    }
  } else {
    props.triggerToast('Fungsi scan API belum terhubung.')
  }
  event.target.value = ''
}

// ── ESP32-CAM Live Stream State ──
const isRealStreamOn  = ref(false)
const liveFrameSrc    = ref('')
const streamError     = ref(false)
const streamConnecting = ref(false)
let   streamInterval  = null

/** Mulai polling JPEG dari ESP32-CAM setiap 150 ms */
const startEsp32Stream = () => {
  if (streamInterval) return
  streamConnecting.value = true
  streamError.value      = false

  // Frame pertama — test koneksi
  const testImg = new Image()
  testImg.onload = () => {
    streamConnecting.value = false
    isRealStreamOn.value   = true
    props.triggerToast(`📹 ESP32-CAM terhubung: ${props.esp32Url}`)
    streamInterval = setInterval(() => {
      liveFrameSrc.value = `${props.esp32Url}/capture?_cb=${Date.now()}`
    }, 150)
  }
  testImg.onerror = () => {
    streamConnecting.value = false
    streamError.value      = true
    props.triggerToast(`⚠️ Gagal terhubung ke ESP32-CAM (${props.esp32Url})`)
  }
  testImg.src = `${props.esp32Url}/capture?_cb=${Date.now()}`
}

/** Hentikan stream */
const stopEsp32Stream = () => {
  if (streamInterval) { clearInterval(streamInterval); streamInterval = null }
  isRealStreamOn.value = false
  liveFrameSrc.value   = ''
  streamError.value    = false
  props.triggerToast('📹 ESP32-CAM stream dihentikan.')
}

const toggleEsp32Stream = () => {
  if (isRealStreamOn.value || streamConnecting.value) stopEsp32Stream()
  else startEsp32Stream()
}

const handleStreamError = () => {
  // Frame error sementara — jangan langsung matikan, coba lagi di interval berikutnya
  streamError.value = true
  setTimeout(() => { streamError.value = false }, 2000)
}

onUnmounted(() => {
  if (streamInterval) clearInterval(streamInterval)
})
</script>

<style scoped>
.camera-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.2s ease;
}

.camera-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.camera-title-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cam-icon {
  width: 18px;
  height: 18px;
  color: var(--teal-primary);
}

.camera-card-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-title);
}

.telemetry-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
}

.tag-online {
  color: var(--teal-primary);
  background-color: var(--teal-light);
  border: 1px solid var(--teal-border);
  padding: 2px 8px;
  border-radius: 4px;
}

.tag-metric {
  color: var(--text-muted);
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 2px 8px;
  border-radius: 4px;
}

.tag-api-online {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.tag-api-offline {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

/* ── ESP32-CAM telemetry tags ── */
.tag-esp32-live {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #34d399;
  background-color: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.35);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.tag-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 5px #34d399;
  animation: blink-dot 1s ease-in-out infinite;
  flex-shrink: 0;
}

.tag-esp32-connecting {
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.35);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  animation: pulse-connecting 1s ease-in-out infinite;
}

.tag-esp32-offline {
  color: #64748b;
  background-color: rgba(100, 116, 139, 0.1);
  border: 1px solid rgba(100, 116, 139, 0.25);
  padding: 2px 8px;
  border-radius: 4px;
}

.real-egg-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.real-egg-img {
  max-width: 170px;
  max-height: 230px;
  object-fit: contain;
  border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.cam-btn-api {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: #ffffff !important;
  border: none !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.cam-btn-api:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857) !important;
  transform: translateY(-1px);
}

.cam-btn-api svg {
  color: #ffffff !important;
}

/* Viewport Area */
.viewport-wrapper {
  position: relative;
  width: 100%;
  height: 380px;
  background-color: #0b111e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
}

.snapshot-flash {
  animation: flash-anim 0.4s ease-out;
}

@keyframes flash-anim {
  0% {
    filter: brightness(2.5) contrast(1.5);
  }
  100% {
    filter: brightness(1) contrast(1);
  }
}

/* Conveyor Rollers Simulation */
.conveyor-rollers {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  opacity: 0.2;
  pointer-events: none;
}

.roller {
  width: 28px;
  background: linear-gradient(90deg, #1e293b, #475569, #1e293b);
  border-left: 1px solid #0f172a;
  border-right: 1px solid #0f172a;
}

/* Egg Stage & Rendering */
.egg-stage {
  position: relative;
  width: 220px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.egg-model {
  width: 130px;
  height: 180px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform: rotate(-90deg);
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

/* Top-Light (Surface Cangkang) */
.egg-model.top {
  background: radial-gradient(circle at 35% 35%, #fce7cf 0%, #e2b083 45%, #9a6538 90%);
}

/* Candling (Interior Translucent Amber Glow) */
.egg-model.candling {
  background: radial-gradient(circle at 50% 50%, #fff7ed 0%, #fb923c 40%, #c2410c 80%, #7c2d12 100%);
  box-shadow: 0 0 50px rgba(251, 146, 60, 0.8), inset 0 0 30px rgba(255, 237, 213, 0.6);
}

.candling-beam {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%);
  filter: blur(20px);
  z-index: 5;
}

.air-cell-visual {
  position: absolute;
  top: 4px;
  left: 20px;
  right: 20px;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.25);
  border-radius: 40% 40% 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.air-cell-label {
  font-size: 0.55rem;
  color: #ffffff;
  font-family: var(--font-mono);
  font-weight: 700;
  text-shadow: 0 1px 2px #000;
  transform: rotate(90deg);
}

.yolk-shadow {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, #ea580c 0%, #9a3412 80%);
  top: 45%;
  left: 35%;
  filter: blur(6px);
  opacity: 0.85;
}

.defect-crack-mark {
  position: absolute;
  top: 25px;
  left: 25px;
  width: 70px;
  height: 70px;
  transform: rotate(90deg);
}

.crack-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 3px #ff4757);
}

.defect-dirt-spot {
  position: absolute;
  width: 16px;
  height: 22px;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  background: #3e2723;
  top: 60px;
  left: 70px;
  filter: blur(1px);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}

/* ═══ ESP32-CAM REAL STREAM STYLES ═══ */

/* Gambar JPEG dari ESP32 yang mengisi penuh viewport */
.esp32-live-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 6;
  image-rendering: auto;
}

/* Overlay saat koneksi / error */
.stream-status-overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(10, 15, 26, 0.75);
  backdrop-filter: blur(4px);
  color: #94a3b8;
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.stream-status-overlay small {
  font-size: 0.65rem;
  color: #475569;
}

.stream-error {
  color: #f87171;
}

/* Spinner animasi saat connecting */
.stream-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tombol ESP32 — state OFF */
.cam-btn-esp32-off {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-color: rgba(99, 102, 241, 0.4) !important;
  color: #818cf8 !important;
}
.cam-btn-esp32-off svg {
  color: #818cf8 !important;
}
.cam-btn-esp32-off:hover {
  background-color: rgba(99, 102, 241, 0.2) !important;
}

/* Tombol ESP32 — state LIVE ON */
.cam-btn-esp32-on {
  background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
  border-color: #ef4444 !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.35);
}
.cam-btn-esp32-on svg {
  color: #ffffff !important;
}

/* Tombol ESP32 — state CONNECTING */
.cam-btn-esp32-connecting {
  background-color: rgba(234, 179, 8, 0.12) !important;
  border-color: rgba(234, 179, 8, 0.4) !important;
  color: #fbbf24 !important;
  animation: pulse-connecting 1s ease-in-out infinite;
}
.cam-btn-esp32-connecting svg {
  color: #fbbf24 !important;
}
@keyframes pulse-connecting {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

/* Dot merah berkedip saat LIVE */
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff4757;
  box-shadow: 0 0 6px #ff4757;
  animation: blink-dot 1s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes blink-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
}

/* Badge IP di bawah camera-id */
.esp32-ip-badge {
  margin-left: 8px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 1px 6px;
  border-radius: 4px;
}

/* Bounding Box — saat real stream: posisi absolute langsung di viewport (z-index tinggi) */
.bounding-box-stream {
  z-index: 25 !important;
  pointer-events: auto;
  cursor: pointer;
}

/* Bounding Box HUD */
.bounding-box {
  position: absolute;
  width: 200px;
  height: 160px;
  border: 1px solid rgba(16, 185, 129, 0.4);
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 15;
}

.bounding-box.grade-a {
  border-color: rgba(16, 185, 129, 0.6);
}

.bounding-box.grade-b {
  border-color: rgba(59, 130, 246, 0.6);
}

.bounding-box.reject {
  border-color: rgba(239, 68, 68, 0.8);
}

.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: #10b981;
}

.bounding-box.grade-b .corner {
  border-color: #3b82f6;
}

.bounding-box.reject .corner {
  border-color: #ef4444;
}

.corner.tl {
  top: -2px;
  left: -2px;
  border-top: 3px solid;
  border-left: 3px solid;
}

.corner.tr {
  top: -2px;
  right: -2px;
  border-top: 3px solid;
  border-right: 3px solid;
}

.corner.bl {
  bottom: -2px;
  left: -2px;
  border-bottom: 3px solid;
  border-left: 3px solid;
}

.corner.br {
  bottom: -2px;
  right: -2px;
  border-bottom: 3px solid;
  border-right: 3px solid;
}

.hud-label-top {
  position: absolute;
  top: -24px;
  left: -2px;
  background-color: rgba(16, 185, 129, 0.85);
  color: #ffffff;
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.bounding-box.grade-b .hud-label-top {
  background-color: rgba(59, 130, 246, 0.85);
}

.bounding-box.reject .hud-label-top {
  background-color: rgba(239, 68, 68, 0.85);
}

.hud-scale-bar {
  position: absolute;
  right: -36px;
  top: 10px;
  bottom: 10px;
  border-right: 1.5px dashed rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  font-size: 0.58rem;
  color: #94a3b8;
  font-family: var(--font-mono);
  padding-right: 4px;
}

.hud-scale-bar span {
  transform: rotate(90deg);
}

.crosshair-h {
  position: absolute;
  top: 50%;
  left: -8px;
  right: -8px;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.crosshair-v {
  position: absolute;
  left: 50%;
  top: -8px;
  bottom: -8px;
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.chamber-vignette {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.85);
  pointer-events: none;
}

/* Viewport Bottom Overlay Bar */
.viewport-hud-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 15, 26, 0.85);
  backdrop-filter: blur(4px);
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #cbd5e1;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 20;
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-sep {
  color: #475569;
}

.lock-tag {
  color: #34d399;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hud-lock-dot {
  width: 5px;
  height: 5px;
  background-color: #34d399;
  border-radius: 50%;
}

/* Camera Controls */
.camera-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.ctrl-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cam-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 7px 12px;
  border-radius: 7px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cam-btn:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.cam-btn svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.mode-switch-btn {
  background-color: var(--teal-light);
  border-color: var(--teal-border);
  color: var(--teal-primary);
}

.mode-switch-btn svg {
  color: var(--teal-primary);
}

.camera-id-text {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.camera-id-text code {
  font-family: var(--font-mono);
  color: var(--teal-primary);
  font-weight: 700;
}

@media (max-width: 768px) {
  .viewport-hud-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>

