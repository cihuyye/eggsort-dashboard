<template>
  <div class="history-page">
    <!-- Page Header & Export Controls -->
    <div class="page-top-bar">
      <div>
        <h1 class="page-main-title">Riwayat &amp; Analitik Data</h1>
      </div>

      <div class="top-bar-actions">
        <!-- Export Button (Exports strictly what is currently filtered) -->
        <button class="btn-excel-export" @click="exportFilteredData" title="Unduh data hasil filter saat ini">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Excel (.xlsx)</span>
        </button>

        <!-- Refresh Button -->
        <button class="btn-icon-refresh" @click="refreshData" title="Muat ulang data telemetri">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards (Matches screenshot) -->
    <div class="kpi-grid-row">
      <!-- Card 1: Total Volume Rekaman -->
      <div class="kpi-box">
        <div class="kpi-box-header">
          <span class="kpi-title-text">TOTAL VOLUME REKAMAN</span>
          <div class="kpi-icon-wrap icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="5" rx="1" />
              <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
              <path d="M10 13h4" />
            </svg>
          </div>
        </div>
        <div class="kpi-box-body">
          <span class="kpi-big-num">{{ totalRecords.toLocaleString() }}</span>
          <span class="kpi-unit-text">Butir</span>
        </div>
        <div class="kpi-box-footer">
          <span class="kpi-chip-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            98.6% Akurasi Model
          </span>
        </div>
      </div>

      <!-- Card 2: Kualitas Grade A (Super) -->
      <div class="kpi-box">
        <div class="kpi-box-header">
          <div>
            <span class="kpi-title-text">KUALITAS GRADE A</span>
            <span class="kpi-sub-label">(SUPER)</span>
          </div>
          <span class="badge-optimal">OPTIMAL</span>
        </div>
        <div class="kpi-box-body">
          <span class="kpi-big-num text-green">{{ gradeACount.toLocaleString() }}</span>
          <span class="kpi-pct-text text-green">{{ gradeAPct }}%</span>
        </div>
        <div class="kpi-box-footer">
          <span class="kpi-footer-note">Standar Ekspor &amp; Supermarket (HU ≥ 72)</span>
        </div>
      </div>

      <!-- Card 3: Kualitas Grade B (Standar) -->
      <div class="kpi-box">
        <div class="kpi-box-header">
          <div>
            <span class="kpi-title-text">KUALITAS GRADE B</span>
            <span class="kpi-sub-label">(STANDAR)</span>
          </div>
          <span class="badge-konsumsi">KONSUMSI</span>
        </div>
        <div class="kpi-box-body">
          <span class="kpi-big-num text-blue">{{ gradeBCount.toLocaleString() }}</span>
          <span class="kpi-pct-text text-blue">{{ gradeBPct }}%</span>
        </div>
        <div class="kpi-box-footer">
          <span class="kpi-footer-note">Pasar Lokal &amp; Industri Olahan (HU 60-71)</span>
        </div>
      </div>

      <!-- Card 4: Rasio Reject / Afkir -->
      <div class="kpi-box">
        <div class="kpi-box-header">
          <span class="kpi-title-text">RASIO REJECT / AFKIR</span>
          <span class="badge-reject">EJECT ACTUATED</span>
        </div>
        <div class="kpi-box-body">
          <span class="kpi-big-num text-red">{{ rejectCount.toLocaleString() }}</span>
          <span class="kpi-pct-text text-red">{{ rejectPct }}%</span>
        </div>
        <div class="kpi-box-footer reject-footer">
          <!-- Stacked color bar -->
          <div class="stacked-bar">
            <div class="bar-retak" style="width: 52%" title="Retak: 52%"></div>
            <div class="bar-kotor" style="width: 31%" title="Kotor: 31%"></div>
            <div class="bar-busuk" style="width: 17%" title="Busuk: 17%"></div>
          </div>
          <div class="stacked-labels">
            <span>Retak: 52%</span>
            <span>Kotor: 31%</span>
            <span>Busuk: 17%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar (Matches screenshot with enhanced Date picker) -->
    <div class="filter-toolbar">
      <!-- Search input -->
      <div class="search-input-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari ID Telur (#EGG-...), Batch, atau status..."
          class="search-field"
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>

      <!-- Filter Grade Dropdown -->
      <div class="select-dropdown-box">
        <select v-model="filterGrade" class="custom-select">
          <option value="ALL">Semua Grade</option>
          <option value="Grade A">Grade A</option>
          <option value="Grade B">Grade B</option>
          <option value="Reject">Reject</option>
        </select>
        <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <!-- Filter Kondisi Dropdown -->
      <div class="select-dropdown-box">
        <select v-model="filterCondition" class="custom-select">
          <option value="ALL">Semua Kondisi</option>
          <option value="Normal Utuh">Normal Utuh</option>
          <option value="Retak">Retak Mikro</option>
          <option value="Noda">Noda Kotor</option>
          <option value="Busuk">Busuk / Rot</option>
          <option value="Kasar">Cangkang Kasar</option>
        </select>
        <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <!-- Date Filter Popover Toggle (Supports per-tanggal 1-30, per-bulan, per-tahun) -->
      <div class="date-filter-wrapper">
        <button
          class="date-filter-btn"
          :class="{ active: showDateDropdown || dateMode !== 'ALL' }"
          @click="showDateDropdown = !showDateDropdown"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{{ dateDisplayLabel }}</span>
        </button>

        <!-- Date Filter Popover Panel -->
        <div v-if="showDateDropdown" class="date-popover-panel">
          <div class="popover-header">
            <span class="popover-title">Pilih Mode Filter Tanggal</span>
            <button class="popover-close-btn" @click="showDateDropdown = false">✕</button>
          </div>

          <!-- Mode Selector Tabs: Per Tanggal | Per Bulan | Per Tahun -->
          <div class="date-mode-tabs">
            <button
              class="mode-tab"
              :class="{ active: dateMode === 'day' }"
              @click="setDateMode('day')"
            >
              Per Tanggal
            </button>
            <button
              class="mode-tab"
              :class="{ active: dateMode === 'month' }"
              @click="setDateMode('month')"
            >
              Per Bulan
            </button>
            <button
              class="mode-tab"
              :class="{ active: dateMode === 'year' }"
              @click="setDateMode('year')"
            >
              Per Tahun
            </button>
            <button
              class="mode-tab"
              :class="{ active: dateMode === 'ALL' }"
              @click="setDateMode('ALL')"
            >
              Semua
            </button>
          </div>

          <!-- Sub-control: Per Tanggal (Day Picker / Range 1-31) -->
          <div v-if="dateMode === 'day'" class="mode-control-body">
            <div class="quick-chips">
              <button class="chip-btn" :class="{ selected: selectedDay === 24 }" @click="selectedDay = 24">
                24 Okt 2024
              </button>
              <button class="chip-btn" :class="{ selected: selectedDay === 23 }" @click="selectedDay = 23">
                23 Okt 2024
              </button>
              <button class="chip-btn" :class="{ selected: selectedDay === 0 }" @click="selectedDay = 0">
                1 - 31 (Seluruh Bulan)
              </button>
            </div>

            <div class="day-slider-box">
              <label class="slider-label">
                Pilih Tanggal: <strong>{{ selectedDay === 0 ? 'Semua (1-31)' : `Tanggal ${selectedDay}` }}</strong>
              </label>
              <input
                type="range"
                min="0"
                max="31"
                v-model.number="selectedDay"
                class="day-range-slider"
              />
              <div class="slider-marks">
                <span>Semua</span>
                <span>Tgl 10</span>
                <span>Tgl 20</span>
                <span>Tgl 31</span>
              </div>
            </div>
          </div>

          <!-- Sub-control: Per Bulan -->
          <div v-else-if="dateMode === 'month'" class="mode-control-body">
            <label class="slider-label">Pilih Bulan &amp; Tahun:</label>
            <div class="month-grid">
              <button
                v-for="(mName, mIdx) in monthNames"
                :key="mIdx"
                class="month-btn"
                :class="{ selected: selectedMonth === mIdx }"
                @click="selectedMonth = mIdx"
              >
                {{ mName }}
              </button>
            </div>
          </div>

          <!-- Sub-control: Per Tahun -->
          <div v-else-if="dateMode === 'year'" class="mode-control-body">
            <label class="slider-label">Pilih Tahun Operasi:</label>
            <div class="year-grid">
              <button
                v-for="y in [2024, 2025, 2026]"
                :key="y"
                class="year-btn"
                :class="{ selected: selectedYear === y }"
                @click="selectedYear = y"
              >
                {{ y }}
              </button>
            </div>
          </div>

          <!-- Popover Footer -->
          <div class="popover-footer">
            <button class="btn-popover-reset" @click="resetDateFilter">Reset</button>
            <button class="btn-popover-apply" @click="showDateDropdown = false">Terapkan Filter</button>
          </div>
        </div>
      </div>

      <!-- Reset All Filters Button -->
      <button class="btn-filter-icon" @click="resetAllFilters" title="Reset semua filter">
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
      </button>
    </div>

    <!-- Main History Table (Matches all columns in screenshot) -->
    <div class="table-container">
      <table class="history-table">
        <thead>
          <tr>
            <th>TIMESTAMP</th>
            <th>ID &amp; BATCH</th>
            <th>MASKING &amp; CANDLING</th>
            <th>DIMENSI (MM / PX)</th>
            <th>SHAPE INDEX</th>
            <th>BRIGHTNESS</th>
            <th>CANGKANG LUAR</th>
            <th>KONDISI DALAM</th>
            <th>GRADE</th>
            <th>AKSI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id" class="history-row">
            <!-- Timestamp -->
            <td class="col-timestamp">
              <div class="time-main font-mono">{{ item.time }}</div>
              <div class="time-date">{{ item.date }}</div>
            </td>

            <!-- ID & Batch -->
            <td class="col-id-batch">
              <div class="egg-id-link font-mono">{{ item.id }}</div>
              <div class="batch-sub font-mono">{{ item.batch }}</div>
            </td>

            <!-- Masking & Candling Thumbnail -->
            <td class="col-masking">
              <div class="candling-thumb" :class="item.tagType">
                <span class="thumb-tag font-mono">{{ item.tagLabel }}</span>
              </div>
            </td>

            <!-- Dimensi (MM / PX) -->
            <td class="col-dimensions">
              <div class="dim-mm">{{ item.lengthMm }} x {{ item.widthMm }} mm</div>
              <div class="dim-px font-mono">{{ item.lengthPx }} x {{ item.widthPx }} px</div>
            </td>

            <!-- Shape Index -->
            <td class="col-shape-index">
              <div class="si-val font-mono">{{ item.shapeIndex }}</div>
              <span class="si-chip" :class="item.siStatusClass">{{ item.siStatus }}</span>
            </td>

            <!-- Brightness -->
            <td class="col-brightness font-mono">
              <span class="bright-text">{{ item.brightness }} px</span>
              <span class="bright-indicator" :class="item.brightArrowClass">{{ item.brightArrow }}</span>
            </td>

            <!-- Cangkang Luar -->
            <td class="col-shell">
              <div class="shell-title" :class="item.shellColorClass">{{ item.shellTitle }}</div>
              <div class="shell-sub">{{ item.shellSub }}</div>
            </td>

            <!-- Kondisi Dalam -->
            <td class="col-interior">
              <div class="interior-title">{{ item.interiorTitle }}</div>
              <div class="interior-sub" :class="{ 'text-red': item.interiorIsReject }">
                {{ item.interiorSub }}
              </div>
            </td>

            <!-- Grade Badge -->
            <td class="col-grade-badge">
              <span class="grade-outline-pill" :class="item.gradeClass">
                {{ item.grade }}
              </span>
            </td>

            <!-- Aksi Detail Button -->
            <td class="col-action">
              <button class="btn-inspect-eye" @click="inspectRow(item)" title="Lihat rincian lengkap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredRecords.length === 0">
            <td colspan="10" class="empty-table-state">
              Tidak ada data rekaman telur yang sesuai dengan filter yang dipilih.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Pagination & Record Counter (Matches screenshot) -->
    <div class="table-pagination-footer">
      <div class="counter-left">
        Menampilkan <strong>{{ displayStart }} - {{ displayEnd }}</strong> dari <strong>{{ filteredRecords.length.toLocaleString() }}</strong> data
        <span v-if="filteredRecords.length !== rawData.length" class="filtered-from-tag">
          (Difilter dari {{ rawData.length.toLocaleString() }} total rekaman)
        </span>
      </div>

      <div class="rows-select-box">
        <span>Baris:</span>
        <select v-model.number="rowsPerPage" class="rows-select">
          <option :value="8">8</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="pagination-nav">
        <button
          class="page-nav-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Sebelumnya
        </button>

        <button
          v-for="p in visiblePages"
          :key="p"
          class="page-num-btn"
          :class="{ active: currentPage === p, dots: p === '...' }"
          :disabled="p === '...'"
          @click="p !== '...' && (currentPage = p)"
        >
          {{ p }}
        </button>

        <button
          class="page-nav-btn"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Inspection Detail Modal -->
    <div v-if="selectedRow" class="detail-modal-backdrop" @click.self="selectedRow = null">
      <div class="detail-modal-card">
        <div class="modal-header">
          <div class="modal-header-left">
            <h3 class="modal-egg-id font-mono">{{ selectedRow.id }}</h3>
            <span class="modal-batch-tag">{{ selectedRow.batch }}</span>
            <span class="grade-outline-pill" :class="selectedRow.gradeClass">{{ selectedRow.grade }}</span>
          </div>
          <button class="modal-close-btn" @click="selectedRow = null">✕</button>
        </div>

        <div class="modal-body-grid">
          <div class="modal-thumb-box" :class="selectedRow.tagType">
            <span class="modal-tag font-mono">{{ selectedRow.tagLabel }}</span>
          </div>

          <div class="modal-details-list">
            <div class="detail-item">
              <span class="detail-label">Waktu Perekaman:</span>
              <strong class="font-mono">{{ selectedRow.date }} {{ selectedRow.time }}</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">Dimensi Telur:</span>
              <span>{{ selectedRow.lengthMm }} x {{ selectedRow.widthMm }} mm ({{ selectedRow.lengthPx }} x {{ selectedRow.widthPx }} px)</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Shape Index:</span>
              <strong>{{ selectedRow.shapeIndex }} ({{ selectedRow.siStatus }})</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">Mean Brightness:</span>
              <span>{{ selectedRow.brightness }} px</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cangkang Luar:</span>
              <span :class="selectedRow.shellColorClass">{{ selectedRow.shellTitle }} ({{ selectedRow.shellSub }})</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Kondisi Dalam:</span>
              <span>{{ selectedRow.interiorTitle }} • {{ selectedRow.interiorSub }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-close" @click="selectedRow = null">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  triggerToast: {
    type: Function,
    required: true
  }
})

// Search & Filter State
const searchQuery = ref('')
const filterGrade = ref('ALL')
const filterCondition = ref('ALL')

// Date Filter Mode: 'day' | 'month' | 'year' | 'ALL'
const dateMode = ref('day')
const showDateDropdown = ref(false)
const selectedDay = ref(24) // 24th or 0 for all days
const selectedMonth = ref(9) // 9 = Oktober (0-indexed)
const selectedYear = ref(2024)

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const setDateMode = (mode) => {
  dateMode.value = mode
  if (mode === 'ALL') {
    showDateDropdown.value = false
  }
}

const resetDateFilter = () => {
  dateMode.value = 'ALL'
  selectedDay.value = 0
  selectedMonth.value = 9
  selectedYear.value = 2024
  showDateDropdown.value = false
}

const resetAllFilters = () => {
  searchQuery.value = ''
  filterGrade.value = 'ALL'
  filterCondition.value = 'ALL'
  resetDateFilter()
  props.triggerToast('Semua filter berhasil di-reset.')
}

const dateDisplayLabel = computed(() => {
  if (dateMode.value === 'ALL') return 'Semua Tanggal'
  if (dateMode.value === 'day') {
    if (selectedDay.value === 0) {
      return `1-31 ${monthNames[selectedMonth.value].slice(0, 3)} ${selectedYear.value}`
    }
    return `${selectedDay.value} ${monthNames[selectedMonth.value].slice(0, 3)} ${selectedYear.value}`
  }
  if (dateMode.value === 'month') {
    return `${monthNames[selectedMonth.value]} ${selectedYear.value}`
  }
  if (dateMode.value === 'year') {
    return `Tahun ${selectedYear.value}`
  }
  return 'Filter Tanggal'
})

// Pagination State
const currentPage = ref(1)
const rowsPerPage = ref(10)
const selectedRow = ref(null)

// Comprehensive Dataset matching screenshot exactly
const rawData = ref([
  {
    id: '#EGG-1428',
    batch: 'Tray B-04',
    time: '09:42:15',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 56.8, widthMm: 43.1, lengthPx: 426, widthPx: 323,
    shapeIndex: 1.32, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 178, brightArrow: '▲', brightArrowClass: 'arrow-green',
    shellTitle: 'Normal Utuh', shellSub: 'Conf: 99.4%', shellColorClass: 'text-green',
    interiorTitle: 'Segar AA (HU-83)', interiorSub: 'Kantung 2.8mm', interiorIsReject: false,
    grade: 'Grade A', gradeClass: 'grade-a'
  },
  {
    id: '#EGG-1427',
    batch: 'Tray B-04',
    time: '09:42:08',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'crack',
    tagLabel: 'CRACK',
    lengthMm: 54.2, widthMm: 42.0, lengthPx: 406, widthPx: 315,
    shapeIndex: 1.29, siStatus: 'Elips', siStatusClass: 'chip-elips',
    brightness: 142, brightArrow: '▲', brightArrowClass: 'arrow-red',
    shellTitle: 'Retak Mikro', shellSub: 'Conf: 98.1%', shellColorClass: 'text-red',
    interiorTitle: 'Struktur Bocor', interiorSub: 'Pneumatic Eject', interiorIsReject: true,
    grade: 'Reject', gradeClass: 'grade-reject'
  },
  {
    id: '#EGG-1426',
    batch: 'Tray B-04',
    time: '09:41:59',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 61.2, widthMm: 41.5, lengthPx: 459, widthPx: 311,
    shapeIndex: 1.47, siStatus: 'Lonjong', siStatusClass: 'chip-lonjong',
    brightness: 162, brightArrow: '▲', brightArrowClass: 'arrow-blue',
    shellTitle: 'Normal Utuh', shellSub: 'Conf: 97.9%', shellColorClass: 'text-green',
    interiorTitle: 'Standar B (HU-68)', interiorSub: 'Kantung 4.5mm', interiorIsReject: false,
    grade: 'Grade B', gradeClass: 'grade-b'
  },
  {
    id: '#EGG-1425',
    batch: 'Tray B-03',
    time: '09:41:45',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'dirt',
    tagLabel: 'STAIN',
    lengthMm: 57.0, widthMm: 43.4, lengthPx: 427, widthPx: 325,
    shapeIndex: 1.31, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 110, brightArrow: '▼', brightArrowClass: 'arrow-orange',
    shellTitle: 'Noda Kotor', shellSub: '10.4% Area Shell', shellColorClass: 'text-orange',
    interiorTitle: 'Kantung Normal', interiorSub: 'Pneumatic Eject', interiorIsReject: true,
    grade: 'Reject', gradeClass: 'grade-reject'
  },
  {
    id: '#EGG-1424',
    batch: 'Tray B-03',
    time: '09:41:33',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 58.4, widthMm: 44.0, lengthPx: 438, widthPx: 330,
    shapeIndex: 1.33, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 184, brightArrow: '▲', brightArrowClass: 'arrow-green',
    shellTitle: 'Normal Bersih', shellSub: 'Conf: 99.8%', shellColorClass: 'text-green',
    interiorTitle: 'Super AA (HU-85)', interiorSub: 'Kantung 2.2mm', interiorIsReject: false,
    grade: 'Grade A', gradeClass: 'grade-a'
  },
  {
    id: '#EGG-1423',
    batch: 'Tray B-03',
    time: '09:41:20',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'rot',
    tagLabel: 'ROT',
    lengthMm: 55.1, widthMm: 43.0, lengthPx: 413, widthPx: 322,
    shapeIndex: 1.28, siStatus: 'Elips', siStatusClass: 'chip-elips',
    brightness: 38, brightArrow: '▼▼', brightArrowClass: 'arrow-red',
    shellTitle: 'Busuk / Rot', shellSub: 'Intensitas < 40 px', shellColorClass: 'text-red',
    interiorTitle: 'Bakteri / Gelap', interiorSub: 'Pneumatic Eject', interiorIsReject: true,
    grade: 'Reject', gradeClass: 'grade-reject'
  },
  {
    id: '#EGG-1422',
    batch: 'Tray B-03',
    time: '09:41:07',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 57.2, widthMm: 43.5, lengthPx: 429, widthPx: 326,
    shapeIndex: 1.31, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 175, brightArrow: '▲', brightArrowClass: 'arrow-green',
    shellTitle: 'Normal Utuh', shellSub: 'Conf: 99.1%', shellColorClass: 'text-green',
    interiorTitle: 'Segar AA (HU-81)', interiorSub: 'Kantung 2.9mm', interiorIsReject: false,
    grade: 'Grade A', gradeClass: 'grade-a'
  },
  {
    id: '#EGG-1421',
    batch: 'Tray B-02',
    time: '09:40:55',
    date: '24/10/2024',
    day: 24, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 56.0, widthMm: 43.8, lengthPx: 420, widthPx: 328,
    shapeIndex: 1.27, siStatus: 'Bulat', siStatusClass: 'chip-bulat',
    brightness: 169, brightArrow: '▲', brightArrowClass: 'arrow-blue',
    shellTitle: 'Cangkang Kasar', shellSub: 'Conf: 89.2%', shellColorClass: 'text-blue',
    interiorTitle: 'Standar B (HU-69)', interiorSub: 'Kantung 4.2mm', interiorIsReject: false,
    grade: 'Grade B', gradeClass: 'grade-b'
  },
  {
    id: '#EGG-1420',
    batch: 'Tray B-02',
    time: '09:40:32',
    date: '23/10/2024',
    day: 23, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 58.1, widthMm: 43.0, lengthPx: 435, widthPx: 322,
    shapeIndex: 1.35, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 180, brightArrow: '▲', brightArrowClass: 'arrow-green',
    shellTitle: 'Normal Utuh', shellSub: 'Conf: 99.5%', shellColorClass: 'text-green',
    interiorTitle: 'Super AA (HU-86)', interiorSub: 'Kantung 2.1mm', interiorIsReject: false,
    grade: 'Grade A', gradeClass: 'grade-a'
  },
  {
    id: '#EGG-1419',
    batch: 'Tray B-02',
    time: '09:40:11',
    date: '23/10/2024',
    day: 23, month: 9, year: 2024,
    tagType: 'crack',
    tagLabel: 'CRACK',
    lengthMm: 55.4, widthMm: 42.1, lengthPx: 415, widthPx: 316,
    shapeIndex: 1.31, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 138, brightArrow: '▼', brightArrowClass: 'arrow-red',
    shellTitle: 'Retak Rambut', shellSub: 'Conf: 97.4%', shellColorClass: 'text-red',
    interiorTitle: 'Kebocoran Membran', interiorSub: 'Pneumatic Eject', interiorIsReject: true,
    grade: 'Reject', gradeClass: 'grade-reject'
  },
  {
    id: '#EGG-1418',
    batch: 'Tray B-01',
    time: '14:22:45',
    date: '15/10/2024',
    day: 15, month: 9, year: 2024,
    tagType: 'yolo',
    tagLabel: 'YOLO',
    lengthMm: 57.5, widthMm: 42.9, lengthPx: 431, widthPx: 321,
    shapeIndex: 1.34, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 172, brightArrow: '▲', brightArrowClass: 'arrow-green',
    shellTitle: 'Normal Utuh', shellSub: 'Conf: 99.2%', shellColorClass: 'text-green',
    interiorTitle: 'Segar AA (HU-82)', interiorSub: 'Kantung 2.7mm', interiorIsReject: false,
    grade: 'Grade A', gradeClass: 'grade-a'
  },
  {
    id: '#EGG-1417',
    batch: 'Tray A-08',
    time: '11:15:20',
    date: '08/10/2024',
    day: 8, month: 9, year: 2024,
    tagType: 'dirt',
    tagLabel: 'STAIN',
    lengthMm: 56.4, widthMm: 41.8, lengthPx: 423, widthPx: 313,
    shapeIndex: 1.34, siStatus: 'Ideal', siStatusClass: 'chip-ideal',
    brightness: 155, brightArrow: '▲', brightArrowClass: 'arrow-blue',
    shellTitle: 'Noda Ringan', shellSub: 'Conf: 93.1%', shellColorClass: 'text-blue',
    interiorTitle: 'Standar B (HU-67)', interiorSub: 'Kantung 4.8mm', interiorIsReject: false,
    grade: 'Grade B', gradeClass: 'grade-b'
  }
])

// Filter Logic: Combines Search Query, Grade, Condition, and Date/Month/Year
const filteredRecords = computed(() => {
  return rawData.value.filter(item => {
    // 1. Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchSearch =
        item.id.toLowerCase().includes(q) ||
        item.batch.toLowerCase().includes(q) ||
        item.shellTitle.toLowerCase().includes(q) ||
        item.grade.toLowerCase().includes(q)
      if (!matchSearch) return false
    }

    // 2. Filter Grade
    if (filterGrade.value !== 'ALL') {
      if (item.grade !== filterGrade.value) return false
    }

    // 3. Filter Condition
    if (filterCondition.value !== 'ALL') {
      const cond = filterCondition.value.toLowerCase()
      const shell = item.shellTitle.toLowerCase()
      if (!shell.includes(cond)) return false
    }

    // 4. Date Filter (Day, Month, Year, ALL)
    if (dateMode.value === 'day') {
      if (selectedDay.value > 0 && item.day !== selectedDay.value) return false
      if (item.month !== selectedMonth.value || item.year !== selectedYear.value) return false
    } else if (dateMode.value === 'month') {
      if (item.month !== selectedMonth.value || item.year !== selectedYear.value) return false
    } else if (dateMode.value === 'year') {
      if (item.year !== selectedYear.value) return false
    }

    return true
  })
})

// Dynamic Metrics computed strictly from filtered data (or default baseline when all)
const totalRecords = computed(() => filteredRecords.value.length)
const gradeACount = computed(() => filteredRecords.value.filter(i => i.grade === 'Grade A').length)
const gradeBCount = computed(() => filteredRecords.value.filter(i => i.grade === 'Grade B').length)
const rejectCount = computed(() => filteredRecords.value.filter(i => i.grade === 'Reject').length)

const gradeAPct = computed(() => totalRecords.value ? ((gradeACount.value / totalRecords.value) * 100).toFixed(1) : '0.0')
const gradeBPct = computed(() => totalRecords.value ? ((gradeBCount.value / totalRecords.value) * 100).toFixed(1) : '0.0')
const rejectPct = computed(() => totalRecords.value ? ((rejectCount.value / totalRecords.value) * 100).toFixed(1) : '0.0')

// Pagination Computations
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / rowsPerPage.value)))
const displayStart = computed(() => filteredRecords.value.length === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1)
const displayEnd = computed(() => Math.min(filteredRecords.value.length, currentPage.value * rowsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredRecords.value.slice(start, start + rowsPerPage.value)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const cur = currentPage.value
  if (cur <= 3) return [1, 2, 3, '...', total]
  if (cur >= total - 2) return [1, '...', total - 2, total - 1, total]
  return [1, '...', cur, '...', total]
})

const inspectRow = (row) => {
  selectedRow.value = row
}

const refreshData = () => {
  props.triggerToast('Data riwayat berhasil diperbarui.')
}

// EXPORT FEATURE: STRICTLY DOWNLOADS CURRENT FILTERED RECORDS AS REQUESTED BY USER!
const exportFilteredData = () => {
  const recordsToExport = filteredRecords.value
  if (recordsToExport.length === 0) {
    props.triggerToast('Tidak ada data dalam tabel yang sesuai dengan filter untuk diunduh!')
    return
  }

  const headers = [
    'Timestamp',
    'Tanggal',
    'ID Telur',
    'Batch',
    'Panjang (mm)',
    'Lebar (mm)',
    'Panjang (px)',
    'Lebar (px)',
    'Shape Index',
    'Status Bentuk',
    'Brightness (px)',
    'Kondisi Cangkang Luar',
    'Catatan Cangkang',
    'Kondisi Dalam',
    'Catatan Dalam',
    'Grade Akhir'
  ]

  const rows = recordsToExport.map(item => [
    `"${item.time}"`,
    `"${item.date}"`,
    `"${item.id}"`,
    `"${item.batch}"`,
    item.lengthMm,
    item.widthMm,
    item.lengthPx,
    item.widthPx,
    item.shapeIndex,
    `"${item.siStatus}"`,
    item.brightness,
    `"${item.shellTitle}"`,
    `"${item.shellSub}"`,
    `"${item.interiorTitle}"`,
    `"${item.interiorSub}"`,
    `"${item.grade}"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  const fileName = `EggSort_Riwayat_${dateDisplayLabel.value.replace(/[^a-zA-Z0-9]/g, '_')}_${recordsToExport.length}Items.csv`
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  props.triggerToast(`Berhasil mengunduh ${recordsToExport.length} data sesuai filter tabel (${fileName}).`)
}
</script>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Page Top Bar */
.page-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-main-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--text-title);
  letter-spacing: -0.02em;
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-excel-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-excel-export svg {
  width: 16px;
  height: 16px;
  color: var(--teal-primary);
}

.btn-excel-export:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--teal-primary);
  transform: translateY(-1px);
}

.btn-icon-refresh {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-icon-refresh svg {
  width: 16px;
  height: 16px;
}

.btn-icon-refresh:hover {
  background-color: var(--bg-card-hover);
  color: var(--text-title);
}

/* 4 KPI Summary Cards Grid */
.kpi-grid-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.kpi-box:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.kpi-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.kpi-title-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.kpi-sub-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-subtle);
  margin-left: 4px;
}

.kpi-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background-color: rgba(56, 189, 248, 0.12);
  color: #0284c7;
}

.kpi-icon-wrap svg {
  width: 16px;
  height: 16px;
}

.badge-optimal {
  font-size: 0.65rem;
  font-weight: 700;
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.08);
  padding: 2px 7px;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.badge-konsumsi {
  font-size: 0.65rem;
  font-weight: 700;
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.35);
  background: rgba(59, 130, 246, 0.08);
  padding: 2px 7px;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.badge-reject {
  font-size: 0.65rem;
  font-weight: 700;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
  padding: 2px 7px;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.kpi-box-body {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 6px 0 10px 0;
}

.kpi-big-num {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-title);
  letter-spacing: -0.02em;
  line-height: 1;
}

.kpi-unit-text {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
}

.kpi-pct-text {
  font-size: 0.95rem;
  font-weight: 700;
  font-family: var(--font-mono);
}

.text-green { color: var(--grade-a); }
.text-blue { color: var(--grade-b); }
.text-red { color: var(--grade-c); }
.text-orange { color: #f97316; }

.kpi-box-footer {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.kpi-chip-green {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.kpi-chip-green svg {
  width: 12px;
  height: 12px;
}

.kpi-footer-note {
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Stacked bar breakdown */
.reject-footer {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stacked-bar {
  height: 6px;
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
  background-color: var(--bg-card-subtle);
}

.bar-retak { background-color: #ef4444; }
.bar-kotor { background-color: #f97316; }
.bar-busuk { background-color: #eab308; }

.stacked-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.64rem;
  color: var(--text-subtle);
  font-family: var(--font-mono);
}

/* Filter Toolbar */
.filter-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input-box {
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 8px 14px;
  box-shadow: var(--shadow-sm);
  position: relative;
}

.search-input-box svg {
  width: 16px;
  height: 16px;
  color: var(--text-subtle);
  flex-shrink: 0;
}

.search-field {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.82rem;
  color: var(--text-title);
  font-family: inherit;
}

.clear-search-btn {
  background: transparent;
  border: none;
  color: var(--text-subtle);
  cursor: pointer;
  font-size: 0.75rem;
}

.select-dropdown-box {
  position: relative;
  display: flex;
  align-items: center;
}

.custom-select {
  appearance: none;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 8px 32px 8px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-body);
  outline: none;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  font-family: inherit;
}

.select-arrow {
  position: absolute;
  right: 10px;
  width: 14px;
  height: 14px;
  color: var(--text-subtle);
  pointer-events: none;
}

/* Date Filter Popover & Dropdown */
.date-filter-wrapper {
  position: relative;
}

.date-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.date-filter-btn svg {
  width: 15px;
  height: 15px;
  color: var(--teal-primary);
}

.date-filter-btn.active, .date-filter-btn:hover {
  border-color: var(--teal-primary);
}

.date-popover-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popover-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-title);
}

.popover-close-btn {
  background: transparent;
  border: none;
  color: var(--text-subtle);
  cursor: pointer;
  font-size: 0.8rem;
}

.date-mode-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background-color: var(--bg-card-subtle);
  padding: 3px;
  border-radius: 8px;
}

.mode-tab {
  background: transparent;
  border: none;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 5px 2px;
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  text-align: center;
}

.mode-tab.active {
  background-color: var(--bg-card);
  color: var(--teal-primary);
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.mode-control-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip-btn {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-body);
  cursor: pointer;
}

.chip-btn.selected {
  background-color: var(--teal-light);
  border-color: var(--teal-border);
  color: var(--teal-primary);
  font-weight: 700;
}

.day-slider-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
}

.slider-label {
  font-size: 0.72rem;
  color: var(--text-title);
}

.day-range-slider {
  width: 100%;
  accent-color: var(--teal-primary);
  cursor: pointer;
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: var(--text-subtle);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.month-btn {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 6px 4px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  text-align: center;
}

.month-btn.selected {
  background-color: var(--teal-primary);
  color: #ffffff;
  border-color: var(--teal-primary);
}

.year-grid {
  display: flex;
  gap: 8px;
}

.year-btn {
  flex: 1;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  color: var(--text-body);
}

.year-btn.selected {
  background-color: var(--teal-primary);
  color: #ffffff;
  border-color: var(--teal-primary);
}

.popover-footer {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-subtle);
  padding-top: 10px;
}

.btn-popover-reset {
  background: transparent;
  border: none;
  font-size: 0.72rem;
  color: var(--text-muted);
  cursor: pointer;
}

.btn-popover-apply {
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-filter-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.btn-filter-icon svg {
  width: 15px;
  height: 15px;
}

/* History Table Styling */
.table-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  text-align: left;
}

.history-table th {
  padding: 14px 16px;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-card);
  background-color: var(--bg-card-subtle);
  white-space: nowrap;
}

.history-row {
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color 0.15s ease;
}

.history-row:hover {
  background-color: var(--bg-card-subtle);
}

.history-row td {
  padding: 12px 16px;
  vertical-align: middle;
  white-space: nowrap;
}

.col-timestamp .time-main {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-title);
}

.col-timestamp .time-date {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.col-id-batch .egg-id-link {
  font-weight: 800;
  color: var(--teal-primary);
  font-size: 0.82rem;
}

.col-id-batch .batch-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Candling Thumb */
.candling-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.candling-thumb.yolo {
  background: radial-gradient(circle at 50% 50%, #fde047 0%, #ca8a04 40%, #1e1b4b 90%);
}

.candling-thumb.crack {
  background: radial-gradient(circle at 50% 50%, #f87171 0%, #dc2626 40%, #1e1b4b 90%);
}

.candling-thumb.dirt {
  background: radial-gradient(circle at 50% 50%, #fb923c 0%, #b45309 40%, #1e1b4b 90%);
}

.candling-thumb.rot {
  background: radial-gradient(circle at 50% 50%, #a855f7 0%, #6b21a8 40%, #09090b 90%);
}

.thumb-tag {
  font-size: 0.55rem;
  font-weight: 800;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  padding: 1px 4px;
  border-radius: 3px;
}

.col-dimensions .dim-mm {
  font-weight: 700;
  color: var(--text-title);
}

.col-dimensions .dim-px {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.col-shape-index .si-val {
  font-weight: 700;
  color: var(--text-title);
}

.si-chip {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 2px;
}

.chip-ideal {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.chip-elips {
  background: rgba(148, 163, 184, 0.15);
  color: #64748b;
}

.chip-lonjong {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.chip-bulat {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.col-brightness {
  font-weight: 600;
  color: var(--text-body);
}

.bright-indicator {
  margin-left: 4px;
  font-weight: 800;
  font-size: 0.75rem;
}

.arrow-green { color: #10b981; }
.arrow-blue { color: #3b82f6; }
.arrow-red { color: #ef4444; }
.arrow-orange { color: #f97316; }

.col-shell .shell-title {
  font-weight: 700;
}

.col-shell .shell-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.col-interior .interior-title {
  font-weight: 600;
  color: var(--text-title);
}

.col-interior .interior-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Outline Pill for Grade (Matches screenshot) */
.grade-outline-pill {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 9999px;
  display: inline-block;
  letter-spacing: 0.02em;
}

.grade-outline-pill.grade-a {
  color: #10b981;
  border: 1.5px solid #10b981;
  background: rgba(16, 185, 129, 0.06);
}

.grade-outline-pill.grade-b {
  color: #3b82f6;
  border: 1.5px solid #3b82f6;
  background: rgba(59, 130, 246, 0.06);
}

.grade-outline-pill.grade-reject {
  color: #ef4444;
  border: 1.5px solid #ef4444;
  background: rgba(239, 68, 68, 0.06);
}

.btn-inspect-eye {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-inspect-eye:hover {
  background-color: var(--bg-card-hover);
  color: var(--teal-primary);
  border-color: var(--teal-primary);
}

.btn-inspect-eye svg {
  width: 16px;
  height: 16px;
}

.empty-table-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
}

/* Pagination Footer */
.table-pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 10px 4px;
}

.filtered-from-tag {
  color: var(--text-subtle);
  font-style: italic;
  margin-left: 4px;
}

.rows-select-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rows-select {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-title);
  outline: none;
  cursor: pointer;
}

.pagination-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-nav-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-nav-btn:hover:not(:disabled) {
  background-color: var(--bg-card-hover);
}

.page-num-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
}

.page-num-btn.active {
  background-color: var(--teal-primary);
  color: #ffffff;
  border-color: var(--teal-primary);
  font-weight: 700;
}

.page-num-btn.dots {
  border: none;
  background: transparent;
  cursor: default;
}

/* Inspection Modal */
.detail-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.detail-modal-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 14px;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-egg-id {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-title);
}

.modal-batch-tag {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--bg-card-subtle);
  padding: 2px 8px;
  border-radius: 4px;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-body-grid {
  display: flex;
  gap: 18px;
}

.modal-thumb-box {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-thumb-box.yolo { background: radial-gradient(circle, #fde047, #ca8a04, #1e1b4b); }
.modal-thumb-box.crack { background: radial-gradient(circle, #f87171, #dc2626, #1e1b4b); }
.modal-thumb-box.dirt { background: radial-gradient(circle, #fb923c, #b45309, #1e1b4b); }
.modal-thumb-box.rot { background: radial-gradient(circle, #a855f7, #6b21a8, #09090b); }

.modal-tag {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-weight: 800;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.modal-details-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.8rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border-subtle);
  padding-top: 14px;
}

.btn-modal-close {
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .kpi-grid-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .kpi-grid-row {
    grid-template-columns: 1fr;
  }
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

