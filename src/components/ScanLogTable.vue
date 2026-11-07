<template>
  <div class="log-card">
    <!-- Header Row -->
    <div class="log-header">
      <div class="log-title-box">
        <div class="title-with-icon">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span class="log-title">Log Pemindaian Terkini (Live Feed Queue)</span>
        </div>
        <p class="log-subtitle">
          5 butir telur terakhir yang melalui pos inspeksi Computer Vision
        </p>
      </div>

      <!-- Action Buttons: CSV Export & Filter -->
      <div class="log-actions">
        <!-- Filter Tabs / Dropdown -->
        <div class="filter-group">
          <button
            v-for="cat in ['ALL', 'GRADE A', 'GRADE B', 'REJECT']"
            :key="cat"
            class="filter-pill"
            :class="{ active: filterGrade === cat }"
            @click="filterGrade = cat"
          >
            {{ cat }}
          </button>
        </div>

        <button class="export-btn" @click="handleExport" title="Unduh log riwayat pemindaian ke file CSV">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Ekspor CSV</span>
        </button>
      </div>
    </div>

    <!-- Responsive Table -->
    <div class="table-responsive">
      <table class="scan-table">
        <thead>
          <tr>
            <th>WAKTU</th>
            <th>ID TELUR</th>
            <th>DIMENSI (P × L)</th>
            <th>SHAPE INDEX</th>
            <th>MEAN BRIGHTNESS</th>
            <th>DETEKSI CACAT (YOLO)</th>
            <th>KEPUTUSAN AKHIR</th>
            <th>AKSI AKTUATOR</th>
            <th>DETAIL</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(log, idx) in displayLogs"
            :key="idx"
            class="table-row"
            :class="{ 'first-row': idx === 0 }"
          >
            <!-- Waktu -->
            <td class="col-time font-mono" :class="{ 'active-time': idx === 0 }">
              <span v-if="idx === 0" class="time-pulse-dot"></span>
              {{ log.time }}
            </td>

            <!-- ID Telur -->
            <td class="col-id font-mono">
              <strong>{{ log.eggId }}</strong>
            </td>

            <!-- Dimensi -->
            <td class="col-dim">
              {{ log.dimensions }}
            </td>

            <!-- Shape Index -->
            <td class="col-si font-mono">
              {{ log.shapeIndex }}
            </td>

            <!-- Mean Brightness -->
            <td class="col-bright font-mono">
              {{ log.meanBrightness }}
            </td>

            <!-- Deteksi Cacat -->
            <td class="col-defect">
              <span
                class="defect-badge"
                :class="{
                  'defect-good': log.defectType === 'good',
                  'defect-dirt': log.defectType === 'dirt',
                  'defect-crack': log.defectType === 'cracked'
                }"
              >
                {{ log.defectDetection }}
              </span>
            </td>

            <!-- Keputusan Akhir (Grade Badge) -->
            <td class="col-grade">
              <span
                class="grade-pill-table"
                :class="log.finalGrade.toLowerCase().replace(' ', '-')"
              >
                {{ log.finalGrade }}
              </span>
            </td>

            <!-- Aksi Aktuator -->
            <td class="col-actuator">
              <span class="actuator-table-text">{{ log.actuator }}</span>
            </td>

            <!-- Detail Pop-up Button -->
            <td class="col-detail-action">
              <button
                class="btn-row-inspect"
                @click="$emit('open-detail', log)"
                title="Buka Pop-up Detail Inspeksi"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Lihat</span>
              </button>
            </td>
          </tr>

          <!-- Empty State if no logs -->
          <tr v-if="displayLogs.length === 0">
            <td colspan="8" class="empty-state">
              Tidak ada data telur untuk kategori yang dipilih.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer / Telemetry Status -->
    <div class="log-footer">
      <div class="footer-left">
        <span class="mqtt-dot"></span>
        <span>Buffer Queue: 0 Pending (Sinkronisasi MQTT Broker Aktif di {{ mqttFreq }}Hz)</span>
      </div>
      <div class="footer-right">
        Menampilkan {{ displayLogs.length }} dari {{ totalScanned.toLocaleString() }} record tersimpan di SQLite Edge DB
      </div>
    </div>

    <!-- Export Success Toast -->
    <Transition name="toast-slide">
      <div v-if="showExportToast" class="export-toast">
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <div class="toast-content">
          <span class="toast-title">Ekspor Berhasil</span>
          <span class="toast-desc">File CSV telah diunduh</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  scanLogs: {
    type: Array,
    required: true
  },
  filterGrade: {
    type: String,
    default: 'ALL'
  },
  totalScanned: {
    type: Number,
    default: 1428
  },
  mqttFreq: {
    type: Number,
    default: 108
  },
  exportCSV: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:filterGrade', 'open-detail'])

const showExportToast = ref(false)

const filterGrade = computed({
  get: () => props.filterGrade,
  set: (val) => emit('update:filterGrade', val)
})

const displayLogs = computed(() => {
  let list = props.scanLogs
  if (filterGrade.value !== 'ALL') {
    list = list.filter(l => l.finalGrade === filterGrade.value)
  }
  return list.slice(0, 5) // Show top 5 matching the design
})

const handleExport = () => {
  props.exportCSV()
  
  // Show success toast
  showExportToast.value = true
  
  // Hide after 3 seconds
  setTimeout(() => {
    showExportToast.value = false
  }, 3000)
}
</script>

<style scoped>
.log-card {
  background-color: var(--bg-card);
  border: 1.5px solid var(--border-card);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: all 0.2s ease;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}

.log-title-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 18px;
  height: 18px;
  color: var(--teal-primary);
}

.log-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-title);
}

.log-subtitle {
  font-size: 0.72rem;
  color: var(--text-subtle);
}

.log-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 3px;
  border-radius: 8px;
}

.filter-pill {
  border: none;
  background: transparent;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill:hover {
  color: var(--text-title);
}

.filter-pill.active {
  background-color: var(--bg-card);
  color: var(--teal-primary);
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.export-btn svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

/* Table */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.scan-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  text-align: left;
}

.scan-table th {
  padding: 12px 14px;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-card);
  white-space: nowrap;
}

.table-row {
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: var(--bg-card-subtle);
}

.table-row td {
  padding: 12px 14px;
  vertical-align: middle;
  white-space: nowrap;
}

.font-mono {
  font-family: var(--font-mono);
}

.col-time {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.col-time.active-time {
  color: var(--teal-primary);
  font-weight: 700;
}

.time-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: pulse-dot 1.5s infinite;
}

.col-id {
  color: var(--text-title);
}

.col-dim {
  color: var(--text-body);
}

.col-si, .col-bright {
  color: var(--text-body);
}

/* Defect Badge */
.defect-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.defect-good {
  color: var(--grade-a);
  background-color: var(--grade-a-bg);
}

.defect-dirt {
  color: var(--grade-b);
  background-color: var(--grade-b-bg);
}

.defect-crack {
  color: var(--grade-c);
  background-color: var(--grade-c-bg);
  font-weight: 700;
}

/* Grade Pills in Table */
.grade-pill-table {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 9999px;
  letter-spacing: 0.03em;
  display: inline-block;
}

.grade-pill-table.grade-a {
  background-color: var(--grade-a-bg);
  color: var(--grade-a);
  border: 1px solid var(--grade-a-border);
}

.grade-pill-table.grade-b {
  background-color: var(--grade-b-bg);
  color: var(--grade-b);
  border: 1px solid var(--grade-b-border);
}

.grade-pill-table.reject {
  background-color: var(--grade-c-bg);
  color: var(--grade-c);
  border: 1px solid var(--grade-c-border);
}

.actuator-table-text {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.btn-row-inspect {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--teal-primary);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-row-inspect svg {
  width: 13px;
  height: 13px;
}

.btn-row-inspect:hover {
  background-color: var(--teal-primary);
  color: #ffffff;
  border-color: var(--teal-primary);
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
  font-style: italic;
}

/* Footer status bar */
.log-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 10px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mqtt-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
}

/* Export Success Toast */
.export-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background-color: var(--bg-card);
  border: 1.5px solid var(--teal-primary);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 12px 32px rgba(5, 150, 105, 0.25), 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1500;
  min-width: 280px;
}

.toast-icon {
  width: 24px;
  height: 24px;
  color: var(--teal-primary);
  flex-shrink: 0;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-title);
}

.toast-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* Toast Animation */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-enter-from {
  transform: translateX(120%) translateY(20px);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .log-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .export-toast {
    bottom: 20px;
    right: 20px;
    left: 20px;
    min-width: unset;
  }
}
</style>

