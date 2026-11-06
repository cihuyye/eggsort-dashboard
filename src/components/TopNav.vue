<template>
  <header class="top-nav">
    <!-- Right Controls: Status Pill, Theme Toggle, Operator Profile -->
    <div class="header-right">
      <!-- ESP32-CAM Stream Status Pill -->
      <div class="status-pill" :class="{ 'status-offline': !isAutoMode }">
        <span class="status-indicator"></span>
        <span class="status-text">
          {{ isAutoMode ? `ESP32-CAM ONLINE // ${fps} FPS` : 'ESP32-CAM SIAGA // MESIN STOP' }}
        </span>
      </div>

      <!-- Theme Switcher: Minimalist Modern Icon Button -->
      <button
        class="theme-toggle-btn"
        @click="toggleTheme"
        :title="theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
        aria-label="Toggle theme"
      >
        <svg v-if="theme === 'dark'" class="theme-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg v-else class="theme-icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <!-- Operator Profile Badge (Clickable to open profile!) -->
      <div
        class="operator-badge"
        :class="{ active: activeTab === 'profile' }"
        @click="$emit('select-profile')"
        title="Buka Pengaturan Akun Operator"
      >
        <div class="operator-avatar">
          <img
            v-if="operatorProfile && operatorProfile.avatarUrl"
            :src="operatorProfile.avatarUrl"
            alt="Operator Avatar"
            class="top-avatar-img"
          />
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div class="operator-info">
          <div class="operator-name">
            {{ operatorProfile ? operatorProfile.fullName : 'Operator Polije' }}
          </div>
          <div class="operator-shift">
            {{ operatorProfile && operatorProfile.shift ? operatorProfile.shift : 'Operator Station' }}
          </div>
        </div>
        <div class="operator-dropdown-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  theme: {
    type: String,
    required: true
  },
  toggleTheme: {
    type: Function,
    required: true
  },
  fps: {
    type: [Number, String],
    default: 29.8
  },
  isAutoMode: {
    type: Boolean,
    default: true
  },
  activeTab: {
    type: String,
    default: 'dashboard'
  },
  operatorProfile: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['select-profile'])
</script>

<style scoped>
.top-nav {
  height: 64px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-card);
  padding: 0 28px;
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
  gap: 14px;
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

/* Minimalist Icon Theme Toggle */
.theme-toggle-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-body);
}

.theme-toggle-btn:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
  transform: translateY(-1px);
}

.theme-icon {
  width: 17px;
  height: 17px;
}

.theme-icon.sun {
  color: #fbbf24;
}

.theme-icon.moon {
  color: #38bdf8;
}

/* Operator Badge */
.operator-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px 4px 6px;
  border-radius: 9999px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.operator-badge:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--teal-primary);
  transform: translateY(-1px);
}

.operator-badge.active {
  border-color: var(--teal-primary);
  background-color: var(--teal-light);
}

.operator-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #059669, #0d9488);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.top-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.operator-avatar svg {
  width: 16px;
  height: 16px;
}

.operator-info {
  line-height: 1.2;
}

.operator-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-title);
}

.operator-shift {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.operator-dropdown-icon {
  color: var(--text-subtle);
  display: flex;
  align-items: center;
}

.operator-dropdown-icon svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .top-nav {
    padding: 0 16px;
  }
  .operator-shift {
    display: none;
  }
}
</style>
