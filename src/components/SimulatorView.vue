<template>
  <div class="simulator-wrapper">
    <!-- Header Simulator -->
    <div class="sim-header">
      <div class="sim-header-info">
        <div class="sim-title-row">
          <span class="sim-badge">360° VISION SIMULATOR</span>
          <h2 class="sim-title">Kontrol Simulator Inspeksi Cangkang & Grading Telur</h2>
        </div>
        <p class="sim-sub">
          Simulasi Multi-Angle YOLOv8 (Deteksi Cacat 360°) + OpenCV (Geometri & Bobot) + Google Gemini (Auditor Mutu SNI 3926:2023)
        </p>
      </div>

      <!-- Flask API Connection Status -->
      <div class="api-bar">
        <div class="api-status-tag" :class="{ online: apiOnline }">
          <span class="pulse-dot"></span>
          <span>{{ apiOnline ? 'Flask API Online (:8000)' : 'Flask API Offline (:8000)' }}</span>
        </div>
        <input
          type="text"
          v-model="apiUrl"
          class="api-input"
          placeholder="http://127.0.0.1:8000"
          @change="updateApiUrl"
          title="Endpoint Flask API"
        />
      </div>
    </div>

    <!-- Main Grid Layout -->
    <div class="sim-grid">
      <!-- Kolom Kiri: Unggah Multi-Sudut & Galeri Sudut 360° -->
      <div class="sim-card upload-section">
        <div class="card-head">
          <div class="head-left">
            <svg class="head-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span class="head-title">Unggah Citra Cangkang Telur</span>
          </div>
          <span class="file-count-badge">{{ selectedFiles.length }} Sudut Dipilih</span>
        </div>

        <!-- Drop Zone -->
        <div
          class="drop-zone"
          :class="{ dragover: isDragging }"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            type="file"
            ref="fileInputRef"
            multiple
            accept="image/*"
            style="display: none"
            @change="handleFileInputChange"
          />
          <div class="drop-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div class="drop-prompt">Klik atau Tarik Foto Telur ke Sini</div>
          <div class="drop-hint">
            <strong>Mendukung Multi-Foto untuk 1 Butir Telur:</strong><br />
            Pilih 1 foto atau beberapa sudut (depan, samping, belakang) agar cangkang terinspeksi 360° tanpa blind-spot.
          </div>
        </div>

        <!-- Pratinjau Sudut-Sudut Telur -->
        <div class="angles-preview-header">
          <span class="angles-label">Pratinjau Sudut Cangkang Telur:</span>
          <button v-if="selectedFiles.length > 0" class="clear-btn" @click="resetAll">
            Hapus Semua
          </button>
        </div>

        <div class="angles-grid">
          <div v-if="selectedFiles.length === 0" class="angles-empty">
            Belum ada foto telur diunggah.<br />Pilih 1 atau beberapa foto untuk memulai simulasi.
          </div>

          <div
            v-for="(item, idx) in angleItems"
            :key="idx"
            class="angle-card"
            :class="getBorderClass(item.detectedClass)"
          >
            <div class="angle-card-head">
              <span class="angle-idx">Sudut {{ idx + 1 }}</span>
              <span
                class="angle-tag"
                :class="getTagClass(item.detectedClass)"
              >
                {{ item.statusText || 'Siaga' }}
              </span>
            </div>
            <div class="angle-canvas-wrap">
              <canvas :ref="el => setCanvasRef(el, idx)" class="angle-canvas"></canvas>
            </div>
          </div>
        </div>

        <!-- Kontrol Tombol -->
        <div class="btn-actions">
          <button
            class="action-btn btn-analyze"
            :disabled="selectedFiles.length === 0 || isAnalyzing"
            @click="runPrediction"
          >
            <span v-if="isAnalyzing" class="btn-spinner"></span>
            <span>{{ isAnalyzing ? 'Menganalisis 360° via Flask...' : '⚡ Analisis 360° & Tentukan Grade' }}</span>
          </button>
          <button class="action-btn btn-reset" @click="resetAll">
            Reset
          </button>
        </div>
      </div>

      <!-- Kolom Kanan: Hasil Inspeksi & LLM Auditor Mutu -->
      <div class="results-section">
        <!-- Hero Final Grade Card -->
        <div class="hero-grade-card" :class="heroGradeClass">
          <div class="hero-info">
            <div class="action-pill">
              {{ finalDecision.hardware_sorting_action ? `🎯 ${finalDecision.hardware_sorting_action}` : '🎯 Menunggu Analisis Telur' }}
            </div>
            <div class="hero-reason">
              {{ finalDecision.reason || 'Silakan masukkan foto sudut cangkang telur pada panel di samping lalu tekan tombol analisis.' }}
            </div>
            <div class="hero-subtext">
              {{ finalDecision.standard_reference || 'Acuan: SNI 3926:2023 (Tabel 1: Kerabang & Bentuk)' }}
            </div>
          </div>
          <div v-if="finalDecision.grade" class="hero-badge-huge" :class="hugeBadgeClass">
            {{ finalDecision.grade }}
          </div>
        </div>

        <!-- Dual Inspection Grid (YOLO 360 + OpenCV Geometry) -->
        <div class="inspection-cards-grid">
          <!-- Modul 1: YOLOv8 360 Evaluasi Cangkang -->
          <div class="sub-card">
            <div class="sub-card-header">
              <span class="mod-icon">🔍</span>
              <span class="mod-title">YOLOv8 Evaluasi Cangkang 360°</span>
            </div>
            <div class="stat-list">
              <div class="stat-row">
                <span class="s-label">Total Sudut Diperiksa</span>
                <span class="s-val">{{ summary360.totalAngles || selectedFiles.length || '-' }}</span>
              </div>
              <div class="stat-row">
                <span class="s-label">Kesimpulan 360°</span>
                <span class="s-val">
                  <span v-if="summary360.dominantDefect" class="defect-pill" :class="summary360.dominantDefect">
                    {{ summary360.dominantDefect.toUpperCase() }}
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="stat-row">
                <span class="s-label">Keyakinan (Confidence)</span>
                <span class="s-val">{{ summary360.confidence ? `${(summary360.confidence * 100).toFixed(1)}%` : '-' }}</span>
              </div>
              <div class="stat-row">
                <span class="s-label">Catatan Cacat</span>
                <span class="s-val s-notes">{{ summary360.notes || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Modul 2: OpenCV Geometri & Fisik -->
          <div class="sub-card">
            <div class="sub-card-header">
              <span class="mod-icon">📐</span>
              <span class="mod-title">OpenCV Geometri & Fisik</span>
            </div>
            <div class="stat-list">
              <div class="stat-row">
                <span class="s-label">Dimensi (Panjang x Lebar)</span>
                <span class="s-val">{{ geometry.length_mm ? `${geometry.length_mm} x ${geometry.width_mm} mm` : '-' }}</span>
              </div>
              <div class="stat-row">
                <span class="s-label">Indeks Bentuk (ESI)</span>
                <span class="s-val">{{ geometry.esi_percentage ? `${geometry.esi_percentage}% (${geometry.shape_status})` : '-' }}</span>
              </div>
              <div class="stat-row">
                <span class="s-label">Estimasi Bobot</span>
                <span class="s-val">{{ geometry.estimated_weight_gram ? `~${geometry.estimated_weight_gram} gram` : '-' }}</span>
              </div>
              <div class="stat-row">
                <span class="s-label">Kategori Ukuran SNI</span>
                <span class="s-val">{{ geometry.size_category || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modul 3: LLM Google Gemini (Auditor Mutu SNI) -->
        <div class="llm-card">
          <div class="llm-header">
            <div class="llm-header-left">
              <div class="gemini-sparkle-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              </div>
              <div>
                <div class="llm-title">Auditor Mutu AI (Google Gemini)</div>
                <div class="llm-model-badge">gemini-3.8-flash // SNI 3926:2023 Expert</div>
              </div>
            </div>
            <button class="chat-toggle-btn" @click="showChat = !showChat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{{ showChat ? 'Tutup Chat Auditor' : 'Tanya Auditor Mutu' }}</span>
            </button>
          </div>

          <!-- Tampilan Narasi Interpretasi Otomatis -->
          <div class="llm-narrative-box">
            <div v-if="llmInterpretation" class="narrative-content">
              {{ llmInterpretation }}
            </div>
            <div v-else class="narrative-placeholder">
              Narasi interpretasi resmi dari Google Gemini akan otomatis tersusun setelah proses analisis cangkang telur selesai.
            </div>
          </div>

          <!-- Panel Chat Interaktif Tanya-Jawab dengan Gemini -->
          <div v-if="showChat" class="llm-chat-panel">
            <div class="chat-history" ref="chatHistoryRef">
              <div
                v-for="(msg, cIdx) in chatMessages"
                :key="cIdx"
                class="chat-bubble"
                :class="msg.role"
              >
                <div class="bubble-sender">{{ msg.role === 'user' ? 'Operator' : 'Auditor Gemini SNI' }}</div>
                <div class="bubble-text">{{ msg.content }}</div>
              </div>
              <div v-if="isChatLoading" class="chat-bubble assistant typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>

            <!-- Quick Prompt Pills -->
            <div class="prompt-pills">
              <button
                class="pill-btn"
                @click="sendQuickPrompt('Mengapa telur ini masuk grade keputusan tersebut menurut SNI?')"
              >
                ❓ Mengapa masuk grade ini?
              </button>
              <button
                class="pill-btn"
                @click="sendQuickPrompt('Apakah telur dengan kondisi ini aman untuk konsumsi manusia?')"
              >
                🛡️ Apakah aman dikonsumsi?
              </button>
              <button
                class="pill-btn"
                @click="sendQuickPrompt('Jelaskan batas toleransi cacat cangkang pada SNI 3926:2023')"
              >
                📋 Batas toleransi SNI 3926
              </button>
            </div>

            <!-- Chat Input -->
            <div class="chat-input-row">
              <input
                type="text"
                v-model="userQuery"
                class="chat-input"
                placeholder="Tanyakan hal teknis seputar mutu telur ini ke Auditor Gemini..."
                @keyup.enter="sendChatMessage"
              />
              <button class="chat-send-btn" :disabled="!userQuery.trim() || isChatLoading" @click="sendChatMessage">
                Kirim
              </button>
            </div>
          </div>
        </div>

        <!-- Technical JSON Accordion -->
        <details class="json-details">
          <summary class="json-summary">Lihat Respons Mentah API (JSON Response)</summary>
          <pre class="json-box">{{ rawJson ? JSON.stringify(rawJson, null, 2) : '// Respons POST /api/v1/predict dari Flask akan tampil di sini.' }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { eggApiService } from '../services/eggApiService'

const props = defineProps({
  triggerToast: { type: Function, default: () => {} }
})

// Connection
const apiOnline = ref(false)
const apiUrl = ref(eggApiService.getBaseUrl())

// File handling
const fileInputRef = ref(null)
const isDragging = ref(false)
const selectedFiles = ref([])
const angleItems = ref([])
const canvasRefs = ref({})

// Prediction Results
const isAnalyzing = ref(false)
const rawJson = ref(null)
const finalDecision = ref({})
const summary360 = ref({})
const geometry = ref({})

// LLM
const llmInterpretation = ref('')
const showChat = ref(false)
const userQuery = ref('')
const isChatLoading = ref(false)
const chatHistoryRef = ref(null)
const chatMessages = ref([
  {
    role: 'assistant',
    content: 'Halo! Saya adalah Auditor Mutu SNI 3926:2023 bertenaga Google Gemini. Ada yang ingin Anda konfirmasikan terkait penilaian fisik cangkang atau klasifikasi mutu telur ini?'
  }
])

const setCanvasRef = (el, idx) => {
  if (el) canvasRefs.value[idx] = el
}

// Health check
const checkHealth = async () => {
  const res = await eggApiService.checkHealth()
  apiOnline.value = res.online
}

const updateApiUrl = () => {
  eggApiService.setBaseUrl(apiUrl.value)
  checkHealth()
  props.triggerToast(`Base URL Flask diubah: ${apiUrl.value}`)
}

onMounted(() => {
  checkHealth()
  setInterval(checkHealth, 5000)
})

// Trigger File Input
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleDrop = (e) => {
  isDragging.value = false
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processFiles(Array.from(e.dataTransfer.files))
  }
}

const handleFileInputChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    processFiles(Array.from(e.target.files))
  }
}

const processFiles = (files) => {
  const images = files.filter(f => f.type.startsWith('image/'))
  if (images.length === 0) {
    props.triggerToast('Harap pilih file gambar (JPG/PNG)!')
    return
  }

  selectedFiles.value = images
  angleItems.value = images.map((file, idx) => ({
    name: file.name,
    file,
    detectedClass: '',
    confidence: 0,
    statusText: 'Siap Analisis',
    detections: []
  }))

  nextTick(() => {
    images.forEach((file, idx) => {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRefs.value[idx]
          if (canvas) {
            canvas.width = img.naturalWidth || img.width
            canvas.height = img.naturalHeight || img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
          }
        }
        img.src = evt.target.result
      }
      reader.readAsDataURL(file)
    })
  })

  props.triggerToast(`Berhasil memilih ${images.length} sudut citra telur.`)
}

// Draw Bounding Boxes on Canvas
const drawDetections = (idx, file, detections) => {
  const canvas = canvasRefs.value[idx]
  if (!canvas) return

  const reader = new FileReader()
  reader.onload = (evt) => {
    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      if (!detections || detections.length === 0) return

      detections.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox_xyxy
        const w = x2 - x1
        const h = y2 - y1
        const cName = det.class_name
        const conf = (det.confidence * 100).toFixed(1)

        let color = '#10b981' // green good
        if (cName === 'cracked') color = '#ef4444' // red
        if (cName === 'dirt') color = '#f59e0b' // amber

        ctx.lineWidth = Math.max(3, Math.round(canvas.width * 0.007))
        ctx.strokeStyle = color
        ctx.strokeRect(x1, y1, w, h)

        const label = `${cName.toUpperCase()} ${conf}%`
        const fontSize = Math.max(13, Math.round(canvas.width * 0.038))
        ctx.font = `bold ${fontSize}px sans-serif`
        const textWidth = ctx.measureText(label).width
        const pad = 6

        ctx.fillStyle = color
        ctx.fillRect(x1, Math.max(0, y1 - fontSize - pad * 2), textWidth + pad * 2, fontSize + pad * 2)

        ctx.fillStyle = '#ffffff'
        ctx.fillText(label, x1 + pad, Math.max(fontSize, y1 - pad))
      })
    }
    img.src = evt.target.result
  }
  reader.readAsDataURL(file)
}

// Run Prediction to Flask API
const runPrediction = async () => {
  if (selectedFiles.value.length === 0) return

  isAnalyzing.value = true
  try {
    const data = await eggApiService.predictEgg(selectedFiles.value)
    rawJson.value = data

    // Summary & Decisions
    finalDecision.value = data.final_grading_decision || {}
    summary360.value = {
      totalAngles: data.total_angles,
      dominantDefect: data.summary_360?.dominant_defect,
      confidence: data.summary_360?.confidence,
      notes: data.summary_360?.notes
    }
    geometry.value = data.opencv_geometry_inspection || {}
    llmInterpretation.value = data.llm_interpretation || ''

    // Update angle items
    const angles = data.angles || []
    angles.forEach((ang, idx) => {
      if (angleItems.value[idx]) {
        angleItems.value[idx].detectedClass = ang.detected_class
        angleItems.value[idx].confidence = ang.confidence
        const statusLabel = ang.detected_class === 'not_egg' 
          ? 'BUKAN TELUR' 
          : `${ang.detected_class.toUpperCase()} (${(ang.confidence * 100).toFixed(0)}%)`
        angleItems.value[idx].statusText = statusLabel
        angleItems.value[idx].detections = ang.detections || []

        drawDetections(idx, selectedFiles.value[idx], ang.detections || [])
      }
    })

    if (data.is_egg === false || data.status === 'not_egg') {
      props.triggerToast('⚠️ Peringatan: Objek pada citra bukan telur ayam valid.')
    } else {
      props.triggerToast('Analisis 360° & Audit SNI berhasil diselesaikan!')
    }
  } catch (err) {
    console.error(err)
    props.triggerToast(`Gagal analisis: ${err.message || 'Server error'}`)
  } finally {
    isAnalyzing.value = false
  }
}

// Send Chat Message to Gemini
const sendChatMessage = async () => {
  const query = userQuery.value.trim()
  if (!query || isChatLoading.value) return

  chatMessages.value.push({ role: 'user', content: query })
  userQuery.value = ''
  isChatLoading.value = true

  // Scroll to bottom
  nextTick(() => {
    if (chatHistoryRef.value) chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  })

  try {
    const historyPayload = chatMessages.value.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }))

    const replyData = await eggApiService.chatWithLLM(query, historyPayload, rawJson.value)
    chatMessages.value.push({
      role: 'assistant',
      content: replyData.reply || 'Tidak ada balasan dari model auditor.'
    })
  } catch (err) {
    chatMessages.value.push({
      role: 'assistant',
      content: `⚠️ Maaf, terjadi kesalahan saat menghubungi auditor: ${err.message || 'Network error'}`
    })
  } finally {
    isChatLoading.value = false
    nextTick(() => {
      if (chatHistoryRef.value) chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    })
  }
}

const sendQuickPrompt = (promptText) => {
  userQuery.value = promptText
  sendChatMessage()
}

// Reset
const resetAll = () => {
  selectedFiles.value = []
  angleItems.value = []
  canvasRefs.value = {}
  rawJson.value = null
  finalDecision.value = {}
  summary360.value = {}
  geometry.value = {}
  llmInterpretation.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  props.triggerToast('Simulator telah di-reset ke kondisi awal.')
}

// Styling Helpers
const getBorderClass = (cName) => {
  if (cName === 'cracked') return 'border-cracked'
  if (cName === 'dirt') return 'border-dirt'
  if (cName === 'good') return 'border-good'
  if (cName === 'not_egg') return 'border-not-egg'
  return ''
}

const getTagClass = (cName) => {
  if (cName === 'cracked') return 'tag-cracked'
  if (cName === 'dirt') return 'tag-dirt'
  if (cName === 'good') return 'tag-good'
  if (cName === 'not_egg') return 'tag-not-egg'
  return 'tag-idle'
}

const heroGradeClass = computed(() => {
  const code = finalDecision.value?.grade_code
  if (code === 'NOT_EGG') return 'hero-grade-not-egg'
  if (code === 'MUTU_I') return 'hero-grade-a'
  if (code === 'MUTU_II') return 'hero-grade-b'
  if (code === 'MUTU_III' || code === 'REJECT') return 'hero-grade-reject'
  return ''
})

const hugeBadgeClass = computed(() => {
  const code = finalDecision.value?.grade_code
  if (code === 'NOT_EGG') return 'badge-not-egg'
  if (code === 'MUTU_I') return 'badge-a'
  if (code === 'MUTU_II') return 'badge-b'
  return 'badge-reject'
})
</script>

<style scoped>
.simulator-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 18px 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.sim-badge {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--teal-primary);
  background-color: rgba(20, 184, 166, 0.12);
  border: 1px solid rgba(20, 184, 166, 0.3);
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 4px;
}

.sim-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-title);
  margin: 0;
}

.sim-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.api-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.api-status-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.api-status-tag.online {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.api-input {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.78rem;
  color: var(--text-main);
  outline: none;
  width: 170px;
}

.sim-grid {
  display: grid;
  grid-template-columns: 1.05fr 1.35fr;
  gap: 20px;
}

@media (max-width: 1024px) {
  .sim-grid {
    grid-template-columns: 1fr;
  }
}

.sim-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.head-icon {
  width: 18px;
  height: 18px;
  color: var(--teal-primary);
}

.head-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-title);
}

.file-count-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-muted);
}

.drop-zone {
  border: 2px dashed var(--border-card);
  border-radius: 10px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  background-color: var(--bg-card-subtle);
  transition: all 0.2s ease;
}

.drop-zone:hover, .drop-zone.dragover {
  border-color: var(--teal-primary);
  background-color: rgba(20, 184, 166, 0.05);
}

.drop-icon svg {
  width: 32px;
  height: 32px;
  color: var(--teal-primary);
  margin-bottom: 8px;
}

.drop-prompt {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-title);
}

.drop-hint {
  font-size: 0.73rem;
  color: var(--text-muted);
  margin-top: 6px;
  line-height: 1.4;
}

.angles-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
}

.angles-label {
  font-weight: 700;
  color: var(--text-muted);
}

.clear-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.angles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.angles-empty {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 30px 10px;
  background-color: var(--bg-card-subtle);
  border-radius: 8px;
}

.angle-card {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.angle-card.border-cracked {
  border-color: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
}

.angle-card.border-dirt {
  border-color: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
}

.angle-card.border-good {
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

.angle-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  font-size: 0.65rem;
  background-color: rgba(0, 0, 0, 0.2);
}

.angle-idx {
  font-weight: 700;
  color: var(--text-muted);
}

.angle-tag {
  font-size: 0.62rem;
  font-weight: 800;
  padding: 2px 4px;
  border-radius: 4px;
}

.tag-idle { background: #6b7280; color: #fff; }
.tag-good { background: #10b981; color: #fff; }
.tag-dirt { background: #f59e0b; color: #fff; }
.tag-cracked { background: #ef4444; color: #fff; }
.tag-not-egg { background: #d97706; color: #fff; }

.angle-card.border-not-egg {
  border-color: #d97706;
  box-shadow: 0 0 10px rgba(217, 119, 6, 0.3);
}

.angle-canvas-wrap {
  width: 100%;
  aspect-ratio: 1;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.angle-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.btn-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.action-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-analyze {
  flex: 1;
  background-color: var(--teal-primary);
  color: #ffffff;
}

.btn-analyze:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-reset {
  background-color: var(--bg-card-subtle);
  color: var(--text-muted);
  border: 1px solid var(--border-card);
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Results Section */
.results-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-grade-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  gap: 16px;
}

.hero-grade-card.hero-grade-a {
  border-color: #10b981;
  background: linear-gradient(135deg, var(--bg-card) 60%, rgba(16, 185, 129, 0.1));
}

.hero-grade-card.hero-grade-b {
  border-color: #0ea5e9;
  background: linear-gradient(135deg, var(--bg-card) 60%, rgba(14, 165, 233, 0.1));
}

.hero-grade-card.hero-grade-reject {
  border-color: #ef4444;
  background: linear-gradient(135deg, var(--bg-card) 60%, rgba(239, 68, 68, 0.12));
}

.hero-grade-card.hero-grade-not-egg {
  border-color: #f59e0b;
  background: linear-gradient(135deg, var(--bg-card) 60%, rgba(245, 158, 11, 0.15));
}

.action-pill {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--teal-primary);
  margin-bottom: 6px;
}

.hero-reason {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-title);
  line-height: 1.4;
}

.hero-subtext {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.hero-badge-huge {
  font-size: 1.1rem;
  font-weight: 900;
  padding: 12px 18px;
  border-radius: 10px;
  letter-spacing: 0.05em;
  text-align: center;
  white-space: nowrap;
}

.badge-a {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 2px solid #10b981;
}

.badge-b {
  background-color: rgba(14, 165, 233, 0.2);
  color: #0ea5e9;
  border: 2px solid #0ea5e9;
}

.badge-reject {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 2px solid #ef4444;
}

.badge-not-egg {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 2px solid #f59e0b;
}

/* Dual Inspection Cards */
.inspection-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 640px) {
  .inspection-cards-grid {
    grid-template-columns: 1fr;
  }
}

.sub-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 16px;
}

.sub-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-title);
  border-bottom: 1px solid var(--border-card);
  padding-bottom: 10px;
  margin-bottom: 12px;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.75rem;
  gap: 8px;
}

.s-label {
  color: var(--text-muted);
}

.s-val {
  font-weight: 700;
  color: var(--text-main);
  text-align: right;
}

.s-notes {
  font-size: 0.7rem;
  max-width: 170px;
  line-height: 1.3;
}

.defect-pill {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.defect-pill.good { background-color: rgba(16, 185, 129, 0.2); color: #10b981; }
.defect-pill.dirt { background-color: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.defect-pill.cracked { background-color: rgba(239, 68, 68, 0.2); color: #ef4444; }

/* LLM Card */
.llm-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.llm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.llm-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gemini-sparkle-icon {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3b82f6, #ec4899);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gemini-sparkle-icon svg {
  width: 16px;
  height: 16px;
}

.llm-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--text-title);
}

.llm-model-badge {
  font-size: 0.68rem;
  color: var(--teal-primary);
  font-weight: 600;
}

.chat-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-title);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-toggle-btn:hover {
  border-color: var(--teal-primary);
}

.chat-toggle-btn svg {
  width: 14px;
  height: 14px;
}

.llm-narrative-box {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 14px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-main);
}

.narrative-placeholder {
  color: var(--text-muted);
  font-style: italic;
}

/* LLM Chat Panel */
.llm-chat-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--border-card);
  padding-top: 12px;
}

.chat-history {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  line-height: 1.4;
  max-width: 85%;
}

.chat-bubble.user {
  align-self: flex-end;
  background-color: var(--teal-primary);
  color: #ffffff;
}

.chat-bubble.assistant {
  align-self: flex-start;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-main);
}

.bubble-sender {
  font-size: 0.65rem;
  font-weight: 800;
  margin-bottom: 2px;
  opacity: 0.8;
}

.prompt-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill-btn {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.68rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn:hover {
  border-color: var(--teal-primary);
  color: var(--text-title);
}

.chat-input-row {
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.78rem;
  color: var(--text-main);
  outline: none;
}

.chat-send-btn {
  background-color: var(--teal-primary);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.typing-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--text-muted);
  margin-right: 4px;
  animation: blink 1.2s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* JSON Details */
.json-details {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 10px 14px;
}

.json-summary {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
}

.json-box {
  background-color: var(--bg-card-subtle);
  border-radius: 6px;
  padding: 10px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--text-main);
  max-height: 200px;
  overflow-y: auto;
}
</style>

