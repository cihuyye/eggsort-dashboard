<template>
  <header class="top-nav">
    <!-- Right Controls: Status Pills Only -->
    <div class="header-right">
      <!-- Flask AI Backend Status Pill -->
      <div class="status-pill" :class="{ 'status-offline': !apiOnline }" :title="apiOnline ? 'Server AI Flask terhubung' : 'Server AI belum menyala di port 8000'">
        <span class="status-indicator" :style="{ backgroundColor: apiOnline ? '#10b981' : '#ef4444' }"></span>
        <span class="status-text">
          {{ apiOnline ? 'YOLOv8 API ONLINE' : 'API OFFLINE (:8000)' }}
        </span>
      </div>

      <!-- ESP32-CAM Stream Status Pill -->
      <div class="status-pill" :class="{ 'status-offline': !isAutoMode }">
        <span class="status-indicator"></span>
        <span class="status-text">
          {{ isAutoMode ? `ESP32-CAM ONLINE // ${fps} FPS` : 'ESP32-CAM SIAGA // MESIN STOP' }}
        </span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  apiOnline: {
    type: Boolean,
    default: false
  },
  fps: {
    type: [Number, String],
    default: 29.8
  },
  isAutoMode: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.top-nav {
  height: 56px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-card);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: 40;
  transition: all 0.25s ease;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Status Pill */
.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--teal-light);
  border: 1px solid var(--teal-border);
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--teal-primary);
  font-family: var(--font-mono);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.status-indicator {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10b981;
  animation: pulse-dot 1.8s infinite ease-in-out;
}

.status-offline {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.35);
  color: #ef4444;
}

.status-offline .status-indicator {
  background-color: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

@media (max-width: 768px) {
  .top-nav {
    padding: 0 16px;
  }
}
</style>
