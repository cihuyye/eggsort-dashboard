<template>
  <div class="ai-chat-page-wrapper">
    <!-- Top Sleek Header Toolbar -->
    <div class="ai-chat-header-card">
      <div class="header-left">
        <div class="ai-avatar-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sparkle-svg">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            <path d="M5 3L6.2 6.8L10 8L6.2 9.2L5 13L3.8 9.2L0 8L3.8 6.8L5 3Z" opacity="0.6" />
          </svg>
        </div>
        <div class="header-text">
          <div class="title-row">
            <h1 class="main-title">Auditor Mutu AI</h1>
            <span class="api-status-pill" :class="apiOnline ? 'pill-online' : 'pill-offline'">
              <span class="status-dot"></span>
              {{ apiOnline ? 'API Terhubung' : 'Offline' }}
            </span>
          </div>
          <span class="header-tagline">Konsultasi Mutu & Standardisasi Telur Ayam Konsumsi (SNI 3926:2023)</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="header-actions">
        <!-- Tombol Info & Standar (Memindahkan semua info teks panjang ke modal) -->
        <button class="header-btn btn-info-highlight" @click="showInfoModal = true" title="Tentang Auditor AI, Guardrail, & Standar SNI">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Info & Standar</span>
        </button>

        <!-- Tombol Setel Gemini API Key -->
        <button class="header-btn" :class="{ 'btn-key-active': !!savedApiKey }" @click="openKeyModal" title="Atur Google Gemini API Key">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5-7 7a2 2 0 0 0 0 3l2 2a2 2 0 0 0 3 0l7-7L19 11l3.5-3.5a2 2 0 0 0 0-3L21 2z" />
          </svg>
          <span>{{ savedApiKey ? 'Gemini Key (Aktif)' : 'Setel API Key' }}</span>
        </button>

        <!-- Tombol Salin Chat -->
        <button class="header-btn" @click="copyConversation" title="Salin riwayat percakapan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Salin</span>
        </button>

        <!-- Tombol Bersihkan Chat -->
        <button class="header-btn btn-danger-subtle" @click="clearChat" title="Reset percakapan dari awal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Bersihkan</span>
        </button>
      </div>
    </div>

    <!-- Modal Informasi & Standar SNI (Info-info dipusatkan di sini) -->
    <div v-if="showInfoModal" class="modal-backdrop" @click.self="showInfoModal = false">
      <div class="modal-card modal-card-lg">
        <div class="modal-header">
          <div class="modal-title-row">
            <span class="modal-icon">ℹ️</span>
            <div>
              <h3>Tentang Auditor Mutu AI & Regulasi SNI</h3>
              <p class="modal-subtitle">Panduan sistem, standar acuan mutu, dan mekanisme anti-halusinasi</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="showInfoModal = false">✕</button>
        </div>

        <!-- Navigation Tabs Modal -->
        <div class="modal-tabs">
          <button
            class="modal-tab-btn"
            :class="{ active: infoActiveTab === 'standar' }"
            @click="infoActiveTab = 'standar'"
          >
            📋 Standar SNI 3926:2023
          </button>
          <button
            class="modal-tab-btn"
            :class="{ active: infoActiveTab === 'guardrail' }"
            @click="infoActiveTab = 'guardrail'"
          >
            🛡️ Guardrail Anti-Halusinasi
          </button>
          <button
            class="modal-tab-btn"
            :class="{ active: infoActiveTab === 'model' }"
            @click="infoActiveTab = 'model'"
          >
            ⚙️ Model AI & Arsitektur
          </button>
        </div>

        <div class="modal-body-scroll">
          <!-- TAB 1: STANDAR SNI 3926:2023 -->
          <div v-if="infoActiveTab === 'standar'" class="info-section">
            <h4 class="section-title">Klasifikasi Mutu Kerabang Telur (Tabel 1 SNI 3926:2023)</h4>
            <div class="grade-cards-grid">
              <div class="grade-info-box box-grade-a">
                <div class="box-header">
                  <span class="grade-badge badge-a">Mutu I (Grade A)</span>
                  <span class="grade-market">Konsumsi Segar / Ritel</span>
                </div>
                <ul class="grade-specs-list">
                  <li><strong>Kerabang:</strong> Utuh, halus, bebas dari retak dan noda kotoran/feses.</li>
                  <li><strong>Indeks Bentuk (ESI):</strong> Proporsional normal antara 72% – 76%.</li>
                  <li><strong>Aksi Mekanik:</strong> Gate 1 mengarahkan ke konveyor baki kemasan ritel.</li>
                </ul>
              </div>

              <div class="grade-info-box box-grade-b">
                <div class="box-header">
                  <span class="grade-badge badge-b">Mutu II (Grade B)</span>
                  <span class="grade-market">Industri Olahan Pangan</span>
                </div>
                <ul class="grade-specs-list">
                  <li><strong>Kerabang:</strong> Utuh, toleransi noda kotoran ringan ≤ 1/32 (≤ 3.125%) luas cangkang.</li>
                  <li><strong>Indeks Bentuk (ESI):</strong> Agak lonjong (&lt;72%) atau agak bulat (&gt;76%).</li>
                  <li><strong>Aksi Mekanik:</strong> Gate 2 mengarahkan ke wadah bahan baku bakery/mie.</li>
                </ul>
              </div>

              <div class="grade-info-box box-grade-c">
                <div class="box-header">
                  <span class="grade-badge badge-c">Mutu III (Reject / Afkir)</span>
                  <span class="grade-market">Karantina Pangan</span>
                </div>
                <ul class="grade-specs-list">
                  <li><strong>Kerabang:</strong> Retak (hairline / pecah) atau noda kotoran parah &gt; 1/16 (&gt; 6.25%).</li>
                  <li><strong>Bahaya Pangan:</strong> Risiko tinggi cemaran bakteri <em>Salmonella sp.</em></li>
                  <li><strong>Aksi Mekanik:</strong> Piston Reject segera mengafkirkan telur dari jalur konsumsi.</li>
                </ul>
              </div>
            </div>

            <h4 class="section-title mt-4">Klasifikasi Bobot Telur (Tabel 2 SNI 3926:2023)</h4>
            <div class="weight-table-wrap">
              <table class="simple-table">
                <thead>
                  <tr>
                    <th>Kategori Ukuran</th>
                    <th>Bobot per Butir</th>
                    <th>Peruntukan Kemasan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Sangat Besar (Jumbo)</strong></td>
                    <td>&gt; 60 gram</td>
                    <td>Baki Khusus Ukuran Jumbo</td>
                  </tr>
                  <tr>
                    <td><strong>Besar</strong></td>
                    <td>55 – 60 gram</td>
                    <td>Wadah Ritel Standar Premium</td>
                  </tr>
                  <tr>
                    <td><strong>Sedang</strong></td>
                    <td>50 – 54.9 gram</td>
                    <td>Wadah Ritel Standar Umum</td>
                  </tr>
                  <tr>
                    <td><strong>Kecil</strong></td>
                    <td>&lt; 50 gram</td>
                    <td>Industri Olahan / Kemasan Ekonomis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 2: GUARDRAIL ANTI-HALUSINASI -->
          <div v-if="infoActiveTab === 'guardrail'" class="info-section">
            <h4 class="section-title">Mekanisme Pengendali Integritas Data (Anti-Halusinasi)</h4>
            <div class="guardrail-grid">
              <div class="guardrail-card">
                <div class="guardrail-icon">🎯</div>
                <div class="guardrail-text">
                  <h5>Grounding Data Ketat</h5>
                  <p>AI hanya diperbolehkan merujuk pada data numerik hasil inspeksi sensor (YOLOv8 & OpenCV) dan dilarang mengarang angka di luar input.</p>
                </div>
              </div>

              <div class="guardrail-card">
                <div class="guardrail-icon">🔒</div>
                <div class="guardrail-text">
                  <h5>Konsistensi Vonis Mutu</h5>
                  <p>Keputusan Grade dari Decision Engine SNI bersifat mutlak. AI dilarang mengubah atau menyarankan grade berbeda.</p>
                </div>
              </div>

              <div class="guardrail-card">
                <div class="guardrail-icon">🌡️</div>
                <div class="guardrail-text">
                  <h5>Suhu Deterministik (Temp: 0.2)</h5>
                  <p>Parameter generasi disetel rendah (temperature 0.2, top_p 0.8) agar respon bersifat faktual, ilmiah, dan tidak bias kreatif.</p>
                </div>
              </div>

              <div class="guardrail-card">
                <div class="guardrail-icon">⛔</div>
                <div class="guardrail-text">
                  <h5>Pembatas Topik (Negative Keywords)</h5>
                  <p>Prompt di luar telur (pemrograman, politik, resep umum, dll) otomatis ditolak dengan peringatan batasan sistem.</p>
                </div>
              </div>

              <div class="guardrail-card">
                <div class="guardrail-icon">🛡️</div>
                <div class="guardrail-text">
                  <h5>Post-Filter Keamanan Pangan</h5>
                  <p>Memastikan telur retak tidak pernah direkomendasikan untuk dikonsumsi mentah/setengah matang karena bahaya patogen.</p>
                </div>
              </div>

              <div class="guardrail-card">
                <div class="guardrail-icon">🧠</div>
                <div class="guardrail-text">
                  <h5>History Limiter</h5>
                  <p>Riwayat percakapan dibatasi 10 turn terakhir untuk mencegah context drift (penyimpangan konteks percakapan).</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: MODEL & ARSITEKTUR -->
          <div v-if="infoActiveTab === 'model'" class="info-section">
            <h4 class="section-title">Arsitektur Integrasi AI</h4>
            <div class="tech-spec-list">
              <div class="tech-spec-row">
                <span class="spec-label">Model Utama</span>
                <span class="spec-value mono">Google Gemini (gemini-3.5-flash)</span>
              </div>
              <div class="tech-spec-row">
                <span class="spec-label">Auto-Fallback Chain</span>
                <span class="spec-value mono">gemini-3.5-flash → gemini-3.5-flash-lite → gemini-3.6-flash</span>
              </div>
              <div class="tech-spec-row">
                <span class="spec-label">SDK Driver</span>
                <span class="spec-value mono">google-genai v3.6.1 (Official SDK via v1beta)</span>
              </div>
              <div class="tech-spec-row">
                <span class="spec-label">Fallback Offline</span>
                <span class="spec-value">SNI Rule-based Knowledge Engine (Aktif otomatis saat offline)</span>
              </div>
              <div class="tech-spec-row">
                <span class="spec-label">Computer Vision</span>
                <span class="spec-value">YOLOv8-seg (Inspeksi Cangkang 360°) + OpenCV (Dimensi & ESI)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn btn-primary" @click="showInfoModal = false">Tutup Panduan</button>
        </div>
      </div>
    </div>

    <!-- Modal Pengaturan API Key -->
    <div v-if="showKeyModal" class="modal-backdrop" @click.self="showKeyModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title-row">
            <span class="modal-icon">🔑</span>
            <div>
              <h3>Konfigurasi Google Gemini API Key</h3>
              <p class="modal-subtitle">Aktifkan koneksi langsung ke Google AI Studio</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="showKeyModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">
            Masukkan <strong>Google Gemini API Key</strong> Anda untuk mengaktifkan penalaran penuh Gemini AI.
            Jika tidak disetel, sistem tetap beroperasi menggunakan <strong>Engine Mutu SNI 3926:2023 (Offline Fallback)</strong>.
          </p>
          <div class="key-input-wrap">
            <label>Gemini API Key:</label>
            <input
              type="password"
              v-model="tempApiKey"
              placeholder="AIzaSy..."
              class="key-text-input"
            />
          </div>
          <div class="key-help">
            Dapatkan API Key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>.
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn btn-secondary" @click="removeApiKey" v-if="savedApiKey">Hapus Key</button>
          <button class="modal-btn btn-secondary" @click="showKeyModal = false">Batal</button>
          <button class="modal-btn btn-primary" @click="saveApiKey">Simpan Key</button>
        </div>
      </div>
    </div>

    <!-- Context Inspection Bar (Clean & Compact) -->
    <div class="context-bar" :class="{ 'context-active': useContext && hasValidEgg }">
      <div class="context-left">
        <span class="context-pill-icon">🥚</span>
        <div v-if="hasValidEgg" class="context-compact-info">
          <span class="egg-id-badge">{{ currentEgg.eggId }}</span>
          <span class="grade-pill" :class="gradePillClass">{{ currentEgg.gradeLabel || currentEgg.grade }}</span>
          <span class="meta-separator">•</span>
          <span class="meta-tag">Cangkang: <strong>{{ currentEgg.shellIntegrity }}</strong></span>
          <span class="meta-separator">•</span>
          <span class="meta-tag">ESI: <strong>{{ currentEgg.shapeIndex }}%</strong></span>
          <span class="meta-separator">•</span>
          <span class="meta-tag">Bobot: <strong>{{ currentEgg.weight || currentEgg.estimatedWeight || '56.4' }}g</strong></span>
        </div>
        <div v-else class="context-compact-info text-muted">
          <span>Mode Bebas aktif — Konsultasi regulasi SNI 3926:2023 secara umum tanpa data telur spesifik.</span>
        </div>
      </div>

      <div class="context-toggle-wrap">
        <label class="toggle-label" :class="{ disabled: !hasValidEgg }" title="Sertakan data telur hasil inspeksi aktif ke dalam konteks tanya-jawab AI">
          <input type="checkbox" v-model="useContext" :disabled="!hasValidEgg" />
          <span class="toggle-slider"></span>
          <span class="toggle-text">Kaitkan Data Telur</span>
        </label>
      </div>
    </div>

    <!-- Main Chat Container -->
    <div class="chat-main-card">
      <!-- Chat Messages Scroll Area -->
      <div class="chat-messages-area" ref="chatAreaRef">
        <div
          v-for="(msg, idx) in chatMessages"
          :key="idx"
          class="chat-row"
          :class="msg.role"
        >
          <!-- Assistant Avatar -->
          <div v-if="msg.role === 'assistant'" class="msg-avatar assistant">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>

          <!-- Message Bubble -->
          <div class="msg-bubble-wrap">
            <div class="msg-header">
              <span class="msg-sender">{{ msg.role === 'user' ? 'Operator' : 'Auditor Mutu SNI' }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>

            <div
              class="msg-bubble"
              :class="{
                'bubble-user': msg.role === 'user',
                'bubble-assistant': msg.role === 'assistant',
                'bubble-warning': msg.isWarning
              }"
            >
              <!-- Parsed content -->
              <div class="msg-content-html" v-html="renderMessage(msg.content)"></div>

              <!-- Inline helper link for greeting message -->
              <div v-if="idx === 0 && msg.role === 'assistant'" class="greeting-action-row">
                <button class="greeting-info-btn" @click="showInfoModal = true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Pelajari Standar SNI & Aturan Mutu</span>
                </button>
              </div>
            </div>
          </div>

          <!-- User Avatar -->
          <div v-if="msg.role === 'user'" class="msg-avatar user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isChatLoading" class="chat-row assistant">
          <div class="msg-avatar assistant">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <div class="msg-bubble-wrap">
            <div class="msg-header">
              <span class="msg-sender">Auditor Mutu SNI</span>
              <span class="msg-time">Sedang menganalisis…</span>
            </div>
            <div class="msg-bubble bubble-assistant typing-bubble">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-text">Menyusun jawaban berbasis SNI 3926:2023…</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Suggestion Chips (Clean Pill Bar) -->
      <div class="quick-chips-bar">
        <span class="chips-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Topik Cepat:
        </span>
        <button
          v-for="(chip, cIdx) in quickChips"
          :key="cIdx"
          class="chip-btn"
          @click="sendQuickChip(chip.prompt)"
          :disabled="isChatLoading"
        >
          {{ chip.label }}
        </button>
      </div>

      <!-- Input Bar -->
      <div class="chat-input-container">
        <div class="input-box-wrapper">
          <textarea
            v-model="userQuery"
            class="chat-textarea"
            rows="1"
            placeholder="Tanyakan regulasi mutu telur, batas toleransi noda, retak, atau ESI... (Tekan Enter)"
            @keydown.enter.exact.prevent="sendChatMessage"
            :disabled="isChatLoading"
          ></textarea>
          <button
            class="send-btn"
            @click="sendChatMessage"
            :disabled="!userQuery.trim() || isChatLoading"
            title="Kirim Pesan (Enter)"
          >
            <svg v-if="!isChatLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span v-else class="btn-spinner"></span>
            <span>Kirim</span>
          </button>
        </div>

        <div class="chat-footer-notes">
          <button class="footer-info-link" @click="showInfoModal = true">
            🛡️ Berbasis SNI 3926:2023 & Google Gemini • <span class="link-underline">Info Sistem & Standar</span>
          </button>
          <span class="note-item mono">Shift + Enter untuk baris baru</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { eggApiService } from '../services/eggApiService'

const props = defineProps({
  currentEgg: {
    type: Object,
    default: () => ({})
  },
  apiOnline: {
    type: Boolean,
    default: true
  },
  triggerToast: {
    type: Function,
    default: () => {}
  }
})

// State chat
const userQuery = ref('')
const isChatLoading = ref(false)
const chatAreaRef = ref(null)
const useContext = ref(false) // Default ke Mode Bebas

// Modal Info & Standar SNI
const showInfoModal = ref(false)
const infoActiveTab = ref('standar') // 'standar' | 'guardrail' | 'model'

// Modal Pengaturan API Key Gemini
const showKeyModal = ref(false)
const savedApiKey = ref(localStorage.getItem('gemini_api_key') || '')
const tempApiKey = ref('')

const openKeyModal = () => {
  tempApiKey.value = savedApiKey.value
  showKeyModal.value = true
}

const saveApiKey = () => {
  const val = tempApiKey.value.trim()
  savedApiKey.value = val
  if (val) {
    localStorage.setItem('gemini_api_key', val)
    props.triggerToast('Google Gemini API Key berhasil disimpan!')
  } else {
    localStorage.removeItem('gemini_api_key')
    props.triggerToast('Beralih ke Engine Mutu SNI 3926:2023 (Offline Fallback).')
  }
  showKeyModal.value = false
}

const removeApiKey = () => {
  savedApiKey.value = ''
  tempApiKey.value = ''
  localStorage.removeItem('gemini_api_key')
  showKeyModal.value = false
  props.triggerToast('API Key dihapus. Menggunakan Engine Mutu SNI Offline.')
}

// Format waktu sekarang
const getNowTime = () => {
  const d = new Date()
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// Pesan awal yang bersih dan ringkas (tidak memakan ruang layar)
const initialGreeting = {
  role: 'assistant',
  content: `Halo! Saya adalah **Auditor Mutu AI** berbasis standar **SNI 3926:2023** dan Google Gemini.

Silakan ajukan pertanyaan seputar kriteria mutu cangkang (Mutu I, II, III), toleransi noda kotoran, bahaya cangkang retak, rumus Indeks Bentuk (ESI), atau audit telur yang sedang diinspeksi.`,
  time: getNowTime(),
  isWarning: false
}

const chatMessages = ref([{ ...initialGreeting }])

// Validasi keberadaan data telur saat ini
const hasValidEgg = computed(() => {
  return props.currentEgg && props.currentEgg.grade && props.currentEgg.grade !== 'BUKAN TELUR'
})

// Class pill grade untuk context bar
const gradePillClass = computed(() => {
  const g = (props.currentEgg.grade || '').toUpperCase()
  if (g.includes('A') || (g.includes('I') && !g.includes('II') && !g.includes('III'))) return 'pill-grade-a'
  if (g.includes('B') || g.includes('II')) return 'pill-grade-b'
  return 'pill-grade-c'
})

// Daftar Quick Chips
const quickChips = computed(() => {
  const chips = [
    {
      label: '📋 Syarat Mutu I vs II vs III',
      prompt: 'Jelaskan perbedaan spesifik antara Mutu I (Grade A), Mutu II (Grade B), dan Mutu III (Reject) berdasarkan SNI 3926:2023.'
    },
    {
      label: '📐 Standar Egg Shape Index (ESI)',
      prompt: 'Berapa nilai standar Egg Shape Index (ESI) ideal menurut SNI 3926:2023, bagaimana cara menghitungnya, dan dampaknya pada grade mutu?'
    },
    {
      label: '🔍 Toleransi Noda Kotoran (Dirt)',
      prompt: 'Bagaimana batas toleransi luas noda kotoran cangkang telur untuk Mutu I, Mutu II, dan kapan harus masuk Mutu III menurut SNI?'
    },
    {
      label: '⚠️ Bahaya Cangkang Retak',
      prompt: 'Mengapa telur retak (cracked) langsung masuk kategori Mutu III / Reject dan bagaimana aspek keamanan pangannya terhadap bakteri Salmonella?'
    }
  ]

  if (hasValidEgg.value) {
    chips.unshift({
      label: `🥚 Audit Telur Terkini (${props.currentEgg.eggId})`,
      prompt: `Tolong audit secara komprehensif data telur saat ini (${props.currentEgg.eggId}): jelaskan alasan penetapan grade ${props.currentEgg.gradeLabel || props.currentEgg.grade}, kondisi cangkang, nilai ESI, dan tindakan penanganan yang harus dilakukan!`
    })
  }

  return chips
})

// Susun payload context telur yang kompatibel dengan inspection_context backend
const buildInspectionContextPayload = () => {
  if (!useContext.value || !hasValidEgg.value) return null

  const egg = props.currentEgg
  const isCrack = (egg.yoloDefectClass === 'cracked') || (egg.shellIntegrity || '').toLowerCase().includes('retak')
  const isDirt = (egg.yoloDefectClass === 'dirt') || (egg.shellIntegrity || '').toLowerCase().includes('kotor')

  return {
    summary_360: {
      dominant_defect: egg.yoloDefectClass || 'good',
      confidence: ((egg.confidence || 98) / 100),
      has_crack: isCrack,
      has_dirt: isDirt,
      notes: egg.shellIntegritySub || egg.shellIntegrity || 'Inspeksi cangkang normal'
    },
    opencv_geometry_inspection: {
      length_mm: egg.length || 58.2,
      width_mm: egg.width || 43.1,
      esi_percentage: egg.shapeIndex || 74.0,
      shape_status: (egg.shapeIndex >= 72 && egg.shapeIndex <= 76) ? 'Ideal Normal' : (egg.shapeIndex < 72 ? 'Lonjong' : 'Bulat'),
      estimated_weight_gram: egg.weight || 56.4,
      size_category: 'Sedang'
    },
    final_grading_decision: {
      grade: egg.gradeLabel || egg.grade || 'Mutu I (Grade A)',
      grade_code: egg.grade === 'GRADE B' ? 'MUTU_II' : (egg.grade === 'REJECT' ? 'MUTU_III' : 'MUTU_I'),
      yolo_primary_factor: egg.shellIntegrity || 'Cangkang utuh dan bersih',
      reason: egg.sniAction || 'Sesuai dengan ketentuan SNI 3926:2023',
      hardware_sorting_action: egg.actuator || 'Kemas ke wadah standar',
      standard_reference: 'SNI 3926:2023'
    }
  }
}

// Auto-scroll chat area
const scrollToBottom = () => {
  nextTick(() => {
    if (chatAreaRef.value) {
      chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
    }
  })
}

// Kirim pesan chat
const sendChatMessage = async () => {
  const query = userQuery.value.trim()
  if (!query || isChatLoading.value) return

  chatMessages.value.push({
    role: 'user',
    content: query,
    time: getNowTime(),
    isWarning: false
  })

  userQuery.value = ''
  isChatLoading.value = true
  scrollToBottom()

  try {
    const historyPayload = chatMessages.value
      .slice(-8)
      .map(m => ({
        role: m.role,
        content: m.content
      }))

    const inspectionContext = buildInspectionContextPayload()

    const replyData = await eggApiService.chatWithLLM(
      query,
      historyPayload,
      inspectionContext,
      savedApiKey.value || null
    )

    const isWarn = replyData.is_warning || (replyData.reply || '').includes('PERINGATAN: TOPIK DI LUAR KONTEKS')

    chatMessages.value.push({
      role: 'assistant',
      content: replyData.reply || 'Tidak ada balasan dari Auditor Mutu AI.',
      time: getNowTime(),
      isWarning: isWarn
    })
  } catch (err) {
    chatMessages.value.push({
      role: 'assistant',
      content: `⚠️ Terjadi kendala saat menghubungi Auditor Mutu AI: ${err.message || 'Gagal terhubung ke API backend (Port 8000)'}. Pastikan server Flask aktif.`,
      time: getNowTime(),
      isWarning: true
    })
  } finally {
    isChatLoading.value = false
    scrollToBottom()
  }
}

// Kirim quick suggestion chip
const sendQuickChip = (promptText) => {
  if (promptText.includes('Audit Telur Terkini') || promptText.includes('telur saat ini')) {
    useContext.value = true
  }
  userQuery.value = promptText
  sendChatMessage()
}

// Reset chat
const clearChat = () => {
  chatMessages.value = [{ ...initialGreeting, time: getNowTime() }]
  props.triggerToast('Riwayat percakapan auditor telah direset.')
}

// Salin percakapan ke clipboard
const copyConversation = async () => {
  try {
    const text = chatMessages.value
      .map(m => `[${m.time}] ${m.role === 'user' ? 'Operator' : 'Auditor SNI'}:\n${m.content}\n`)
      .join('\n---\n\n')
    await navigator.clipboard.writeText(text)
    props.triggerToast('Riwayat percakapan berhasil disalin ke clipboard!')
  } catch (e) {
    props.triggerToast('Gagal menyalin percakapan.')
  }
}

// Helper render Markdown sederhana tanpa dependencies luar
const renderMessage = (rawText) => {
  if (!rawText) return ''
  let html = rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="chat-inline-code">$1</code>')
    .replace(/^• (.*$)/gim, '<li class="chat-li">$1</li>')
    .replace(/^[*-] (.*$)/gim, '<li class="chat-li">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="chat-li-num"><span class="num">$1.</span> $2</li>')
    .replace(/\n\n/g, '<div class="chat-p-gap"></div>')
    .replace(/\n/g, '<br/>')

  return html
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-chat-page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Toolbar Card (Clean & Compact) */
.ai-chat-header-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #059669, #0d9488);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
}

.sparkle-svg {
  width: 22px;
  height: 22px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-title);
  margin: 0;
  letter-spacing: -0.01em;
}

.header-tagline {
  font-size: 0.78rem;
  color: var(--text-muted);
  display: block;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.api-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.pill-online {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.pill-offline {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid var(--border-card);
  background: var(--bg-card);
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: var(--bg-card-subtle);
  border-color: var(--teal-primary);
  color: var(--teal-primary);
}

.header-btn svg {
  width: 14px;
  height: 14px;
}

.btn-info-highlight {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #059669;
  font-weight: 700;
}

.btn-info-highlight:hover {
  background: #d1fae5;
  border-color: #059669;
  color: #047857;
}

.btn-key-active {
  background: #f0fdf4 !important;
  color: #16a34a !important;
  border-color: #bbf7d0 !important;
  font-weight: 700 !important;
}

.btn-danger-subtle:hover {
  background: #fef2f2 !important;
  border-color: #fca5a5 !important;
  color: #dc2626 !important;
}

/* Context Inspection Bar (Clean & Compact) */
.context-bar {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;
}

.context-bar.context-active {
  border-color: #a7f3d0;
  background: #f0fdf9;
}

.context-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.context-pill-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.context-compact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-body);
  flex-wrap: wrap;
}

.egg-id-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  background: #e0f2fe;
  color: #0369a1;
  padding: 2px 7px;
  border-radius: 4px;
}

.grade-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.pill-grade-a {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.pill-grade-b {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.pill-grade-c {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.meta-separator {
  color: var(--border-card);
  font-weight: bold;
}

.meta-tag {
  color: var(--text-body);
}

.meta-tag strong {
  color: var(--text-title);
}

/* Switch Toggle */
.context-toggle-wrap {
  flex-shrink: 0;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-body);
  user-select: none;
}

.toggle-label.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-label input {
  display: none;
}

.toggle-slider {
  width: 32px;
  height: 18px;
  background: #cbd5e1;
  border-radius: 20px;
  position: relative;
  transition: background 0.2s ease;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  top: 3px;
  left: 3px;
  transition: transform 0.2s ease;
}

.toggle-label input:checked + .toggle-slider {
  background: var(--teal-primary);
}

.toggle-label input:checked + .toggle-slider::after {
  transform: translateX(14px);
}

/* Chat Main Card */
.chat-main-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 640px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

/* Chat Messages Area */
.chat-messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-behavior: smooth;
  background: #ffffff;
}

.chat-row {
  display: flex;
  gap: 10px;
  max-width: 86%;
}

.chat-row.user {
  align-self: flex-end;
  flex-direction: row;
}

.chat-row.assistant {
  align-self: flex-start;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-avatar.assistant {
  background: linear-gradient(135deg, #059669, #0d9488);
  color: #fff;
}

.msg-avatar.user {
  background: #0f172a;
  color: #fff;
}

.msg-avatar svg {
  width: 16px;
  height: 16px;
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.msg-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-row.user .msg-header {
  justify-content: flex-end;
}

.msg-sender {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}

.msg-time {
  font-size: 0.68rem;
  color: var(--text-subtle);
  font-family: var(--font-mono);
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.86rem;
  line-height: 1.6;
}

.bubble-user {
  background: #0f172a;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.bubble-assistant {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-body);
  border-bottom-left-radius: 4px;
}

.bubble-warning {
  border-color: #f59e0b !important;
  background: #fffbeb !important;
  color: #92400e !important;
}

/* Greeting action button */
.greeting-action-row {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed var(--border-card);
}

.greeting-info-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.greeting-info-btn:hover {
  background: #d1fae5;
  border-color: #059669;
}

.greeting-info-btn svg {
  width: 12px;
  height: 12px;
}

/* HTML Inside Bubble */
.msg-content-html :deep(strong) {
  font-weight: 700;
  color: inherit;
}

.msg-content-html :deep(.chat-inline-code) {
  font-family: var(--font-mono);
  font-size: 0.8em;
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 5px;
  border-radius: 4px;
}

.bubble-user .msg-content-html :deep(.chat-inline-code) {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.msg-content-html :deep(.chat-li) {
  margin-left: 18px;
  list-style: disc;
  margin-top: 3px;
}

.msg-content-html :deep(.chat-li-num) {
  margin-left: 6px;
  margin-top: 4px;
  display: block;
}

.msg-content-html :deep(.chat-li-num .num) {
  font-weight: 700;
  margin-right: 4px;
}

.msg-content-html :deep(.chat-p-gap) {
  height: 6px;
}

/* Typing Bubble */
.typing-bubble {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
}

.typing-dot {
  width: 6px;
  height: 6px;
  background: var(--teal-primary);
  border-radius: 50%;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
}

.typing-text {
  font-size: 0.78rem;
  margin-left: 6px;
  font-style: italic;
}

/* Quick Suggestion Chips */
.quick-chips-bar {
  padding: 8px 16px;
  background: var(--bg-card-subtle);
  border-top: 1px solid var(--border-card);
  border-bottom: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
}

.chips-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.chips-label svg {
  width: 12px;
  height: 12px;
  color: #f59e0b;
}

.chip-btn {
  font-size: 0.74rem;
  font-weight: 600;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 4px 10px;
  border-radius: 16px;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.chip-btn:hover:not(:disabled) {
  border-color: var(--teal-primary);
  color: var(--teal-primary);
  background: #ecfdf5;
  transform: translateY(-1px);
}

.chip-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Chat Input Container */
.chat-input-container {
  padding: 12px 16px;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-box-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-textarea {
  flex: 1;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 0.86rem;
  color: var(--text-title);
  background: var(--bg-card-subtle);
  resize: none;
  min-height: 42px;
  max-height: 110px;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-textarea:focus {
  border-color: var(--teal-primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
}

.send-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: var(--teal-primary);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  height: 42px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--teal-dark);
  box-shadow: 0 3px 8px rgba(5, 150, 105, 0.25);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #94a3b8;
}

.send-btn svg {
  width: 14px;
  height: 14px;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chat-footer-notes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.footer-info-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.72rem;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.footer-info-link:hover .link-underline {
  color: var(--teal-primary);
  text-decoration: underline;
}

.chat-footer-notes .mono {
  font-family: var(--font-mono);
}

/* Modals (API Key & Info) */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: fadeIn 0.15s ease-in-out;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-card-lg {
  max-width: 680px;
  max-height: 85vh;
}

.modal-header {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-card);
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-icon {
  font-size: 1.4rem;
}

.modal-title-row h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-title);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

/* Modal Tabs */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-card);
  background: var(--bg-card-subtle);
  padding: 0 16px;
}

.modal-tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-tab-btn:hover {
  color: var(--teal-primary);
}

.modal-tab-btn.active {
  color: var(--teal-primary);
  border-bottom-color: var(--teal-primary);
  background: var(--bg-card);
  font-weight: 700;
}

.modal-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-body-scroll {
  padding: 18px 20px;
  overflow-y: auto;
  max-height: 520px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-title);
  margin: 0;
}

.mt-4 {
  margin-top: 14px;
}

/* Grade Info Boxes */
.grade-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grade-info-box {
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid var(--border-card);
}

.box-grade-a {
  background: #f0fdf9;
  border-color: #a7f3d0;
}

.box-grade-b {
  background: #f0f7ff;
  border-color: #bfdbfe;
}

.box-grade-c {
  background: #fef2f2;
  border-color: #fecaca;
}

.box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.grade-badge {
  font-size: 0.74rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-a { background: #059669; color: #fff; }
.badge-b { background: #2563eb; color: #fff; }
.badge-c { background: #dc2626; color: #fff; }

.grade-market {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
}

.grade-specs-list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.76rem;
  color: var(--text-body);
  line-height: 1.5;
}

.grade-specs-list li {
  margin-bottom: 2px;
}

/* Table */
.weight-table-wrap {
  border: 1px solid var(--border-card);
  border-radius: 8px;
  overflow: hidden;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.76rem;
}

.simple-table th {
  background: var(--bg-card-subtle);
  color: var(--text-title);
  font-weight: 700;
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-card);
}

.simple-table td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--border-card);
  color: var(--text-body);
}

.simple-table tr:last-child td {
  border-bottom: none;
}

/* Guardrail Grid */
.guardrail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}

.guardrail-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
}

.guardrail-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.guardrail-text h5 {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-title);
  margin: 0 0 3px;
}

.guardrail-text p {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin: 0;
}

/* Tech Spec List */
.tech-spec-list {
  border: 1px solid var(--border-card);
  border-radius: 8px;
  overflow: hidden;
}

.tech-spec-row {
  display: flex;
  justify-content: space-between;
  padding: 9px 14px;
  border-bottom: 1px solid var(--border-card);
  font-size: 0.76rem;
}

.tech-spec-row:last-child {
  border-bottom: none;
}

.tech-spec-row:nth-child(even) {
  background: var(--bg-card-subtle);
}

.spec-label {
  font-weight: 700;
  color: var(--text-title);
}

.spec-value {
  color: var(--text-body);
}

.spec-value.mono {
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.modal-desc {
  font-size: 0.8rem;
  color: var(--text-body);
  line-height: 1.5;
  margin: 0;
}

.key-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.key-input-wrap label {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-title);
}

.key-text-input {
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  outline: none;
  transition: all 0.2s ease;
}

.key-text-input:focus {
  border-color: var(--teal-primary);
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
}

.key-help {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.key-help a {
  color: var(--teal-primary);
  text-decoration: underline;
}

.modal-footer {
  padding: 12px 20px;
  background: var(--bg-card-subtle);
  border-top: 1px solid var(--border-card);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-btn {
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--text-body);
}

.btn-secondary:hover {
  background: var(--bg-card-hover);
}

.btn-primary {
  background: var(--teal-primary);
  border: none;
  color: #fff;
}

.btn-primary:hover {
  background: var(--teal-dark);
}

/* Responsiveness */
@media (max-width: 768px) {
  .ai-chat-header-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .context-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .chat-row {
    max-width: 95%;
  }
  .guardrail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
