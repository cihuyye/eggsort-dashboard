<template>
  <div class="profile-page">
    <!-- Top Header & Breadcrumb -->
    <div class="profile-page-header">
      <div class="header-titles">
        <div class="category-tag font-mono">
          AKUN OPERATOR // PENGATURAN PROFIL & KEAMANAN
        </div>
        <h1 class="page-title">Pengaturan Akun Operator</h1>
        <p class="page-subtitle">
          Kelola data informasi personal, kredensial masuk, dan keamanan akun Anda di stasiun kerja EggSort-AI.
        </p>
      </div>

      <!-- Section Switcher Tabs -->
      <div class="header-action-tabs">
        <button
          class="tab-btn"
          :class="{ active: profileTab === 'personal' }"
          @click="profileTab = 'personal'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Data Personal</span>
        </button>

        <button
          class="tab-btn"
          :class="{ active: profileTab === 'security' }"
          @click="profileTab = 'security'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Kata Sandi</span>
        </button>
      </div>
    </div>

    <!-- Hero Profile Identity Card -->
    <div class="hero-profile-card">
      <div class="hero-left">
        <!-- Avatar with Online Dot -->
        <div class="avatar-container">
          <img
            :src="formAvatar || operatorProfile.avatarUrl"
            alt="Operator Avatar"
            class="operator-img"
          />
          <span class="avatar-online-badge" title="Status: Online & Mengawasi"></span>
        </div>

        <div class="hero-identity-text">
          <div class="name-badge-row">
            <h2 class="operator-display-name">
              {{ formFullName }}
            </h2>
            <span class="status-chip-active">
              <span class="chip-dot"></span>
              {{ operatorProfile.roleTag }}
            </span>
          </div>
          <div class="email-info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{{ formEmail }}</span>
          </div>
        </div>
      </div>

      <!-- Avatar Actions -->
      <div class="hero-right">
        <input
          type="file"
          ref="avatarFileInput"
          accept="image/*"
          style="display: none"
          @change="onAvatarFileChange"
        />
        <button class="btn-upload-photo" @click="triggerAvatarUpload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>Unggah Foto</span>
        </button>

        <button class="btn-remove-photo" @click="removeAvatar" title="Hapus foto profil">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content 2-Column Grid -->
    <div class="profile-grid">
      <!-- Left Column: Informasi Pribadi Form -->
      <div class="card-section form-card">
        <div class="card-section-header">
          <div class="header-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div class="header-text-block">
            <h3 class="card-title">Informasi Pribadi</h3>
            <p class="card-desc">Perbarui identitas profil dan detail kontak kerja Anda.</p>
          </div>
        </div>

        <form @submit.prevent="savePersonalInfo" class="form-body">
          <!-- Nama Lengkap -->
          <div class="form-group">
            <label class="form-label">NAMA LENGKAP</label>
            <input
              type="text"
              v-model="formFullName"
              class="form-input"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <!-- Email & Nomor WhatsApp (2 Columns) -->
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">EMAIL INSTITUSI</label>
              <input
                type="email"
                v-model="formEmail"
                class="form-input"
                placeholder="operator@polije.ac.id"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">NOMOR WHATSAPP / TELEPON</label>
              <input
                type="text"
                v-model="formPhone"
                class="form-input"
                placeholder="+62 812-3456-7890"
                required
              />
            </div>
          </div>

          <!-- Form Action Buttons -->
          <div class="form-actions-footer">
            <button type="button" class="btn-cancel" @click="resetPersonalForm">
              Batal
            </button>
            <button type="submit" class="btn-save-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Right Column: Password & Active Session -->
      <div class="right-column-stack">
        <!-- 1. Ganti Kata Sandi Card -->
        <div class="card-section password-card">
          <div class="card-section-header">
            <div class="header-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div class="header-text-block">
              <h3 class="card-title">Ganti Kata Sandi</h3>
              <p class="card-desc">Perbarui sandi akun secara berkala.</p>
            </div>
          </div>

          <form @submit.prevent="submitChangePassword" class="form-body">
            <!-- Kata Sandi Saat Ini -->
            <div class="form-group">
              <label class="form-label">KATA SANDI SAAT INI</label>
              <div class="input-with-eye">
                <input
                  :type="showCurPass ? 'text' : 'password'"
                  v-model="curPassword"
                  class="form-input"
                  placeholder="••••••••••••"
                  required
                />
                <button type="button" class="btn-eye" @click="showCurPass = !showCurPass">
                  <svg v-if="showCurPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Kata Sandi Baru -->
            <div class="form-group">
              <label class="form-label">KATA SANDI BARU</label>
              <div class="input-with-eye">
                <input
                  :type="showNewPass ? 'text' : 'password'"
                  v-model="newPassword"
                  class="form-input"
                  placeholder="Minimal 8 karakter"
                  required
                />
                <button type="button" class="btn-eye" @click="showNewPass = !showNewPass">
                  <svg v-if="showNewPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Konfirmasi Kata Sandi Baru -->
            <div class="form-group">
              <label class="form-label">KONFIRMASI KATA SANDI BARU</label>
              <input
                type="password"
                v-model="confirmPassword"
                class="form-input"
                placeholder="Ulangi kata sandi baru"
                required
              />
            </div>

            <!-- Password Requirements Checklist -->
            <div class="password-rules-box">
              <div class="rules-label">KETENTUAN SANDI:</div>
              <div class="rule-item" :class="{ met: isMinLengthMet }">
                <span class="rule-icon">
                  <svg v-if="isMinLengthMet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span v-else class="empty-circle"></span>
                </span>
                <span>Minimal 8 karakter kombinasi</span>
              </div>
              <div class="rule-item" :class="{ met: isCapitalNumberMet }">
                <span class="rule-icon">
                  <svg v-if="isCapitalNumberMet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span v-else class="empty-circle"></span>
                </span>
                <span>Mengandung setidaknya 1 huruf kapital &amp; angka</span>
              </div>
              <div
                class="rule-item"
                :class="{
                  met: isDifferentFromCurrent && curPassword.length > 0 && newPassword.length > 0,
                  invalid: !isDifferentFromCurrent && curPassword.length > 0 && newPassword.length > 0
                }"
              >
                <span class="rule-icon">
                  <svg v-if="isDifferentFromCurrent && curPassword.length > 0 && newPassword.length > 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg v-else-if="!isDifferentFromCurrent && curPassword.length > 0 && newPassword.length > 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="icon-error">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span v-else class="empty-circle"></span>
                </span>
                <span>
                  {{ !isDifferentFromCurrent && curPassword.length > 0 && newPassword.length > 0
                    ? 'Sandi baru tidak boleh sama dengan sandi saat ini!'
                    : 'Tidak boleh sama dengan sandi saat ini' }}
                </span>
              </div>
            </div>

            <button type="submit" class="btn-update-password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 2l-2 2m-6 6l7-7" />
                <path d="M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0z" />
              </svg>
              <span>Perbarui Kata Sandi</span>
            </button>
          </form>
        </div>

        <!-- 2. Sesi Login Aktif Card -->
        <div class="card-section session-card">
          <div class="card-section-header">
            <div class="header-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div class="header-text-block">
              <h3 class="card-title">Sesi Login Aktif</h3>
            </div>
          </div>

          <div class="session-box">
            <div class="session-icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div class="session-details">
              <div class="workstation-name">{{ operatorProfile.workstation }}</div>
              <div class="workstation-ip font-mono">{{ operatorProfile.ipAddress }}</div>
              <div class="workstation-time">Login {{ operatorProfile.loginTime }}</div>
            </div>
          </div>

          <div class="session-footer">
            <div class="footer-desc">
              <div class="footer-desc-title">Keluar Dari Sesi</div>
              <div class="footer-desc-sub">Akhiri sesi ini dari sistem konsol</div>
            </div>
            <button class="btn-logout" @click="handleLogout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  operatorProfile: {
    type: Object,
    required: true
  },
  updateProfile: {
    type: Function,
    required: true
  },
  triggerToast: {
    type: Function,
    required: true
  }
})

const profileTab = ref('personal')

// Form Personal State
const formFullName = ref(props.operatorProfile.fullName)
const formEmail = ref(props.operatorProfile.email)
const formPhone = ref(props.operatorProfile.phone)
const formAvatar = ref(props.operatorProfile.avatarUrl)

// Password Form State
const curPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurPass = ref(false)
const showNewPass = ref(false)

const avatarFileInput = ref(null)

const isMinLengthMet = computed(() => newPassword.value.length >= 8)
const isCapitalNumberMet = computed(() => {
  const val = newPassword.value
  return /[A-Z]/.test(val) && /[0-9]/.test(val)
})
const isDifferentFromCurrent = computed(() => {
  if (!curPassword.value || !newPassword.value) return true
  return curPassword.value !== newPassword.value
})

const triggerAvatarUpload = () => {
  avatarFileInput.value?.click()
}

const onAvatarFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      formAvatar.value = event.target.result
      props.updateProfile({ avatarUrl: formAvatar.value })
      props.triggerToast('Foto profil operator berhasil diperbarui!')
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  if (confirm('Hapus foto profil operator?')) {
    formAvatar.value = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'
    props.updateProfile({ avatarUrl: formAvatar.value })
    props.triggerToast('Foto profil telah di-reset ke avatar default.')
  }
}

const resetPersonalForm = () => {
  formFullName.value = props.operatorProfile.fullName
  formEmail.value = props.operatorProfile.email
  formPhone.value = props.operatorProfile.phone
  props.triggerToast('Formulir dibatalkan ke data awal.')
}

const savePersonalInfo = () => {
  props.updateProfile({
    fullName: formFullName.value,
    email: formEmail.value,
    phone: formPhone.value,
    avatarUrl: formAvatar.value
  })
}

const submitChangePassword = () => {
  if (curPassword.value && newPassword.value && curPassword.value === newPassword.value) {
    props.triggerToast('Kata sandi baru tidak boleh sama dengan kata sandi saat ini!')
    return
  }
  if (!isMinLengthMet.value) {
    props.triggerToast('Kata sandi harus minimal 8 karakter!')
    return
  }
  if (!isCapitalNumberMet.value) {
    props.triggerToast('Kata sandi harus mengandung kombinasi huruf kapital dan angka!')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    props.triggerToast('Konfirmasi kata sandi baru tidak cocok!')
    return
  }
  curPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  props.triggerToast('Kata sandi operator berhasil diperbarui!')
}

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar dari sesi stasiun kerja ini?')) {
    props.triggerToast('Sesi operator berhasil diakhiri.')
  }
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* Page Header */
.profile-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.category-tag {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--teal-primary);
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-title);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.84rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.header-action-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 4px;
  border-radius: 9px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn svg {
  width: 15px;
  height: 15px;
}

.tab-btn:hover {
  color: var(--text-title);
}

.tab-btn.active {
  background-color: var(--bg-card-subtle);
  color: var(--text-title);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

html.dark .tab-btn.active {
  background-color: #1e293b;
  color: #38bdf8;
}

/* Hero Profile Card */
.hero-profile-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  gap: 16px;
  transition: all 0.2s ease;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar-container {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 14px;
  overflow: visible;
}

.operator-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  border: 2px solid var(--border-card);
  background-color: #1e293b;
}

.avatar-online-badge {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  background-color: #10b981;
  border: 2.5px solid var(--bg-card);
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.name-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.operator-display-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-title);
  letter-spacing: -0.01em;
}

.degree-text {
  color: var(--text-muted);
  font-weight: 600;
}

.status-chip-active {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 700;
  background-color: var(--teal-light);
  color: var(--teal-primary);
  border: 1px solid var(--teal-border);
  padding: 2px 8px;
  border-radius: 9999px;
  font-family: var(--font-mono);
}

.chip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #10b981;
}

.email-info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
  font-family: var(--font-mono);
}

.email-info-row svg {
  width: 14px;
  height: 14px;
  color: var(--teal-primary);
}

.hero-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-upload-photo {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-upload-photo:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.btn-upload-photo svg {
  width: 15px;
  height: 15px;
  color: var(--text-muted);
}

.btn-remove-photo {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-photo:hover {
  color: var(--grade-c);
  border-color: var(--grade-c-border);
  background-color: var(--grade-c-bg);
}

.btn-remove-photo svg {
  width: 16px;
  height: 16px;
}

/* 2-Column Grid Layout */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.right-column-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Card Sections */
.card-section {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 22px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: all 0.2s ease;
}

.card-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.header-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--teal-light);
  color: var(--teal-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon-box svg {
  width: 17px;
  height: 17px;
}

.card-title {
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--text-title);
}

.card-desc {
  font-size: 0.74rem;
  color: var(--text-muted);
  margin-top: 1px;
}

/* Forms */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.84rem;
  color: var(--text-title);
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  border-color: var(--teal-primary);
  background-color: var(--bg-card);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.form-input:read-only {
  opacity: 0.75;
  cursor: default;
}

.input-with-eye {
  position: relative;
  display: flex;
  align-items: center;
}

.btn-eye {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--text-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn-eye:hover {
  color: var(--text-title);
}

.btn-eye svg {
  width: 16px;
  height: 16px;
}

/* Password Rules Checklist */
.password-rules-box {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rules-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.74rem;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.rule-item.met {
  color: var(--teal-primary);
  font-weight: 600;
}

.rule-item.invalid {
  color: var(--grade-c);
  font-weight: 600;
}

.icon-error {
  color: var(--grade-c);
}

.rule-icon {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rule-icon svg {
  width: 13px;
  height: 13px;
  color: var(--teal-primary);
}

.empty-circle {
  width: 11px;
  height: 11px;
  border: 1.5px solid var(--text-subtle);
  border-radius: 50%;
}

/* Form Action Buttons */
.form-actions-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
  margin-top: 8px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border-card);
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: var(--bg-card-hover);
  color: var(--text-title);
}

.btn-save-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #00dfa2 0%, #059669 100%);
  color: #042f2e;
  border: none;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 223, 162, 0.3);
}

.btn-save-primary svg {
  width: 15px;
  height: 15px;
}

.btn-save-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 223, 162, 0.45);
}

.btn-update-password {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, #00dfa2 0%, #059669 100%);
  color: #042f2e;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 223, 162, 0.3);
  width: 100%;
}

.btn-update-password svg {
  width: 15px;
  height: 15px;
}

.btn-update-password:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 223, 162, 0.45);
}

/* Session Box */
.session-box {
  display: flex;
  align-items: center;
  gap: 14px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 14px 16px;
  border-radius: 10px;
}

.session-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background-color: var(--teal-light);
  color: var(--teal-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.session-icon-circle svg {
  width: 20px;
  height: 20px;
}

.workstation-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-title);
}

.workstation-ip {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.workstation-time {
  font-size: 0.68rem;
  color: var(--teal-primary);
  font-weight: 600;
  margin-top: 2px;
}

.session-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
  gap: 12px;
}

.footer-desc-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-title);
}

.footer-desc-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--grade-c-bg);
  border: 1px solid var(--grade-c-border);
  color: var(--grade-c);
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: var(--grade-c);
  color: #ffffff;
}

.btn-logout svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .form-row-2 {
    grid-template-columns: 1fr;
  }
}
</style>

