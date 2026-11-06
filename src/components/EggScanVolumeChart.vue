<template>
  <div class="chart-card">
    <!-- Header: Title & Filter Controls -->
    <div class="chart-card-header">
      <div class="title-group">
        <div class="badge-tag">VOLUME &amp; TREND MONITOR</div>
        <h2 class="chart-title">Grafik Total Telur yang Dipindai</h2>
        <p class="chart-sub">Distribusi volume pemindaian real-time dan rasio pemilahan mutu konveyor</p>
      </div>

      <!-- Controls: Time Filter & Grade Filter -->
      <div class="filter-controls">
        <!-- Time Filter (Hari Ini, 1 Minggu, 1 Bulan) -->
        <div class="time-filter-group">
          <button
            class="time-btn"
            :class="{ active: timeRange === 'today' }"
            @click="setTimeRange('today')"
          >
            Hari Ini
          </button>
          <button
            class="time-btn"
            :class="{ active: timeRange === 'week' }"
            @click="setTimeRange('week')"
          >
            1 Minggu Terakhir
          </button>
          <button
            class="time-btn"
            :class="{ active: timeRange === 'month' }"
            @click="setTimeRange('month')"
          >
            1 Bulan Terakhir
          </button>
        </div>

        <!-- Grade Filter (All, Grade A, Grade B, Reject) -->
        <div class="grade-filter-group">
          <button
            class="grade-pill-btn pill-all"
            :class="{ active: selectedGrade === 'ALL' }"
            @click="setSelectedGrade('ALL')"
          >
            <span class="pill-indicator"></span>
            Semua Grade
          </button>
          <button
            class="grade-pill-btn pill-a"
            :class="{ active: selectedGrade === 'GRADE_A' }"
            @click="setSelectedGrade('GRADE_A')"
          >
            <span class="pill-indicator"></span>
            Grade A
          </button>
          <button
            class="grade-pill-btn pill-b"
            :class="{ active: selectedGrade === 'GRADE_B' }"
            @click="setSelectedGrade('GRADE_B')"
          >
            <span class="pill-indicator"></span>
            Grade B
          </button>
          <button
            class="grade-pill-btn pill-reject"
            :class="{ active: selectedGrade === 'REJECT' }"
            @click="setSelectedGrade('REJECT')"
          >
            <span class="pill-indicator"></span>
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Mini Telemetry Stat Ribbon -->
    <div class="chart-telemetry-ribbon">
      <div class="telemetry-item">
        <span class="t-label">Total Periode Ini:</span>
        <span class="t-val">{{ currentTotalVolume.toLocaleString() }} <small>butir</small></span>
      </div>
      <div class="telemetry-sep">•</div>
      <div class="telemetry-item">
        <span class="t-label">Rata-rata:</span>
        <span class="t-val text-teal">{{ currentAvgRate }} <small>{{ timeRange === 'today' ? 'butir/jam' : 'butir/hari' }}</small></span>
      </div>
      <div class="telemetry-sep">•</div>
      <div class="telemetry-item">
        <span class="t-label">Puncak Volume:</span>
        <span class="t-val text-amber">{{ currentPeakVal }} <small>butir ({{ currentPeakLabel }})</small></span>
      </div>
      <div class="telemetry-sep">•</div>
      <div class="telemetry-item">
        <span class="t-label">Filter Aktif:</span>
        <span class="t-badge" :class="selectedGrade.toLowerCase()">
          {{ gradeFilterLabel }} ({{ timeRangeLabel }})
        </span>
      </div>
    </div>

    <!-- Canvas Chart Container -->
    <div class="chart-canvas-wrapper">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  totalScanned: { type: Number, default: 1428 },
  gradeACount: { type: Number, default: 1085 },
  gradeBCount: { type: Number, default: 247 },
  rejectCount: { type: Number, default: 96 }
})

// States
const timeRange = ref('today') // 'today', 'week', 'month'
const selectedGrade = ref('ALL') // 'ALL', 'GRADE_A', 'GRADE_B', 'REJECT'
const canvasRef = ref(null)
let chartInstance = null

// Bobot distribusi per jam kerja untuk memetakan data live hari ini
const hourlyWeights = [0.08, 0.10, 0.12, 0.11, 0.07, 0.12, 0.11, 0.10, 0.09, 0.10]

const distributeCount = (totalCount) => {
  const distributed = []
  let runningSum = 0
  for (let i = 0; i < hourlyWeights.length - 1; i++) {
    const val = Math.round(hourlyWeights[i] * totalCount)
    distributed.push(val)
    runningSum += val
  }
  // Slot terakhir (jam sesi saat ini) memastikan jumlah total sama persis 100%
  distributed.push(Math.max(0, totalCount - runningSum))
  return distributed
}

// Dataset Dinamis yang selalu sinkron dengan KPI Card di atasnya
const currentData = computed(() => {
  if (timeRange.value === 'today') {
    // Hari Ini: terdistribusi per jam kerja dengan akumulasi persis sama dengan KPI Card
    return {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00 (Sesi Ini)'],
      gradeA: distributeCount(props.gradeACount),
      gradeB: distributeCount(props.gradeBCount),
      reject: distributeCount(props.rejectCount)
    }
  } else if (timeRange.value === 'week') {
    // 1 Minggu Terakhir: 6 hari sebelumnya + hari ini (mengambil data KPI live)
    const prevDaysA = [980, 1020, 1060, 1140, 1200, 950]
    const prevDaysB = [215, 230, 240, 255, 270, 205]
    const prevDaysR = [80, 85, 92, 102, 95, 74]

    return {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Hari Ini'],
      gradeA: [...prevDaysA, props.gradeACount],
      gradeB: [...prevDaysB, props.gradeBCount],
      reject: [...prevDaysR, props.rejectCount]
    }
  } else {
    // 1 Bulan Terakhir: Minggu 1-3 historis + Minggu 4 sesi berjalan (mengambil data KPI live)
    const m1A = 7250, m2A = 7840, m3A = 7620
    const m1B = 1620, m2B = 1750, m3B = 1690
    const m1R = 610, m2R = 660, m3R = 640

    return {
      labels: ['Minggu 1 (Tgl 1-7)', 'Minggu 2 (Tgl 8-14)', 'Minggu 3 (Tgl 15-21)', 'Minggu 4 (Berjalan)'],
      gradeA: [m1A, m2A, m3A, Math.round(props.gradeACount * 4.2)],
      gradeB: [m1B, m2B, m3B, Math.round(props.gradeBCount * 4.2)],
      reject: [m1R, m2R, m3R, Math.round(props.rejectCount * 4.2)]
    }
  }
})

// Telemetry computations
const currentTotalVolume = computed(() => {
  const d = currentData.value
  if (selectedGrade.value === 'GRADE_A') return d.gradeA.reduce((a, b) => a + b, 0)
  if (selectedGrade.value === 'GRADE_B') return d.gradeB.reduce((a, b) => a + b, 0)
  if (selectedGrade.value === 'REJECT') return d.reject.reduce((a, b) => a + b, 0)
  // ALL
  const sumA = d.gradeA.reduce((a, b) => a + b, 0)
  const sumB = d.gradeB.reduce((a, b) => a + b, 0)
  const sumR = d.reject.reduce((a, b) => a + b, 0)
  return sumA + sumB + sumR
})

const currentAvgRate = computed(() => {
  const count = currentData.value.labels.length || 1
  return Math.round(currentTotalVolume.value / count)
})

const currentPeak = computed(() => {
  const d = currentData.value
  let totals = []
  if (selectedGrade.value === 'GRADE_A') totals = [...d.gradeA]
  else if (selectedGrade.value === 'GRADE_B') totals = [...d.gradeB]
  else if (selectedGrade.value === 'REJECT') totals = [...d.reject]
  else {
    totals = d.labels.map((_, i) => (d.gradeA[i] || 0) + (d.gradeB[i] || 0) + (d.reject[i] || 0))
  }
  let maxVal = -1
  let maxIdx = 0
  totals.forEach((v, idx) => {
    if (v > maxVal) {
      maxVal = v
      maxIdx = idx
    }
  })
  return { val: maxVal, label: d.labels[maxIdx] || '-' }
})

const currentPeakVal = computed(() => currentPeak.value.val)
const currentPeakLabel = computed(() => currentPeak.value.label)

const gradeFilterLabel = computed(() => {
  if (selectedGrade.value === 'GRADE_A') return 'Grade A (Mutu I)'
  if (selectedGrade.value === 'GRADE_B') return 'Grade B (Mutu II)'
  if (selectedGrade.value === 'REJECT') return 'Reject (Cacat/Afkir)'
  return 'Semua Kategori Mutu'
})

const timeRangeLabel = computed(() => {
  if (timeRange.value === 'today') return 'Hari Ini'
  if (timeRange.value === 'week') return '7 Hari'
  return '30 Hari'
})

// Filter Handlers
const setTimeRange = (range) => {
  timeRange.value = range
  updateChart()
}

const setSelectedGrade = (grade) => {
  selectedGrade.value = grade
  updateChart()
}

// Chart rendering
const updateChart = () => {
  if (!canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  const dataConf = currentData.value
  const isDark = document.documentElement.classList.contains('dark')

  // Colors
  const textColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'

  // Dynamic gradients
  const gradTotal = ctx.createLinearGradient(0, 0, 0, 320)
  gradTotal.addColorStop(0, 'rgba(20, 184, 166, 0.35)')
  gradTotal.addColorStop(1, 'rgba(20, 184, 166, 0.00)')

  const gradA = ctx.createLinearGradient(0, 0, 0, 320)
  gradA.addColorStop(0, 'rgba(16, 185, 129, 0.35)')
  gradA.addColorStop(1, 'rgba(16, 185, 129, 0.00)')

  const gradB = ctx.createLinearGradient(0, 0, 0, 320)
  gradB.addColorStop(0, 'rgba(59, 130, 246, 0.30)')
  gradB.addColorStop(1, 'rgba(59, 130, 246, 0.00)')

  const gradR = ctx.createLinearGradient(0, 0, 0, 320)
  gradR.addColorStop(0, 'rgba(239, 68, 68, 0.30)')
  gradR.addColorStop(1, 'rgba(239, 68, 68, 0.00)')

  const chartDatasets = []

  if (selectedGrade.value === 'ALL') {
    // Total Line (Master Aggregate)
    const totalLineData = dataConf.labels.map((_, i) =>
      (dataConf.gradeA[i] || 0) + (dataConf.gradeB[i] || 0) + (dataConf.reject[i] || 0)
    )

    chartDatasets.push({
      label: 'Total Telur Dipindai',
      data: totalLineData,
      borderColor: '#14b8a6',
      backgroundColor: gradTotal,
      borderWidth: 2.8,
      tension: 0.38,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#14b8a6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    })

    chartDatasets.push({
      label: 'Grade A (Super)',
      data: dataConf.gradeA,
      borderColor: '#10b981',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 4],
      tension: 0.38,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#10b981'
    })

    chartDatasets.push({
      label: 'Grade B (Standar)',
      data: dataConf.gradeB,
      borderColor: '#3b82f6',
      backgroundColor: 'transparent',
      borderWidth: 1.8,
      borderDash: [4, 4],
      tension: 0.38,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#3b82f6'
    })

    chartDatasets.push({
      label: 'Reject (Cacat)',
      data: dataConf.reject,
      borderColor: '#ef4444',
      backgroundColor: 'transparent',
      borderWidth: 1.8,
      tension: 0.38,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#ef4444'
    })
  } else if (selectedGrade.value === 'GRADE_A') {
    chartDatasets.push({
      label: 'Grade A (Mutu I / Super)',
      data: dataConf.gradeA,
      borderColor: '#10b981',
      backgroundColor: gradA,
      borderWidth: 3,
      tension: 0.38,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    })
  } else if (selectedGrade.value === 'GRADE_B') {
    chartDatasets.push({
      label: 'Grade B (Mutu II / Standar)',
      data: dataConf.gradeB,
      borderColor: '#3b82f6',
      backgroundColor: gradB,
      borderWidth: 3,
      tension: 0.38,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    })
  } else if (selectedGrade.value === 'REJECT') {
    chartDatasets.push({
      label: 'Reject (Mutu III / Cacat)',
      data: dataConf.reject,
      borderColor: '#ef4444',
      backgroundColor: gradR,
      borderWidth: 3,
      tension: 0.38,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#ef4444',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    })
  }

  if (chartInstance) {
    chartInstance.data.labels = dataConf.labels
    chartInstance.data.datasets = chartDatasets
    chartInstance.options.scales.x.ticks.color = textColor
    chartInstance.options.scales.y.ticks.color = textColor
    chartInstance.options.scales.x.grid.color = gridColor
    chartInstance.options.scales.y.grid.color = gridColor
    chartInstance.update()
  } else {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataConf.labels,
        datasets: chartDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: selectedGrade.value === 'ALL',
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              color: textColor,
              font: {
                size: 11,
                weight: '600'
              }
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#0f172a',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: isDark ? '#334155' : '#1e293b',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                return ` ${context.dataset.label}: ${context.parsed.y} butir`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                size: 11,
                family: 'JetBrains Mono, monospace'
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                size: 11,
                family: 'JetBrains Mono, monospace'
              },
              callback: (val) => `${val}`
            }
          }
        }
      }
    })
  }
}

// Watch theme changes
const observer = new MutationObserver(() => {
  updateChart()
})

onMounted(() => {
  updateChart()
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  observer.disconnect()
})

// Sync latest scan totals into current today's last slot
watch(
  [() => props.totalScanned, () => props.gradeACount, () => props.gradeBCount, () => props.rejectCount],
  () => {
    updateChart()
  }
)
</script>

<style scoped>
.chart-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.25s ease;
}

.chart-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge-tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--teal-primary);
  background-color: rgba(20, 184, 166, 0.12);
  border: 1px solid rgba(20, 184, 166, 0.25);
  padding: 2px 7px;
  border-radius: 5px;
  display: inline-block;
  width: fit-content;
}

.chart-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-title);
  margin: 0;
  letter-spacing: -0.01em;
}

.chart-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
}

.filter-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

/* Time Filter Segmented Buttons */
.time-filter-group {
  display: flex;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.time-btn {
  background: transparent;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.time-btn:hover {
  color: var(--text-title);
}

.time-btn.active {
  background-color: var(--bg-card);
  color: var(--teal-primary);
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* Grade Filter Pills */
.grade-filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.grade-pill-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 8px;
  font-size: 0.73rem;
  font-weight: 600;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.pill-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.grade-pill-btn:hover {
  border-color: var(--border-subtle);
  color: var(--text-title);
}

.grade-pill-btn.active.pill-all {
  background-color: rgba(20, 184, 166, 0.12);
  border-color: #14b8a6;
  color: #14b8a6;
  font-weight: 700;
}

.grade-pill-btn.active.pill-a {
  background-color: rgba(16, 185, 129, 0.12);
  border-color: #10b981;
  color: #10b981;
  font-weight: 700;
}

.grade-pill-btn.active.pill-b {
  background-color: rgba(59, 130, 246, 0.12);
  border-color: #3b82f6;
  color: #3b82f6;
  font-weight: 700;
}

.grade-pill-btn.active.pill-reject {
  background-color: rgba(239, 68, 68, 0.12);
  border-color: #ef4444;
  color: #ef4444;
  font-weight: 700;
}

/* Telemetry Ribbon */
.chart-telemetry-ribbon {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 14px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  font-size: 0.74rem;
}

.telemetry-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.t-label {
  color: var(--text-muted);
}

.t-val {
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--text-title);
}

.t-val.text-teal { color: #14b8a6; }
.t-val.text-amber { color: #f59e0b; }

.t-badge {
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
}

.t-badge.all { background: rgba(20, 184, 166, 0.15); color: #14b8a6; }
.t-badge.grade_a { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.t-badge.grade_b { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.t-badge.reject { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

.telemetry-sep {
  color: var(--text-subtle);
  font-size: 0.8rem;
}

/* Canvas Wrapper */
.chart-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 290px;
}

@media (max-width: 768px) {
  .chart-canvas-wrapper {
    height: 240px;
  }
}
</style>

