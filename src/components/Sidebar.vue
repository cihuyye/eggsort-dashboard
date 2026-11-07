<template>
  <aside class="sidebar">
    <!-- Brand / Logo Header -->
    <div class="sidebar-header">
      <div class="logo-box">
        <div class="logo-icon-wrapper">
          <div class="logo-glow-ring"></div>
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8 2 4.5 7 4.5 13.5C4.5 18 7.8 22 12 22C16.2 22 19.5 18 19.5 13.5C19.5 7 16 2 12 2Z" />
              <circle cx="12" cy="13.5" r="3.5" stroke-dasharray="2 2" />
              <path d="M12 8V10" />
              <path d="M12 17V19" />
              <path d="M6.5 13.5H8.5" />
              <path d="M15.5 13.5H17.5" />
            </svg>
          </div>
        </div>

        <div class="logo-text">
          <div class="logo-title-row">
            <span class="brand-title">EggSort-AI</span>
          </div>
          <div class="brand-subtitle">Industrial Vision AI System</div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu Section -->
    <div class="nav-section">
      <div class="nav-label-row">
        <span class="nav-label">CORE OPERATIONS</span>
        <span class="nav-live-dot"></span>
      </div>

      <nav class="nav-menu">
        <!-- 1. Dashboard -->
        <button
          class="nav-item"
          :class="{ active: activeTab === 'dashboard' }"
          @click="$emit('update:activeTab', 'dashboard')"
        >
          <div class="icon-wrap">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          </div>
          <span class="nav-text">Dashboard</span>
          <span v-if="activeTab === 'dashboard'" class="active-badge-dot"></span>
        </button>

        <!-- 2. Live Camera -->
        <button
          class="nav-item"
          :class="{ active: activeTab === 'camera' }"
          @click="$emit('update:activeTab', 'camera')"
        >
          <div class="icon-wrap">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <span class="nav-text">Live Camera</span>
          <span class="item-tag-live">LIVE</span>
        </button>

        <!-- 2. Riwayat & Analitik -->
        <button
          class="nav-item"
          :class="{ active: activeTab === 'history' }"
          @click="$emit('update:activeTab', 'history')"
        >
          <div class="icon-wrap">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18" />
              <path d="M18.5 8.5L13.5 13.5L9.5 9.5L5 14" />
            </svg>
          </div>
          <span class="nav-text">Riwayat & Analitik</span>
        </button>

        <!-- 3. Kontrol Simulator & Kalibrasi -->
        <button
          class="nav-item"
          :class="{ active: activeTab === 'calibration' }"
          @click="$emit('update:activeTab', 'calibration')"
        >
          <div class="icon-wrap">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <span class="nav-text">Kontrol Simulator & Kalibrasi</span>
        </button>

        <!-- 4. Parameter Mutu & Info Sistem -->
        <button
          class="nav-item"
          :class="{ active: activeTab === 'settings' }"
          @click="$emit('update:activeTab', 'settings')"
        >
          <div class="icon-wrap">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <span class="nav-text">Parameter Mutu & Info Sistem</span>
          <span class="item-tag-sni">SNI</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Operator Profile Card (Click to enter Profile) -->
    <div class="sidebar-footer">
      <div
        class="polije-card"
        :class="{ active: activeTab === 'profile' }"
        @click="$emit('update:activeTab', 'profile')"
        title="Klik untuk membuka Profil Operator"
      >
        <div class="sidebar-avatar-wrap">
          <img
            v-if="operatorProfile && operatorProfile.avatarUrl"
            :src="operatorProfile.avatarUrl"
            alt="Foto Operator"
            class="sidebar-avatar-img"
          />
          <div v-else class="sidebar-avatar-fallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <div class="polije-text">
          <div class="polije-title">
            {{ operatorProfile && operatorProfile.fullName ? operatorProfile.fullName : 'Ahmad Fauzi' }}
          </div>
        </div>
        <span v-if="activeTab === 'profile'" class="bottom-active-dot"></span>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    default: 'dashboard'
  },
  operatorProfile: {
    type: Object,
    default: () => ({})
  }
})
defineEmits(['update:activeTab'])
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  user-select: none;
  z-index: 50;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  padding: 16px 14px;
  border-bottom: 1px solid var(--sidebar-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%);
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow-ring {
  position: absolute;
  inset: -2px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
  border-radius: 9px;
  filter: blur(4px);
  opacity: 0.6;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #14b8a6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(5, 150, 105, 0.4);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-icon svg {
  width: 17px;
  height: 17px;
}

.logo-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-title {
  font-weight: 800;
  font-size: 0.95rem;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 0.60rem;
  color: #64748b;
  margin-top: 1px;
  font-weight: 500;
}

/* Nav Menu Section */
.nav-section {
  padding: 14px 8px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.nav-label {
  font-size: 0.58rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.08em;
}

.nav-live-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 5px #10b981;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 8px 12px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--sidebar-text);
  font-size: 0.73rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  position: relative;
  min-height: 36px;
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.nav-icon {
  width: 15px;
  height: 15px;
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.nav-text {
  flex: 1;
  font-size: 0.73rem;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: none;
  min-width: 0;
}

.nav-item:hover {
  background: var(--bg-sidebar-hover);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.05);
}

.nav-item:hover .nav-icon {
  transform: translateX(2px);
  opacity: 1;
}

/* Subtle Active State with Accent Bar */
.nav-item.active {
  background: rgba(5, 150, 105, 0.12);
  color: #10b981;
  font-weight: 700;
  border-color: rgba(5, 150, 105, 0.2);
  position: relative;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  border-radius: 0 2px 2px 0;
}

.nav-item.active .nav-icon {
  opacity: 1;
  color: #10b981;
}

.active-badge-dot {
  width: 5px;
  height: 5px;
  background-color: #10b981;
  border-radius: 50%;
}

.item-tag-sni {
  font-size: 0.52rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: var(--font-mono);
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.nav-item.active .item-tag-sni {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.item-tag-live {
  font-size: 0.50rem;
  font-weight: 800;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  flex-shrink: 0;
  animation: livePulse 2s ease-in-out infinite;
}

.nav-item.active .item-tag-live {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  animation: none;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Institutional Footer Badge */
.sidebar-footer {
  padding: 10px 8px;
  border-top: 1px solid var(--sidebar-border);
}

.polije-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.22s ease;
  position: relative;
}

.polije-card:hover {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.polije-card.active {
  background: rgba(5, 150, 105, 0.12);
  border-color: rgba(16, 185, 129, 0.4);
  position: relative;
}

.polije-card.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: #10b981;
  border-radius: 0 2px 2px 0;
}

.sidebar-avatar-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background-color: #1e293b;
  transition: all 0.2s ease;
}

.polije-card.active .sidebar-avatar-wrap {
  border-color: #10b981;
}

.sidebar-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #059669, #0d9488);
  color: #ffffff;
}

.sidebar-avatar-fallback svg {
  width: 16px;
  height: 16px;
}

.polije-text {
  flex: 1;
  min-width: 0;
}

.polije-title {
  font-size: 0.74rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.polije-card.active .polije-title {
  color: #10b981;
}

.polije-sub {
  font-size: 0.58rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bottom-active-dot {
  width: 5px;
  height: 5px;
  background-color: #10b981;
  border-radius: 50%;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 76px;
    min-width: 76px;
  }
  .logo-text, .nav-label-row, .nav-text, .item-tag-sni, .polije-text, .active-badge-dot, .bottom-active-dot {
    display: none;
  }
  .sidebar-header {
    padding: 18px 12px;
    display: flex;
    justify-content: center;
  }
  .nav-item {
    justify-content: center;
    padding: 14px 10px;
  }
  .polije-card {
    padding: 10px;
    justify-content: center;
  }
}
</style>
