<template>
  <div class="notification-dropdown-container">
    <!-- Bell Icon Button with Badge -->
    <button
      ref="buttonRef"
      class="bell-button"
      @click.stop="toggleDropdown"
      :title="`${unreadCount} pemindaian baru`"
    >
      <svg class="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="badge-counter">{{ displayCount }}</span>
    </button>

    <!-- Dropdown Panel -->
    <Transition name="dropdown-slide">
      <div v-if="isOpen" ref="dropdownRef" class="dropdown-panel">
        <!-- Header -->
        <div class="dropdown-header">
          <span class="header-title">Riwayat Pemindaian</span>
          <button class="close-btn" @click="closeDropdown" title="Tutup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Notification List -->
        <div class="notification-list">
          <div
            v-for="(item, index) in recentScans"
            :key="item.eggId || index"
            class="notification-item"
            :class="gradeClass(item.finalGrade)"
          >
            <!-- Left: Grade Indicator -->
            <div class="grade-indicator" :class="gradeClass(item.finalGrade)">
              <svg v-if="gradeClass(item.finalGrade) === 'grade-a'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <svg v-else-if="gradeClass(item.finalGrade) === 'grade-b'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <!-- Middle: Info -->
            <div class="item-info">
              <div class="item-header">
                <span class="egg-id">{{ item.eggId || `#EGG-${index + 1}` }}</span>
                <span class="grade-badge" :class="gradeClass(item.finalGrade)">{{ item.finalGrade || 'N/A' }}</span>
              </div>
              <div class="item-timestamp">{{ item.time || 'Baru saja' }}</div>
              <div class="item-meta">
                {{ item.defectDetection || 'Deteksi selesai' }}
              </div>
            </div>

            <!-- Right: Action -->
            <button
              class="detail-button"
              @click="openDetail(item)"
              title="Lihat Detail Lengkap"
            >
              <span>Detail</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="recentScans.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C8 2 4.5 7 4.5 13.5C4.5 18 7.8 22 12 22C16.2 22 19.5 18 19.5 13.5C19.5 7 16 2 12 2Z" />
              <circle cx="12" cy="13.5" r="3.5" stroke-dasharray="2 2" />
            </svg>
            <p>Belum ada data pemindaian</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop: REMOVED, outside click sudah handle di script -->
    <!-- <Transition name="backdrop-fade">
      <div v-if="isOpen" class="dropdown-backdrop" @click="closeDropdown"></div>
    </Transition> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  scanLogs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['open-detail'])

const isOpen = ref(false)
const dropdownRef = ref(null)
const buttonRef = ref(null)

const toggleDropdown = (event) => {
  console.log('[NotificationDropdown] Toggle clicked, current state:', isOpen.value)
  event.stopPropagation()
  isOpen.value = !isOpen.value
  console.log('[NotificationDropdown] New state:', isOpen.value)
}

const closeDropdown = () => {
  console.log('[NotificationDropdown] Closing dropdown')
  isOpen.value = false
}

// Outside click handler - delay attachment to avoid immediate trigger
let clickHandlerAttached = false

const handleClickOutside = (event) => {
  if (!clickHandlerAttached) return // Ignore first few ms after opening
  
  if (isOpen.value && 
      dropdownRef.value && 
      buttonRef.value &&
      !dropdownRef.value.contains(event.target) &&
      !buttonRef.value.contains(event.target)) {
    console.log('[NotificationDropdown] Outside click detected, closing')
    closeDropdown()
  }
}

onMounted(() => {
  // Delay click handler attachment to prevent immediate close
  setTimeout(() => {
    clickHandlerAttached = true
    document.addEventListener('click', handleClickOutside)
    console.log('[NotificationDropdown] Outside click handler attached')
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  console.log('[NotificationDropdown] Unmounted, handler removed')
})

// Get most recent 20 scans, newest first
const recentScans = computed(() => {
  const result = [...props.scanLogs].reverse().slice(0, 20)
  console.log('[NotificationDropdown] Recent scans:', result.length)
  return result
})

const unreadCount = computed(() => {
  return recentScans.value.length
})

const displayCount = computed(() => {
  return unreadCount.value > 99 ? '99+' : unreadCount.value
})

const gradeClass = (grade) => {
  const g = String(grade || '').toUpperCase()
  if (g.includes('A') || g.includes('MUTU I')) return 'grade-a'
  if (g.includes('B') || g.includes('MUTU II')) return 'grade-b'
  return 'grade-reject'
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Baru saja'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)

  if (diffSec < 60) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHour < 24) return `${diffHour} jam lalu`

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openDetail = (item) => {
  console.log('[NotificationDropdown] Opening detail for:', item.eggId)
  emit('open-detail', item)
  closeDropdown()
}
</script>

<style scoped>
.notification-dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Bell Button */
.bell-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bell-button:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--teal-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
}

.bell-icon {
  width: 20px;
  height: 20px;
  color: var(--text-body);
  transition: color 0.2s ease;
}

.bell-button:hover .bell-icon {
  color: var(--teal-primary);
}

.badge-counter {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  font-family: var(--font-mono);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  border: 2px solid var(--bg-card);
}

/* Dropdown Panel */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-width: calc(100vw - 32px);
  max-height: 520px;
  background-color: var(--bg-card);
  border: 1.5px solid var(--border-card);
  border-radius: 12px;
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2000;
}

/* Dropdown Header */
.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--bg-card-subtle);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.header-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-title);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

/* Notification List */
.notification-list {
  overflow-y: auto;
  max-height: 460px;
  padding: 8px;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  cursor: default;
}

.notification-item:last-child {
  margin-bottom: 0;
}

.notification-item:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--border-subtle);
}

/* Grade Indicator */
.grade-indicator {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.grade-indicator svg {
  width: 20px;
  height: 20px;
}

.grade-indicator.grade-a {
  background-color: var(--grade-a-bg);
  color: var(--grade-a);
}

.grade-indicator.grade-b {
  background-color: var(--grade-b-bg);
  color: var(--grade-b);
}

.grade-indicator.grade-reject {
  background-color: var(--grade-c-bg);
  color: var(--grade-c);
}

/* Item Info */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.egg-id {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-title);
  font-family: var(--font-mono);
}

.grade-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.02em;
}

.grade-badge.grade-a {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--grade-a);
}

.grade-badge.grade-b {
  background-color: rgba(59, 130, 246, 0.15);
  color: var(--grade-b);
}

.grade-badge.grade-reject {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--grade-c);
}

.item-timestamp {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
}

.item-meta {
  font-size: 0.68rem;
  color: var(--text-subtle);
  font-family: var(--font-mono);
}

.item-meta strong {
  color: var(--teal-primary);
  font-weight: 700;
}

/* Detail Button */
.detail-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: var(--teal-light);
  border: 1px solid var(--teal-border);
  color: var(--teal-primary);
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.detail-button:hover {
  background-color: var(--teal-primary);
  border-color: var(--teal-primary);
  color: #ffffff;
  transform: translateX(2px);
}

.detail-button svg {
  width: 12px;
  height: 12px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  color: var(--text-subtle);
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* Backdrop */
.dropdown-backdrop {
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 999;
}

/* Animations */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.2s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 9999px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

@media (max-width: 480px) {
  .dropdown-panel {
    width: calc(100vw - 32px);
  }
}
</style>
