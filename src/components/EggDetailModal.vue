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

              <!-- Egg Graphic -->
              <div class="egg-graphic" :class="[inspectMode, gradeClass]">
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
                <div class="svm-val font-mono">SVM: {{ eggData.svmProbability || 0.984 }}</div>
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
                    HU: {{ eggData.internalHaugh || '82' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Modal Action Buttons -->
            <div class="modal-action-btns">
              <button class="btn-primary-action" @click="handlePrintLabel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Cetak Barcode</span>
              </button>

              <button class="btn-secondary-action" @click="handleRerunAi">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>Uji Ulang AI</span>
              </button>
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

const handlePrintLabel = () => {
  props.triggerToast(`Label Barcode untuk ${props.eggData?.eggId || '#EGG-1428'} dikirim ke printer thermal.`)
}

const handleRerunAi = () => {
  props.triggerToast(`Inferensi ulang YOLOv8 & OpenCV selesai (Conf: 99.1%).`)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(5, 10, 20, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-window {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  width: 100%;
  max-width: 780px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.25s ease;
}

/* Modal Top Bar */
.modal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-card-subtle);
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
  font-size: 1.15rem;
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
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
  width: 18px;
  height: 18px;
}

/* Modal Grid */
.modal-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 20px;
  padding: 22px;
}

/* Visual Panel */
.visual-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.visual-viewport {
  height: 280px;
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

.egg-graphic {
  width: 100px;
  height: 140px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform: rotate(-90deg);
  position: relative;
  z-index: 5;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
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
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.74rem;
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
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Right Metrics Panel */
.metrics-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.score-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 14px 18px;
  border-radius: 12px;
}

.score-circle-box {
  width: 64px;
  height: 64px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-title);
}

.score-title {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

.score-status {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.2;
}

.score-status.grade-a { color: var(--grade-a); }
.score-status.grade-b { color: var(--grade-b); }
.score-status.grade-reject { color: var(--grade-c); }

.svm-val {
  font-size: 0.68rem;
  color: var(--text-subtle);
  margin-top: 2px;
}

/* Progress Meters */
.progress-meters-card {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
.modal-action-btns {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.btn-primary-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(90deg, #00dfa2 0%, #059669 100%);
  color: #042f2e;
  border: none;
  padding: 9px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary-action svg {
  width: 15px;
  height: 15px;
}

.btn-primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 223, 162, 0.4);
}

.btn-secondary-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-body);
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary-action svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.btn-secondary-action:hover {
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
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

