<template>
  <Transition name="modal-zoom">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-window">
        <!-- Modal Top Bar -->
        <div class="modal-top">
          <div class="modal-id-row">
            <span class="pulse-live-dot"></span>
            <span class="egg-title-code font-mono">{{ eggData.eggId || '#EGG-1428' }}</span>
            <span class="grade-badge-chip" :class="gradeClass">
              {{ eggData.grade || 'GRADE A' }}
            </span>
            <span class="batch-tag font-mono">Tray B-04</span>
          </div>

          <button class="modal-close-icon-btn" @click="$emit('close')" title="Tutup Pop-up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Modal Main Grid -->
        <div class="modal-grid">
          <!-- Left: Visual Inspection Area -->
          <div class="visual-panel">
            <div class="visual-viewport" :class="inspectMode">
              <div class="viewport-rollers"></div>

              <!-- Real Photo Preview (jika ada gambar dari API) -->
              <div v-if="eggData.imageUrl" class="real-egg-modal-wrap">
                <img :src="eggData.imageUrl" class="real-egg-modal-img" alt="Foto Telur Detail" />
              </div>

              <!-- Egg Graphic (Simulasi Bawaan) -->
              <div v-else class="egg-graphic" :class="[inspectMode, gradeClass]">
                <div v-if="inspectMode === 'candling'" class="candling-glow-effect"></div>
                <div v-if="inspectMode === 'candling'" class="air-chamber">
                  <span>{{ eggData.airDepthCm || 0.32 }}cm</span>
                </div>
                <div v-if="inspectMode === 'candling'" class="yolk-core"></div>
                <div v-if="eggData.yoloDefectClass === 'cracked'" class="crack-line"></div>
                <div v-if="eggData.yoloDefectClass === 'dirt'" class="dirt-patch"></div>
              </div>

              <!-- Reticle HUD -->
              <div class="hud-reticle">
                <span class="reticle-corner tl"></span>
                <span class="reticle-corner tr"></span>
                <span class="reticle-corner bl"></span>
                <span class="reticle-corner br"></span>
                <div class="hud-center-cross"></div>
                <div class="hud-dimension-tag font-mono">
                  {{ eggData.length || 58.2 }}mm × {{ eggData.width || 43.1 }}mm
                </div>
              </div>

              <!-- View Mode Switcher -->
              <div class="viewport-mode-switcher">
                <button
                  class="mode-pill-btn"
                  :class="{ active: inspectMode === 'top' }"
                  @click="inspectMode = 'top'"
                >
                  Cangkang (Top)
                </button>
                <button
                  class="mode-pill-btn"
                  :class="{ active: inspectMode === 'candling' }"
                  @click="inspectMode = 'candling'"
                >
                  Candling (Interior)
                </button>
              </div>
            </div>

            <!-- Fast Actuator Status Bar -->
            <div class="actuator-mini-bar">
              <div class="actuator-pill">
                <span class="act-dot"></span>
                <span>Aktuator: <strong>{{ eggData.actuator || 'Gate 1 (Solenoid)' }}</strong></span>
              </div>
              <span class="trig-time font-mono">Resp: {{ eggData.triggerTime || '135ms' }}</span>
            </div>
          </div>

          <!-- Right: Visual Gauges & Scores (No heavy text!) -->
          <div class="metrics-panel">
            <!-- Overall Score Ring -->
            <div class="score-card">
              <div class="score-circle-box">
                <svg class="score-svg" viewBox="0 0 36 36">
                  <path
                    class="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="circle-progress"
                    :stroke-dasharray="`${eggData.confidence || 98.4}, 100`"
                    :class="gradeClass"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="score-num font-mono">
                  <span>{{ eggData.confidence || 98.4 }}%</span>
                </div>
              </div>
              <div class="score-info">
                <div class="score-title">AI Confidence Score</div>
                <div class="score-status" :class="gradeClass">{{ eggData.gradeLabel || 'Prima' }}</div>
                <div class="yolo-val font-mono">YOLOv8: {{ eggData.yoloProbability || 0.984 }}</div>
              </div>
            </div>

            <!-- Mini Progress Visuals -->
            <div class="progress-meters-card">
              <!-- Meter 1: Shape Index (Normal 72-76%) -->
              <div class="meter-item">
                <div class="meter-head">
                  <span class="meter-title">Shape Index (SI)</span>
                  <span class="meter-value font-mono">{{ eggData.shapeIndex || 74.05 }}%</span>
                </div>
                <div class="meter-track">
                  <div
                    class="meter-fill"
                    :style="{ width: `${Math.min(100, ((eggData.shapeIndex || 74) / 85) * 100)}%` }"
                    :class="gradeClass"
                  ></div>
                  <div class="safe-zone" style="left: 72%; width: 5%" title="Zona Normal SNI (72-76%)"></div>
                </div>
                <div class="meter-footer">
                  <span>Lonjong (&lt;72%)</span>
                  <span class="text-teal font-bold">Ideal (72-76%)</span>
                  <span>Bulat (&gt;76%)</span>
                </div>
              </div>

              <!-- Meter 2: Kantung Udara -->
              <div class="meter-item">
                <div class="meter-head">
                  <span class="meter-title">Kantung Udara</span>
                  <span class="meter-value font-mono">{{ eggData.airDepthCm || 0.32 }} cm</span>
                </div>
                <div class="meter-track">
                  <div
                    class="meter-fill"
                    :style="{ width: `${Math.min(100, ((eggData.airDepthCm || 0.32) / 1.0) * 100)}%` }"
                    :class="eggData.airDepthCm > 0.9 ? 'grade-reject' : 'grade-a'"
                  ></div>
                  <div class="safe-zone" style="left: 0%; width: 50%" title="Batas Segar (<0.5cm)"></div>
                </div>
                <div class="meter-footer">
                  <span class="text-teal font-bold">&lt; 0.5cm (Segar)</span>
                  <span>0.5 - 0.9cm (Toleransi)</span>
                  <span class="text-red">&gt; 0.9cm (Reject)</span>
                </div>
              </div>

              <!-- Meter 3: Integritas Cangkang -->
              <div class="meter-item">
                <div class="meter-head">
                  <span class="meter-title">Integritas Cangkang</span>
                  <span class="meter-value" :class="gradeClass">{{ eggData.shellIntegrity || 'Bersih' }}</span>
                </div>
                <div class="chip-status-row">
                  <span class="status-badge" :class="{ 'badge-ok': eggData.grade !== 'REJECT', 'badge-fail': eggData.grade === 'REJECT' }">
                    {{ eggData.grade === 'REJECT' ? 'Terdeteksi Cacat' : 'Utuh & Bersih' }}
                  </span>
                  <span class="status-badge badge-neutral font-mono">
                    {{ formattedHaugh }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Rekomendasi Tindakan Selanjutnya Berdasarkan SNI 3926:2023 -->
            <div class="sni-action-card" :class="gradeClass">
              <div class="sni-action-card-header">
                <span class="sni-badge">STANDAR SNI 3926:2023</span>
                <span class="sni-title-tag">TINDAKAN SELANJUTNYA &amp; PENANGANAN</span>
              </div>
              <p class="sni-action-narrative">{{ eggData.sniAction || defaultDetailSniAction }}</p>
              <div class="sni-meta-pills">
                <span class="sni-meta-pill">📋 Acuan: {{ eggData.standardRef || 'SNI 3926:2023 (Tabel 1 & Pasal 8-10)' }}</span>
                <span class="sni-meta-pill">🎯 Jalur: {{ eggData.actuator || 'Gate 1 (Solenoid)' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  eggData: { type: Object, default: () => ({}) },
  triggerToast: { type: Function, default: () => {} }
})

const emit = defineEmits(['close'])

const inspectMode = ref('top') // 'top' or 'candling'

const gradeClass = computed(() => {
  const g = (props.eggData?.grade || 'Grade A').toUpperCase()
  if (g.includes('REJECT') || g.includes('MUTU III')) return 'grade-reject'
  if (g.includes('B') || g.includes('MUTU II')) return 'grade-b'
  return 'grade-a'
})

const defaultDetailSniAction = computed(() => {
  const g = (props.eggData?.grade || 'Grade A').toUpperCase()
  if (g.includes('A') || g.includes('MUTU I')) {
    return 'Layak konsumsi langsung segar. Dikemas dalam kemasan ritel berlabel resmi minimal mencantumkan nama produk, tanggal produksi, NKV, jumlah butir, dan tingkatan mutu (Pasal 8 & 9 SNI 3926:2023). Simpan pada suhu ruang maks 30°C / kelembaban maks 90% (Pasal 10).'
  }
  if (g.includes('B') || g.includes('MUTU II')) {
    return 'Lolos konsumsi reguler & bahan baku industri olahan pangan (bakery/kue/mie). Sanitasi kering noda kerabang (toleransi noda ≤ 1/32 luas permukaan Tabel 1 SNI 3926:2023) tanpa perendaman air berlebih. Prioritaskan distribusi cepat.'
  }
  return 'Ditolak dari peredaran telur ayam konsumsi segar utuh (Tabel 1 & 2 SNI 3926:2023) demi keamanan pangan dan pencegahan pencemaran mikroba patogen (Salmonella spp. & Enterobacteriaceae). Alihkan segera ke wadah karantina afkir/pemusnahan.'
})

const formattedHaugh = computed(() => {
  const raw = String(props.eggData?.internalHaugh || '82').trim()
  const cleanNum = raw.replace(/^[a-zA-Z\s\-:]+/, '').trim() || '82'
  return `${cleanNum} HU`
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(5, 10, 20, 0.78);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.modal-window {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  width: 100%;
  max-width: 820px;
  max-height: calc(100vh - 32px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: auto;
  transition: all 0.25s ease;
}

/* Modal Top Bar */
.modal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-card-subtle);
  flex-shrink: 0;
}

.modal-id-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pulse-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--teal-primary);
  box-shadow: 0 0 8px var(--teal-primary);
  animation: pulse-dot 1.5s infinite;
}

.egg-title-code {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-title);
}

.grade-badge-chip {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 9999px;
  letter-spacing: 0.03em;
}

.grade-badge-chip.grade-a {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.grade-badge-chip.grade-b {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.grade-badge-chip.grade-reject {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.batch-tag {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 2px 7px;
  border-radius: 5px;
}

.modal-close-icon-btn {
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close-icon-btn:hover {
  background-color: var(--bg-card-hover);
  color: var(--text-title);
}

.modal-close-icon-btn svg {
  width: 17px;
  height: 17px;
}

/* Modal Grid */
.modal-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 16px;
  padding: 14px 18px 16px 18px;
  overflow-y: auto;
  max-height: calc(100vh - 90px);
}

/* Visual Panel */
.visual-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visual-viewport {
  height: 220px;
  background-color: #0b111e;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewport-rollers {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, #131d2e 0px, #131d2e 14px, #0f172a 14px, #0f172a 28px);
  opacity: 0.4;
}

.real-egg-modal-wrap {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.real-egg-modal-img {
  max-width: 120px;
  max-height: 155px;
  object-fit: contain;
  border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.egg-graphic {
  width: 85px;
  height: 120px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform: rotate(-90deg);
  position: relative;
  z-index: 5;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
}

.egg-graphic.top {
  background: radial-gradient(circle at 35% 35%, #fce7cf 0%, #e2b083 45%, #9a6538 90%);
}

.egg-graphic.candling {
  background: radial-gradient(circle at 50% 50%, #fff7ed 0%, #fb923c 40%, #c2410c 80%, #7c2d12 100%);
  box-shadow: 0 0 45px rgba(251, 146, 60, 0.7);
}

.candling-glow-effect {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%);
  filter: blur(14px);
}

.air-chamber {
  position: absolute;
  top: 4px;
  left: 15px;
  right: 15px;
  height: 26px;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.25);
  border-radius: 40% 40% 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.air-chamber span {
  font-size: 0.55rem;
  color: #fff;
  font-family: var(--font-mono);
  font-weight: 800;
  transform: rotate(90deg);
}

.yolk-core {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, #ea580c 0%, #9a3412 80%);
  top: 45%;
  left: 35%;
  filter: blur(5px);
}

.crack-line {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-left: 2px solid #ef4444;
  border-top: 2px solid #ef4444;
  transform: rotate(45deg);
  filter: drop-shadow(0 0 4px #ef4444);
}

.dirt-patch {
  position: absolute;
  width: 14px;
  height: 18px;
  border-radius: 50%;
  background: #3e2723;
  top: 45px;
  left: 55px;
}

/* Reticle HUD */
.hud-reticle {
  position: absolute;
  width: 160px;
  height: 120px;
  pointer-events: none;
  z-index: 10;
}

.reticle-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #10b981;
}

.reticle-corner.tl { top: 0; left: 0; border-top: 2.5px solid; border-left: 2.5px solid; }
.reticle-corner.tr { top: 0; right: 0; border-top: 2.5px solid; border-right: 2.5px solid; }
.reticle-corner.bl { bottom: 0; left: 0; border-bottom: 2.5px solid; border-left: 2.5px solid; }
.reticle-corner.br { bottom: 0; right: 0; border-bottom: 2.5px solid; border-right: 2.5px solid; }

.hud-center-cross {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hud-center-cross::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 1px;
  background: rgba(16, 185, 129, 0.6);
}

.hud-center-cross::after {
  content: '';
  position: absolute;
  height: 14px;
  width: 1px;
  background: rgba(16, 185, 129, 0.6);
}

.hud-dimension-tag {
  position: absolute;
  bottom: -22px;
  right: 0;
  font-size: 0.65rem;
  color: #34d399;
  background: rgba(0, 0, 0, 0.6);
  padding: 1px 5px;
  border-radius: 4px;
}

.viewport-mode-switcher {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
  background: rgba(15, 23, 42, 0.85);
  padding: 3px;
  border-radius: 7px;
  z-index: 20;
}

.mode-pill-btn {
  background: transparent;
  border: none;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-pill-btn.active {
  background: var(--teal-primary);
  color: #ffffff;
}

.actuator-mini-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.71rem;
}

.actuator-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-title);
}

.act-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--teal-primary);
}

.trig-time {
  font-size: 0.66rem;
  color: var(--text-muted);
}

/* Right Metrics Panel */
.metrics-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.score-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 8px 12px;
  border-radius: 10px;
}

.score-circle-box {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: var(--border-card);
  stroke-width: 3.8;
}

.circle-progress {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.circle-progress.grade-a { stroke: var(--grade-a); }
.circle-progress.grade-b { stroke: var(--grade-b); }
.circle-progress.grade-reject { stroke: var(--grade-c); }

.score-num {
  position: absolute;
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--text-title);
}

.score-title {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-weight: 600;
}

.score-status {
  font-size: 0.90rem;
  font-weight: 800;
  line-height: 1.2;
}

.score-status.grade-a { color: var(--grade-a); }
.score-status.grade-b { color: var(--grade-b); }
.score-status.grade-reject { color: var(--grade-c); }

.yolo-val {
  font-size: 0.65rem;
  color: var(--text-subtle);
  margin-top: 1px;
}

/* Progress Meters */
.progress-meters-card {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.meter-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meter-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 700;
}

.meter-title {
  color: var(--text-muted);
}

.meter-value {
  color: var(--text-title);
}

.meter-track {
  height: 7px;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.meter-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.meter-fill.grade-a { background-color: var(--grade-a); }
.meter-fill.grade-b { background-color: var(--grade-b); }
.meter-fill.grade-reject { background-color: var(--grade-c); }

.safe-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(16, 185, 129, 0.25);
  border-left: 1px solid rgba(16, 185, 129, 0.6);
  border-right: 1px solid rgba(16, 185, 129, 0.6);
}

.meter-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: var(--text-subtle);
}

.text-teal { color: var(--teal-primary); }
.text-red { color: var(--grade-c); }
.font-bold { font-weight: 700; }

.chip-status-row {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-ok {
  background: rgba(16, 185, 129, 0.12);
  color: var(--grade-a);
}

.badge-fail {
  background: rgba(239, 68, 68, 0.12);
  color: var(--grade-c);
}

.badge-neutral {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--text-body);
}

/* Modal Actions */
/* SNI 3926:2023 Action Recommendation Card */
.sni-action-card {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 2px;
}

.sni-action-card.grade-a {
  border-left: 3px solid #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
}

.sni-action-card.grade-b {
  border-left: 3px solid #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%);
}

.sni-action-card.grade-reject {
  border-left: 3px solid #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%);
}

.sni-action-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sni-badge {
  font-size: 0.60rem;
  font-weight: 800;
  background-color: rgba(20, 184, 166, 0.15);
  color: var(--teal-primary);
  border: 1px solid rgba(20, 184, 166, 0.3);
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.sni-title-tag {
  font-size: 0.62rem;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.sni-action-narrative {
  font-size: 0.69rem;
  line-height: 1.35;
  color: var(--text-main);
  margin: 0;
  font-weight: 500;
}

.sni-meta-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.sni-meta-pill {
  font-size: 0.62rem;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.06);
  color: var(--text-muted);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Transition Animations */
.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-zoom-enter-from,
.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

@media (max-width: 768px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }
}
</style>

