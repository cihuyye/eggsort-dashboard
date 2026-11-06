<template>
  <div class="sub-header">
    <div class="sub-header-left">
      <div class="title-row">
        <h1 class="page-title">Dashboard Monitoring Real-Time</h1>
        <span class="node-live-tag">NODE-01 LIVE</span>
      </div>
      <p class="page-subtitle">
        Pemantauan langsung proses klasifikasi dan deteksi mutu telur berbasis Computer Vision &amp; AI
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="sub-header-actions">
      <!-- Machine Run / Stop Machine Button -->
      <button
        class="action-btn machine-toggle-btn"
        :class="{ running: isAutoMode, stopped: !isAutoMode }"
        @click="toggleAutoMode"
        :title="isAutoMode ? 'Klik untuk Menghentikan Mesin' : 'Klik untuk Menjalankan Mesin'"
      >
        <span v-if="isAutoMode" class="btn-live-dot"></span>
        <svg v-else class="btn-stop-icon" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
        <span>{{ isAutoMode ? 'MESIN BERJALAN (OTOMATIS)' : 'STOP MESIN (BERHENTI)' }}</span>
      </button>

      <!-- Reset Session Button -->
      <button class="action-btn reset-btn" @click="resetSession" title="Reset penghitungan sesi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        <span>Reset Sesi</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isAutoMode: {
    type: Boolean,
    default: true
  },
  toggleAutoMode: {
    type: Function,
    required: true
  },
  resetSession: {
    type: Function,
    required: true
  }
})
</script>

<style scoped>
.sub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
}

.sub-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--text-title);
  letter-spacing: -0.02em;
}

.node-live-tag {
  font-size: 0.68rem;
  font-weight: 700;
  background-color: var(--teal-light);
  color: var(--teal-primary);
  border: 1px solid var(--teal-border);
  padding: 3px 8px;
  border-radius: 6px;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.sub-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s ease;
  user-select: none;
  box-shadow: var(--shadow-sm);
}

/* Machine Toggle Button: Running State */
.machine-toggle-btn.running {
  background-color: var(--teal-light);
  color: var(--teal-primary);
  border: 1.5px solid var(--teal-border);
}

.machine-toggle-btn.running:hover {
  background-color: var(--teal-primary);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.btn-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse-dot 1.8s infinite ease-in-out;
}

/* Machine Toggle Button: Stopped State */
.machine-toggle-btn.stopped {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1.5px solid rgba(239, 68, 68, 0.35);
}

.machine-toggle-btn.stopped:hover {
  background-color: #ef4444;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-stop-icon {
  width: 14px;
  height: 14px;
}

/* Reset Session Button */
.reset-btn {
  background-color: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border-card);
}

.reset-btn svg {
  width: 15px;
  height: 15px;
  color: var(--text-muted);
}

.reset-btn:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .sub-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
