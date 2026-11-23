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
        <span class="tag-metric" :class="{ 'tag-metric-highlight': isEspLedOn }">
          LED: {{ (isRealStreamOn ? isEspLedOn : isLedOn) ? 'ON' : 'OFF' }}
        </span>
      </div>
    </div>

    <!-- Main Camera Content Layout: Left Viewport (4:3) & Right Control Panel -->
    <div class="camera-body-grid">
      <!-- Left: Real Camera Viewport (Aspek Rasio Rill 4:3) -->
      <div class="viewport-wrapper" :class="{ 'snapshot-flash': isSnapshotting }">
        <!-- Conveyor Roller Background Simulation -->
        <div class="conveyor-rollers">
          <div class="roller r1"></div>
          <div class="roller r2"></div>
          <div class="roller r3"></div>
          <div class="roller r4"></div>
        </div>

        <!-- ═══ ESP32-CAM REAL LIVESTREAM (4:3 Rill) ═══ -->
        <img
          v-if="isRealStreamOn && liveFrameSrc"
          :src="liveFrameSrc"
          class="esp32-live-img"
          alt="ESP32-CAM Live"
          @load="onFrameLoaded"
          @error="handleStreamError"
        />

        <!-- Pesan koneksi / error stream -->
        <div v-if="streamConnecting" class="stream-status-overlay">
          <div class="stream-spinner"></div>
          <span>Menghubungkan ke ESP32-CAM…</span>
          <small>{{ currentEsp32Url }}</small>
        </div>
        <div v-else-if="streamError && isRealStreamOn" class="stream-status-overlay stream-error">
          <span>⚠️ Frame Drop / Terputus — Menyambung ulang ke {{ currentEsp32Url }}…</span>
        </div>

        <!-- Egg Target Visualizer (tampil jika real stream tidak aktif ATAU frame belum siap) -->
        <div
          v-if="!isRealStreamOn || (!hasReceivedFrame && !streamConnecting)"
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
            <span class="label-class">{{ currentEgg.grade === 'BUKAN TELUR' ? 'BUKAN TELUR' : (currentEgg.yoloDefectClass === 'good' ? 'EGG-OBJECT' : currentEgg.yoloDefectClass.toUpperCase()) }}</span>
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
            <span class="hud-tag">Model: YOLOv8-seg</span>
            <span class="hud-sep">•</span>
            <span class="hud-tag">Inf: {{ inferenceTime }}ms</span>
            <span class="hud-sep">•</span>
            <span class="hud-tag">Pipeline: CLAHE → YOLOv8</span>
          </div>
          <div class="hud-right">
            <span class="hud-tag lock-tag">
              <span class="hud-lock-dot"></span> Auto-Focus (F/2.2)
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Side Action Controls Panel -->
      <div class="camera-side-panel">
        <div class="side-panel-header">
          <span class="side-title">Kontrol Kamera & AI</span>
          <span
            class="esp32-ip-badge"
            @click="updateEsp32Url"
            title="Klik untuk mengubah URL/IP ESP32-CAM"
            style="cursor: pointer;"
          >
            {{ currentEsp32Url }} ✎
          </span>
        </div>

        <div class="side-panel-buttons">
          <!-- ═══ Tombol ESP32-CAM LIVESTREAM ═══ -->
          <button
            class="cam-btn side-btn"
            :class="{
              'cam-btn-esp32-on':  isRealStreamOn,
              'cam-btn-esp32-off': !isRealStreamOn && !streamConnecting,
              'cam-btn-esp32-connecting': streamConnecting
            }"
            @click="toggleEsp32Stream"
            :title="isRealStreamOn ? `Hentikan stream ESP32-CAM (${currentEsp32Url})` : `Hubungkan ke ESP32-CAM (${currentEsp32Url})`"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span v-if="streamConnecting">Menghubungkan…</span>
            <span v-else-if="isRealStreamOn">🔴 LIVE – Hentikan</span>
            <span v-else>📹 Hubungkan Stream</span>
            <span v-if="isRealStreamOn" class="live-dot"></span>
          </button>

          <!-- ═══ Tombol KONTROL LAMPU FLASH ESP32-CAM (GPIO 4) ═══ -->
          <button
            v-if="isRealStreamOn"
            class="cam-btn side-btn"
            :class="{ 'cam-btn-led-on': isEspLedOn, 'cam-btn-led-off': !isEspLedOn }"
            @click="toggleEspLed"
            :title="isEspLedOn ? 'Matikan Lampu Flash LED (GPIO 4)' : 'Nyalakan Lampu Flash LED (GPIO 4)'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v1m0 18v1M4.22 4.22l.71.71m14.14 14.14l.71.71M1 12h1m18 0h1M4.22 19.78l.71-.71m14.14-14.14l.71-.71M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
            </svg>
            <span>{{ isEspLedOn ? '💡 Flash LED: ON' : '💡 Flash LED: OFF' }}</span>
          </button>

          <!-- ═══ Tombol AUTO AI INSPECT (YOLOv8 + OpenCV) ═══ -->
          <button
            v-if="isRealStreamOn"
            class="cam-btn side-btn"
            :class="{ 'cam-btn-ai-active': isAutoAiActive, 'cam-btn-ai-inactive': !isAutoAiActive }"
            @click="toggleAutoAi"
            :title="isAutoAiActive ? 'Hentikan inspeksi AI otomatis berkala' : 'Aktifkan inspeksi YOLOv8 otomatis dari frame ESP32'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
            <span>{{ isAutoAiActive ? '🤖 Auto AI (Aktif)' : '🤖 Auto AI (Mati)' }}</span>
            <span v-if="isInferencing" class="infer-spinner"></span>
          </button>

          <!-- ═══ Tombol SCAN SATU FRAME INI ═══ -->
          <button
            v-if="isRealStreamOn"
            class="cam-btn side-btn"
            :disabled="isInferencing"
            @click="inspectCurrentFrame"
            title="Ambil frame saat ini dan kirim ke YOLOv8 untuk grading langsung"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{{ isInferencing ? 'Menganalisis...' : '🎯 Scan Frame Ini' }}</span>
          </button>

          <!-- Tombol Unggah Citra Real untuk Uji API YOLOv8-seg & OpenCV -->
          <button
            class="cam-btn side-btn cam-btn-api"
            :disabled="apiLoading"
            @click="triggerFileInput"
            title="Unggah foto telur asli untuk dianalisis langsung oleh model YOLOv8-seg & OpenCV"
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

          <button class="cam-btn side-btn" @click="takeSnapshot" title="Ambil cuplikan gambar saat ini">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>Snapshot Manual</span>
          </button>

          <button class="cam-btn side-btn mode-switch-btn" @click="toggleStreamMode" :title="`Beralih ke mode ${streamMode === 'top' ? 'Candling' : 'Top-Light'}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
            </svg>
            <span>Stream: {{ streamMode === 'top' ? 'Top-Light' : 'Candling' }}</span>
          </button>

          <button class="cam-btn side-btn cam-btn-inspect" @click="$emit('open-detail')" title="Buka Pop-up Detail Telur Terdeteksi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Detail Telur</span>
          </button>

          <button class="cam-btn side-btn" @click="triggerToast('Kalibrasi titik fokus lensa selesai (F/2.2 - locked)')" title="Kalibrasi auto-fokus dan exposure">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            <span>Kalibrasi Fokus</span>
          </button>
        </div>

        <div class="side-panel-footer">
          <span>Camera ID: <code>ESP32-CAM-01A</code></span>
        </div>
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
  esp32Url: { type: String, default: 'http://192.168.18.141' }
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
    props.triggerToast(`Mengirim ${files.length} citra ke server YOLOv8-seg...`)
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
const currentEsp32Url = ref(localStorage.getItem('eggsort_esp32_url') || props.esp32Url || 'http://192.168.1.13')
const isRealStreamOn  = ref(false)
const hasReceivedFrame = ref(false)
const liveFrameSrc    = ref('')
const streamError     = ref(false)
const streamConnecting = ref(false)
const isEspLedOn      = ref(false)
let   streamInterval  = null

const onFrameLoaded = () => {
  hasReceivedFrame.value = true
  streamError.value = false
}

const toggleEspLed = async () => {
  try {
    const nextState = !isEspLedOn.value
    const res = await fetch(`${currentEsp32Url.value}/led?status=${nextState ? '1' : '0'}`)
    if (res.ok) {
      isEspLedOn.value = nextState
      props.triggerToast(`💡 Lampu Flash ESP32: ${isEspLedOn.value ? 'ON' : 'OFF'}`)
    } else {
      throw new Error(`HTTP ${res.status}`)
    }
  } catch (err) {
    console.warn('[ESP32 LED Error]:', err)
    props.triggerToast(`⚠️ Gagal mengubah status LED Flash (${err.message})`)
  }
}

const updateEsp32Url = () => {
  const newUrl = prompt('Masukkan URL / IP ESP32-CAM:', currentEsp32Url.value)
  if (newUrl && newUrl.trim()) {
    currentEsp32Url.value = newUrl.trim()
    localStorage.setItem('eggsort_esp32_url', currentEsp32Url.value)
    props.triggerToast(`IP ESP32 diubah ke: ${currentEsp32Url.value}`)
    if (isRealStreamOn.value) {
      stopEsp32Stream()
      startEsp32Stream()
    }
  }
}

// ── Realtime Auto AI Inspection State ──
const isAutoAiActive = ref(false)
const isInferencing = ref(false)
let   autoAiTimer   = null

/** Ambil 1 frame dari ESP32 lalu kirim ke YOLOv8-seg API */
const inspectCurrentFrame = async () => {
  if (isInferencing.value || !props.scanRealEgg) return
  
  try {
    isInferencing.value = true
    const captureUrl = `${currentEsp32Url.value}/capture?_cb=${Date.now()}`
    
    // Fetch blob citra langsung dari ESP32
    const res = await fetch(captureUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const blob = await res.blob()
    
    const file = new File([blob], `esp32_egg_${Date.now()}.jpg`, { type: 'image/jpeg' })
    const previewUrl = URL.createObjectURL(blob)
    
    await props.scanRealEgg([file], previewUrl)
  } catch (err) {
    console.warn('[Auto AI Inspect Error]:', err)
  } finally {
    isInferencing.value = false
  }
}

/** Toggle mode Auto AI Inspect */
const toggleAutoAi = () => {
  if (!props.apiOnline) {
    props.triggerToast('⚠️ Backend Flask (Port 8000) belum ONLINE!')
    return
  }

  isAutoAiActive.value = !isAutoAiActive.value
  
  if (isAutoAiActive.value) {
    if (!isRealStreamOn.value) {
      startEsp32Stream()
    }
    props.triggerToast('🤖 Auto AI Inspect DIAKTIFKAN (Inferensi berkala)')
    // Jalankan pertama kali langsung
    inspectCurrentFrame()
    // Ulangi setiap 1800ms agar ESP32-CAM Non-PSRAM & GPU/CPU tetap stabil & dingin
    autoAiTimer = setInterval(() => {
      if (isRealStreamOn.value && !isInferencing.value) {
        inspectCurrentFrame()
      }
    }, 1800)
  } else {
    if (autoAiTimer) {
      clearInterval(autoAiTimer)
      autoAiTimer = null
    }
    props.triggerToast('Auto AI Inspect DINONAKTIFKAN')
  }
}

/** Mulai polling JPEG dari ESP32-CAM setiap 150 ms */
const startEsp32Stream = () => {
  if (streamInterval) return
  streamConnecting.value = true
  streamError.value      = false
  hasReceivedFrame.value = false

  // Frame pertama — test koneksi
  const testImg = new Image()
  testImg.onload = () => {
    streamConnecting.value = false
    isRealStreamOn.value   = true
    hasReceivedFrame.value = true
    props.triggerToast(`📹 ESP32-CAM terhubung: ${currentEsp32Url.value}`)
    streamInterval = setInterval(() => {
      liveFrameSrc.value = `${currentEsp32Url.value}/capture?_cb=${Date.now()}`
    }, 180)
  }
  testImg.onerror = () => {
    streamConnecting.value = false
    streamError.value      = true
    isRealStreamOn.value   = false
    props.triggerToast(`⚠️ Gagal terhubung ke ESP32-CAM (${currentEsp32Url.value}). Cek apakah satu WiFi.`)
  }
  testImg.src = `${currentEsp32Url.value}/capture?_cb=${Date.now()}`
}

/** Hentikan stream */
const stopEsp32Stream = () => {
  if (autoAiTimer) {
    clearInterval(autoAiTimer)
    autoAiTimer = null
    isAutoAiActive.value = false
  }
  if (streamInterval) { clearInterval(streamInterval); streamInterval = null }
  isRealStreamOn.value = false
  hasReceivedFrame.value = false
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
  if (autoAiTimer) clearInterval(autoAiTimer)
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

/* ═══ Main Camera Layout (Grid 2 Kolom: Kiri 4:3 Viewport & Kanan Panel Kontrol) ═══ */
.camera-body-grid {
  display: grid;
  grid-template-columns: 1fr 290px;
  gap: 18px;
  align-items: stretch;
}

@media (max-width: 1080px) {
  .camera-body-grid {
    grid-template-columns: 1fr;
  }
}

/* Viewport Area (Rill 4:3 Aspek Rasio Kamera ESP32-CAM 640x480) */
.viewport-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 480px;
  background-color: #0b111e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.85);
  margin: 0 auto;
}

/* ═══ Side Action Controls Panel (Sebelah Kanan Kamera) ═══ */
.camera-side-panel {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.side-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-card);
}

.side-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-title);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.side-panel-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.side-btn {
  width: 100%;
  justify-content: flex-start;
  padding: 8px 12px;
  font-size: 0.78rem;
}

.side-panel-footer {
  padding-top: 8px;
  border-top: 1px solid var(--border-card);
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
}

.side-panel-footer code {
  color: var(--teal-primary);
  font-weight: 700;
}

/* ═══ ESP32-CAM REAL STREAM STYLES ═══ */

/* Gambar JPEG dari ESP32 yang mengisi penuh viewport secara rill (contain 4:3) */
.esp32-live-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 6;
  background-color: #0b111e;
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

/* Tombol Flash LED */
.cam-btn-led-on {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #ffffff !important;
  border-color: #f59e0b !important;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
  font-weight: 700;
}
.cam-btn-led-on svg {
  color: #ffffff !important;
  filter: drop-shadow(0 0 4px #fef08a);
}

.cam-btn-led-off {
  background-color: rgba(245, 158, 11, 0.08) !important;
  border-color: rgba(245, 158, 11, 0.3) !important;
  color: #f59e0b !important;
}

/* Tombol Auto AI */
.cam-btn-ai-active {
  background: linear-gradient(135deg, #059669, #10b981) !important;
  color: #ffffff !important;
  border-color: #10b981 !important;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
  font-weight: 700;
}
.cam-btn-ai-active svg {
  color: #ffffff !important;
  animation: spin 3s linear infinite;
}

.cam-btn-ai-inactive {
  background-color: rgba(16, 185, 129, 0.08) !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
  color: #10b981 !important;
}

.infer-spinner {
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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

/* Camera Button Base Styles */
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

