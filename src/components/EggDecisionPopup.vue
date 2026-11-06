<template>
  <Transition name="popup-slide">
    <div
      v-if="visible && currentEgg && currentEgg.eggId"
      class="decision-popup-container"
      :class="gradeThemeClass"
    >
      <!-- Popup Header -->
      <div class="popup-header">
        <div class="header-left">
          <span class="live-dot"></span>
          <span class="header-badge font-mono">{{ currentEgg.eggId }}</span>
          <span class="header-status-text">Hasil Pemindaian Baru</span>
        </div>
        <button class="btn-close" @click="closePopup" title="Tutup Pop-up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Popup Body: MURNI HANYA KEPUTUSAN MUTU & CAPTION SNI -->
      <div class="popup-body">
        <div class="grade-decision-box" :class="gradeThemeClass">
          <div class="decision-eyebrow">KEPUTUSAN MUTU SNI 3926:2023</div>
          <div class="grade-main-title">{{ displayGradeTitle }}</div>
          <div class="grade-sub-status">{{ displayGradeCaption }}</div>
        </div>
      </div>

      <!-- Popup Footer: Tombol Buka Detail Parameter -->
      <div class="popup-footer">
        <button class="btn-detail-action" @click="handleOpenDetail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Lihat Detail Parameter &amp; Evaluasi Lengkap</span>
          <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentEgg: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['open-detail'])

const visible = ref(true)

// Ketika ada telur baru dipindai, buka pop-up secara otomatis
watch(
  () => props.currentEgg?.eggId,
  (newId) => {
    if (newId) {
      visible.value = true
    }
  }
)

const closePopup = () => {
  visible.value = false
}

const handleOpenDetail = () => {
  emit('open-detail', props.currentEgg)
}

const gradeThemeClass = computed(() => {
  const g = String(props.currentEgg?.grade || '').toUpperCase()
  if (g.includes('GRADE A') || g.includes('MUTU I')) return 'theme-grade-a'
  if (g.includes('GRADE B') || g.includes('MUTU II')) return 'theme-grade-b'
  if (g.includes('REJECT') || g.includes('MUTU III') || g.includes('AFKIR')) return 'theme-grade-reject'
  return 'theme-grade-a'
})

const displayGradeTitle = computed(() => {
  const g = String(props.currentEgg?.grade || '').toUpperCase()
  if (g.includes('A') || g.includes('MUTU I')) return 'MUTU I (GRADE A)'
  if (g.includes('B') || g.includes('MUTU II')) return 'MUTU II (GRADE B)'
  return 'MUTU III (REJECT)'
})

const displayGradeCaption = computed(() => {
  const g = String(props.currentEgg?.grade || '').toUpperCase()
  if (g.includes('A') || g.includes('MUTU I')) {
    return 'Kerabang Utuh & Bersih, Bentuk Normal (SI 72-76%), Kantung Udara < 0.5 cm'
  }
  if (g.includes('B') || g.includes('MUTU II')) {
    return 'Kerabang Utuh, Toleransi Noda ≤ 1/32 Luas Permukaan, Kantung Udara 0.5 - 0.9 cm'
  }
  return 'Kerabang Tidak Utuh (Retak/Cracked) / Melanggar Persyaratan Fisik Tabel 1 SNI'
})
</script>

<style scoped>
.decision-popup-container {
  position: fixed;
  bottom: 24px;
  right: 28px;
  width: 330px;
  max-width: calc(100vw - 32px);
  background-color: var(--bg-card);
  border: 1.5px solid var(--border-card);
  border-radius: 16px;
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 990;
  overflow: hidden;
  backdrop-filter: blur(14px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Theme Glow & Borders */
.decision-popup-container.theme-grade-a {
  border-color: rgba(16, 185, 129, 0.45);
  box-shadow: 0 16px 40px -8px rgba(16, 185, 129, 0.22), 0 0 0 1px rgba(16, 185, 129, 0.2);
}

.decision-popup-container.theme-grade-b {
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 16px 40px -8px rgba(59, 130, 246, 0.22), 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.decision-popup-container.theme-grade-reject {
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 16px 40px -8px rgba(239, 68, 68, 0.28), 0 0 0 1px rgba(239, 68, 68, 0.25);
}

/* Header */
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: var(--bg-card-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--teal-primary);
  box-shadow: 0 0 8px var(--teal-primary);
  animation: pulseDot 1.8s infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.85); }
}

.header-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-title);
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 2px 6px;
  border-radius: 5px;
}

.header-status-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
}

.btn-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.btn-close:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-close svg {
  width: 15px;
  height: 15px;
}

/* Body: Hanya Keputusan Mutu */
.popup-body {
  padding: 16px 14px;
}

.grade-decision-box {
  padding: 14px 16px;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
}

.theme-grade-a .grade-decision-box {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.03) 100%);
  border-color: rgba(16, 185, 129, 0.35);
}

.theme-grade-b .grade-decision-box {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.03) 100%);
  border-color: rgba(59, 130, 246, 0.35);
}

.theme-grade-reject .grade-decision-box {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(239, 68, 68, 0.03) 100%);
  border-color: rgba(239, 68, 68, 0.38);
}

.decision-eyebrow {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.grade-main-title {
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.15;
  margin: 2px 0;
}

.theme-grade-a .grade-main-title { color: #10b981; }
.theme-grade-b .grade-main-title { color: #3b82f6; }
.theme-grade-reject .grade-main-title { color: #ef4444; }

.grade-sub-status {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  line-height: 1.35;
}

/* Footer: Tombol Detail */
.popup-footer {
  padding: 0 14px 14px 14px;
}

.btn-detail-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-card);
  background-color: var(--bg-card-subtle);
  color: var(--text-title);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detail-action:hover {
  background-color: var(--teal-primary);
  border-color: var(--teal-primary);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.3);
}

.btn-detail-action svg {
  width: 15px;
  height: 15px;
}

.btn-detail-action .chevron-icon {
  width: 14px;
  height: 14px;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.btn-detail-action:hover .chevron-icon {
  transform: translateX(3px);
}

/* Animation */
.popup-slide-enter-active,
.popup-slide-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.popup-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.96);
}

.popup-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

@media (max-width: 640px) {
  .decision-popup-container {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
  }
}
</style>
