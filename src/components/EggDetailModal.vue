<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <span class="pulse-dot"></span>
            <span class="egg-id">{{ eggData.eggId || '#EGG-1428' }}</span>
            <span class="grade-badge" :class="gradeClass">
              {{ eggData.grade || 'GRADE A' }}
            </span>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Content Grid -->
        <div class="modal-content">
          <!-- Left: Visual -->
          <div class="visual-section">
            <div class="viewport" :class="inspectMode">
              <!-- Real Photo -->
              <div v-if="eggData.imageUrl" class="photo-wrapper">
                <img :src="eggData.imageUrl" alt="Egg" />
              </div>

              <!-- Simulated Egg -->
              <div v-else class="egg-sim" :class="[inspectMode, gradeClass]">
                <div v-if="inspectMode === 'candling'" class="candling-glow"></div>
                <div v-if="inspectMode === 'candling'" class="air-chamber">
                  <span>{{ eggData.airDepthCm || 0.32 }}cm</span>
                </div>
                <div v-if="inspectMode === 'candling'" class="yolk"></div>
                <div v-if="eggData.yoloDefectClass === 'cracked'" class="crack"></div>
                <div v-if="eggData.yoloDefectClass === 'dirt'" class="dirt"></div>
              </div>

              <!-- HUD -->
              <div class="hud">
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
                <div class="crosshair"></div>
                <div class="dimension">
                  {{ eggData.length || 58.2 }}mm × {{ eggData.width || 43.1 }}mm
                </div>
              </div>

              <!-- Mode Toggle -->
              <div class="mode-toggle">
                <button :class="{ active: inspectMode === 'top' }" @click="inspectMode = 'top'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Cangkang
                </button>
                <button :class="{ active: inspectMode === 'candling' }" @click="inspectMode = 'candling'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Candling
                </button>
              </div>
            </div>

            <!-- Actuator -->
            <div class="actuator">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <span>{{ eggData.actuator || 'Gate 1 → Ritel Mutu I' }}</span>
              <span class="time">{{ eggData.triggerTime || '135ms' }}</span>
            </div>
          </div>

          <!-- Right: Metrics -->
          <div class="metrics-section">
            <!-- Confidence -->
            <div class="confidence">
              <div class="ring">
                <svg viewBox="0 0 36 36">
                  <path class="ring-bg" d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" />
                  <path class="ring-fill" :class="gradeClass" :stroke-dasharray="`${eggData.confidence || 98.4}, 100`" d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" />
                </svg>
                <div class="value">
                  <span class="num">{{ eggData.confidence || 98.4 }}</span>
                  <span class="pct">%</span>
                </div>
              </div>
              <div class="info">
                <div class="label">AI Confidence</div>
                <div class="grade" :class="gradeClass">{{ eggData.gradeLabel || 'Mutu Prima' }}</div>
                <div class="yolo">YOLOv8: {{ eggData.yoloProbability || 0.984 }}</div>
              </div>
            </div>

            <!-- Metrics Grid -->
            <div class="metrics">
              <!-- Shape Index -->
              <div class="metric">
                <div class="metric-head">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span>Shape Index</span>
                </div>
                <div class="metric-val">{{ eggData.shapeIndex || 74.05 }}<span>%</span></div>
                <div class="bar">
                  <div class="fill" :class="gradeClass" :style="{ width: `${Math.min(100, (eggData.shapeIndex || 74) / 85 * 100)}%` }"></div>
                  <div class="zone" style="left: 72%; width: 5%"></div>
                </div>
                <div class="metric-foot">
                  <span>Ideal SNI</span>
                  <span>72-76%</span>
                </div>
              </div>

              <!-- Air Chamber -->
              <div class="metric">
                <div class="metric-head">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                  <span>Kantung Udara</span>
                </div>
                <div class="metric-val">{{ eggData.airDepthCm || 0.32 }}<span>cm</span></div>
                <div class="bar">
                  <div class="fill" :class="airClass" :style="{ width: `${Math.min(100, (eggData.airDepthCm || 0.32) / 1.0 * 100)}%` }"></div>
                  <div class="zone" style="left: 0%; width: 50%"></div>
                </div>
                <div class="metric-foot">
                  <span>Kesegaran</span>
                  <span :class="airClass">{{ airStatus }}</span>
                </div>
              </div>

              <!-- Shell -->
              <div class="metric">
                <div class="metric-head">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Integritas Cangkang</span>
                </div>
                <div class="metric-txt" :class="gradeClass">{{ eggData.shellIntegrity || 'Bersih' }}</div>
                <div class="badges">
                  <span :class="shellClass">{{ shellText }}</span>
                  <span class="haugh">{{ formattedHaugh }}</span>
                </div>
              </div>

              <!-- Brightness -->
              <div class="metric">
                <div class="metric-head">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                  </svg>
                  <span>Brightness</span>
                </div>
                <div class="metric-val">{{ eggData.meanBrightness || 142.6 }}</div>
                <div class="bar">
                  <div class="fill bright" :style="{ width: `${Math.min(100, (eggData.meanBrightness || 142) / 255 * 100)}%` }"></div>
                </div>
                <div class="metric-foot">
                  <span>Pencahayaan</span>
                  <span>Normal</span>
                </div>
              </div>
            </div>

            <!-- SNI Actions -->
            <div class="sni" :class="gradeClass">
              <div class="sni-head">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div>
                  <div class="sni-header-row">
                    <span class="sni-badge">SNI 3926:2023</span>
                    <span class="gemini-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      Gemini AI
                    </span>
                  </div>
                  <span class="sni-title">Rekomendasi AI & Tindakan Selanjutnya</span>
                </div>
              </div>
              
              <!-- Gemini Recommendation -->
              <div class="gemini-recommendation">
                <div v-if="isLoadingGemini" class="loading-skeleton">
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line"></div>
                </div>
                <p v-else class="recommendation-text">{{ geminiRecommendation }}</p>
              </div>
              
              <!-- SNI Action Badges -->
              <div class="sni-actions">
                <span v-for="a in sniActions" :key="a">{{ a }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  eggData: { type: Object, default: () => ({}) },
  triggerToast: { type: Function, default: () => {} }
})

defineEmits(['close'])

const inspectMode = ref('top')
const geminiRecommendation = ref('')
const isLoadingGemini = ref(false)

const gradeClass = computed(() => {
  const g = (props.eggData?.grade || 'GRADE A').toUpperCase()
  if (g.includes('REJECT') || g.includes('III')) return 'reject'
  if (g.includes('B') || g.includes('II')) return 'b'
  return 'a'
})

const airClass = computed(() => {
  const d = props.eggData?.airDepthCm || 0.32
  if (d > 0.9) return 'reject'
  if (d > 0.5) return 'b'
  return 'a'
})

const airStatus = computed(() => {
  const d = props.eggData?.airDepthCm || 0.32
  if (d > 0.9) return 'Tidak Segar'
  if (d > 0.5) return 'Toleransi'
  return 'Sangat Segar'
})

const shellClass = computed(() => props.eggData?.grade === 'REJECT' ? 'fail' : 'ok')
const shellText = computed(() => props.eggData?.grade === 'REJECT' ? 'Terdeteksi Cacat' : 'Utuh & Bersih')

const formattedHaugh = computed(() => {
  const raw = String(props.eggData?.internalHaugh || '82').trim()
  const num = raw.replace(/^[a-zA-Z\s\-:]+/, '').trim() || '82'
  return `${num} HU`
})

const sniActions = computed(() => {
  const g = gradeClass.value
  if (g === 'a') return ['Kemasan Ritel Resmi', 'Simpan ≤ 30°C', 'Konsumsi Langsung', 'Label SNI']
  if (g === 'b') return ['Industri Pangan', 'Sanitasi Kering', 'Distribusi Cepat', 'Noda ≤ 1/32']
  return ['Karantina Afkir', 'Tidak Edar', 'Risiko Patogen', 'Pemusnahan']
})

// Gemini AI Recommendation
async function fetchGeminiRecommendation() {
  if (!props.eggData?.eggId) return
  
  isLoadingGemini.value = true
  geminiRecommendation.value = ''
  
  try {
    // Build prompt based on egg metrics
    const prompt = `Sebagai ahli keamanan pangan SNI 3926:2023, analisis telur dengan data berikut:
- ID: ${props.eggData.eggId || '#EGG-XXXX'}
- Grade: ${props.eggData.grade || 'GRADE A'}
- Shape Index: ${props.eggData.shapeIndex || 74.05}%
- Kantung Udara: ${props.eggData.airDepthCm || 0.32} cm
- Integritas Cangkang: ${props.eggData.shellIntegrity || 'Bersih'}
- Deteksi Cacat: ${props.eggData.yoloDefectClass || 'Tidak Ada'}
- Confidence Score: ${props.eggData.confidence || 98.4}%

Berikan rekomendasi singkat (maksimal 3 kalimat) mengenai: (1) analisis kesegaran, (2) instruksi penyimpanan optimal, dan (3) jalur distribusi yang sesuai.`

    // Replace with your actual Gemini API endpoint
    // Example: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
    const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 200,
        }
      })
    })
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }
    
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Rekomendasi tidak tersedia.'
    
    geminiRecommendation.value = text.trim()
  } catch (error) {
    console.error('[Gemini AI] Error:', error)
    // Fallback recommendation based on grade
    const g = gradeClass.value
    if (g === 'a') {
      geminiRecommendation.value = 'Telur berkualitas prima dengan kesegaran optimal. Simpan pada suhu ≤30°C untuk mempertahankan mutu. Cocok untuk kemasan ritel resmi dan konsumsi langsung.'
    } else if (g === 'b') {
      geminiRecommendation.value = 'Telur masih layak konsumsi dengan catatan toleransi minor. Prioritaskan sanitasi kering dan distribusi cepat. Sesuai untuk industri pangan olahan.'
    } else {
      geminiRecommendation.value = 'Telur tidak memenuhi standar SNI. Karantina segera dan tidak boleh diedarkan untuk konsumsi. Risiko kontaminasi patogen tinggi.'
    }
  } finally {
    isLoadingGemini.value = false
  }
}

// Watch for modal open and egg data changes
watch(() => props.show, (newVal) => {
  if (newVal && props.eggData?.eggId) {
    fetchGeminiRecommendation()
  }
})

watch(() => props.eggData?.eggId, (newVal) => {
  if (newVal && props.show) {
    fetchGeminiRecommendation()
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  width: 100%;
  max-width: 920px;
  max-height: calc(100vh - 32px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  backdrop-filter: blur(8px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

.egg-id {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  font-family: var(--font-mono);
}

.grade-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 9999px;
  letter-spacing: 0.05em;
}

.grade-badge.a {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.grade-badge.b {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.grade-badge.reject {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.close-btn {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

/* Content */
.modal-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
}

/* Visual */
.visual-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.viewport {
  position: relative;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.egg-sim {
  width: 180px;
  height: 240px;
  background: radial-gradient(ellipse, rgba(226, 232, 240, 0.95) 0%, rgba(203, 213, 225, 0.9) 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
}

.egg-sim.candling {
  background: radial-gradient(ellipse, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 50%, rgba(30, 41, 59, 0.8) 100%);
}

.candling-glow {
  position: absolute;
  inset: 10%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.air-chamber {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: rgba(100, 116, 139, 0.3);
  border-radius: 50%;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cbd5e1;
}

.yolk {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.4) 100%);
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.3);
}

.crack {
  position: absolute;
  top: 30%;
  left: 40%;
  width: 2px;
  height: 40%;
  background: linear-gradient(180deg, transparent 0%, rgba(239, 68, 68, 0.8) 20%, rgba(239, 68, 68, 0.6) 80%, transparent 100%);
  transform: rotate(25deg);
}

.dirt {
  position: absolute;
  top: 60%;
  right: 25%;
  width: 20px;
  height: 20px;
  background: rgba(120, 113, 108, 0.6);
  border-radius: 50%;
  filter: blur(2px);
}

/* HUD */
.hud {
  position: absolute;
  inset: 12px;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(16, 185, 129, 0.5);
}

.tl {
  top: 0;
  left: 0;
  border-width: 2px 0 0 2px;
}

.tr {
  top: 0;
  right: 0;
  border-width: 2px 2px 0 0;
}

.bl {
  bottom: 0;
  left: 0;
  border-width: 0 0 2px 2px;
}

.br {
  bottom: 0;
  right: 0;
  border-width: 0 2px 2px 0;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
}

.crosshair::before,
.crosshair::after {
  content: '';
  position: absolute;
  background: rgba(16, 185, 129, 0.4);
}

.crosshair::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
}

.crosshair::after {
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
}

.dimension {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: #10b981;
  background: rgba(15, 23, 42, 0.8);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* Mode Toggle */
.mode-toggle {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
}

.mode-toggle button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.mode-toggle button svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.mode-toggle button:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(16, 185, 129, 0.4);
  color: #cbd5e1;
}

.mode-toggle button.active {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.5);
  color: #10b981;
}

/* Actuator */
.actuator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  gap: 8px;
}

.actuator svg {
  width: 16px;
  height: 16px;
  color: #10b981;
  flex-shrink: 0;
}

.actuator span:nth-child(2) {
  flex: 1;
  font-size: 0.75rem;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actuator .time {
  font-size: 0.72rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: #10b981;
  flex-shrink: 0;
}

/* Metrics */
.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

/* Confidence */
.confidence {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.ring {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.ring svg {
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 2.8;
}

.ring-fill {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s;
}

.ring-fill.a {
  stroke: #10b981;
}

.ring-fill.b {
  stroke: #3b82f6;
}

.ring-fill.reject {
  stroke: #ef4444;
}

.value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.value .num {
  font-size: 1.4rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: #0f172a;
}

.value .pct {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.info {
  flex: 1;
}

.info .label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info .grade {
  font-size: 0.95rem;
  font-weight: 800;
  margin-top: 2px;
}

.info .grade.a {
  color: #10b981;
}

.info .grade.b {
  color: #3b82f6;
}

.info .grade.reject {
  color: #ef4444;
}

.info .yolo {
  font-size: 0.7rem;
  font-weight: 600;
  font-family: var(--font-mono);
  color: #94a3b8;
  margin-top: 4px;
}

/* Metrics Grid */
.metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric {
  padding: 14px;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-head svg {
  width: 16px;
  height: 16px;
  color: #10b981;
  flex-shrink: 0;
}

.metric-head span {
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-val {
  font-size: 1.6rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: #0f172a;
  line-height: 1;
}

.metric-val span {
  font-size: 0.85rem;
  color: #64748b;
  margin-left: 2px;
}

.metric-txt {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 4px 0;
}

.metric-txt.a {
  color: #10b981;
}

.metric-txt.b {
  color: #3b82f6;
}

.metric-txt.reject {
  color: #ef4444;
}

.bar {
  position: relative;
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
}

.fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s;
}

.fill.a,
.fill.bright {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.fill.b {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.fill.reject {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.zone {
  position: absolute;
  top: -2px;
  height: 10px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 2px;
}

.metric-foot {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  margin-top: 2px;
}

.metric-foot span:first-child {
  color: #94a3b8;
  font-weight: 500;
}

.metric-foot span:last-child {
  font-weight: 700;
  color: #475569;
}

.metric-foot .a {
  color: #10b981;
}

.metric-foot .b {
  color: #3b82f6;
}

.metric-foot .reject {
  color: #ef4444;
}

.badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.badges span {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid;
}

.badges .ok {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}

.badges .fail {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.badges .haugh {
  background: rgba(100, 116, 139, 0.1);
  color: #cbd5e1;
  border-color: rgba(148, 163, 184, 0.3);
  font-family: var(--font-mono);
}

/* SNI */
.sni {
  padding: 16px;
  background: #f8fafc;
  border: 1.5px solid;
  border-radius: 12px;
}

.sni.a {
  border-color: rgba(16, 185, 129, 0.3);
}

.sni.b {
  border-color: rgba(59, 130, 246, 0.3);
}

.sni.reject {
  border-color: rgba(239, 68, 68, 0.3);
}

.sni-head {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.sni-head svg {
  width: 20px;
  height: 20px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.sni-head > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.sni-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.gemini-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.gemini-badge svg {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
}

.sni-badge {
  font-size: 0.68rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.gemini-recommendation {
  margin: 12px 0 16px;
  padding: 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.recommendation-text {
  font-size: 0.8rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-line.short {
  width: 70%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.sni-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
}

.sni-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sni-actions span {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 8px;
  transition: all 0.2s;
}

.sni.b .sni-actions span {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.25);
}

.sni.reject .sni-actions span {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

/* Scrollbar */
.modal-content::-webkit-scrollbar,
.metrics-section::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track,
.metrics-section::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 9999px;
}

.modal-content::-webkit-scrollbar-thumb,
.metrics-section::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 9999px;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.metrics-section::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
  }

  .metrics {
    grid-template-columns: 1fr;
  }
}
</style>
