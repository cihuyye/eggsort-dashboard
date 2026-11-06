<template>
  <div class="kpi-grid">
    <!-- Card 1: Total Scanned -->
    <div class="kpi-card total-card">
      <div class="kpi-header">
        <span class="kpi-label">TOTAL TELUR DIPINDAI</span>
        <div class="kpi-icon-circle total-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C8 2 4.5 7 4.5 13.5C4.5 18 7.8 22 12 22C16.2 22 19.5 18 19.5 13.5C19.5 7 16 2 12 2Z" />
            <path d="M3 13h18" stroke-dasharray="2 2" />
          </svg>
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value-row">
          <span class="kpi-number">{{ formattedTotal }}</span>
          <span class="kpi-unit">butir</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="trend-badge positive">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          +12.4%
        </span>
        <span class="kpi-subtext">{{ speedPerMin }} Butir / Menit</span>
      </div>
    </div>

    <!-- Card 2: Grade A -->
    <div class="kpi-card grade-a-card">
      <div class="kpi-header">
        <span class="kpi-label">GRADE A</span>
        <div class="kpi-icon-circle grade-a-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value-row">
          <span class="kpi-number">{{ formattedGradeA }}</span>
          <span class="kpi-percent grade-a-pct">{{ gradeAPercent }}%</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-subtext">Solenoid 1 (Ritel Segar)</span>
        <span class="status-tag tag-success">Mutu I SNI</span>
      </div>
    </div>

    <!-- Card 3: Grade B -->
    <div class="kpi-card grade-b-card">
      <div class="kpi-header">
        <span class="kpi-label">GRADE B</span>
        <div class="kpi-icon-circle grade-b-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value-row">
          <span class="kpi-number">{{ formattedGradeB }}</span>
          <span class="kpi-percent grade-b-pct">{{ gradeBPercent }}%</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-subtext">Solenoid 2 (Industri Pangan)</span>
        <span class="status-tag tag-blue">Mutu II SNI</span>
      </div>
    </div>

    <!-- Card 4: Reject / Cacat -->
    <div class="kpi-card reject-card">
      <div class="kpi-header">
        <span class="kpi-label">REJECT / CACAT</span>
        <div class="kpi-icon-circle reject-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value-row">
          <span class="kpi-number">{{ formattedReject }}</span>
          <span class="kpi-percent reject-pct">{{ rejectPercent }}%</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-subtext">Pneumatik (Karantina Afkir)</span>
        <span class="status-tag tag-red">Kapasitas: {{ rejectCapacity }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalScanned: { type: Number, default: 1428 },
  gradeACount: { type: Number, default: 1085 },
  gradeBCount: { type: Number, default: 247 },
  rejectCount: { type: Number, default: 96 },
  gradeAPercent: { type: String, default: '76.0' },
  gradeBPercent: { type: String, default: '17.3' },
  rejectPercent: { type: String, default: '6.7' },
  speedPerMin: { type: Number, default: 45 },
  rejectCapacity: { type: Number, default: 12 }
})

const formattedTotal = computed(() => Number(props.totalScanned).toLocaleString())
const formattedGradeA = computed(() => Number(props.gradeACount).toLocaleString())
const formattedGradeB = computed(() => Number(props.gradeBCount).toLocaleString())
const formattedReject = computed(() => Number(props.rejectCount).toLocaleString())
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.kpi-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.kpi-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon-circle svg {
  width: 18px;
  height: 18px;
}

.total-icon {
  background-color: var(--teal-light);
  color: var(--teal-primary);
}

.grade-a-icon {
  background-color: var(--grade-a-bg);
  color: var(--grade-a);
}

.grade-b-icon {
  background-color: var(--grade-b-bg);
  color: var(--grade-b);
}

.reject-icon {
  background-color: var(--grade-c-bg);
  color: var(--grade-c);
}

.kpi-body {
  margin-bottom: 14px;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.kpi-number {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-title);
  font-family: var(--font-sans);
  letter-spacing: -0.02em;
  line-height: 1;
}

.kpi-unit {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.kpi-percent {
  font-size: 0.82rem;
  font-weight: 700;
  font-family: var(--font-mono);
}

.grade-a-pct {
  color: var(--grade-a);
}

.grade-b-pct {
  color: var(--grade-b);
}

.reject-pct {
  color: var(--grade-c);
}

.kpi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.75rem;
}

.kpi-subtext {
  color: var(--text-muted);
  font-weight: 500;
}

.trend-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 700;
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

.trend-badge svg {
  width: 12px;
  height: 12px;
}

.trend-badge.positive {
  color: var(--teal-primary);
}

.status-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.tag-success {
  background-color: var(--grade-a-bg);
  color: var(--grade-a);
  border: 1px solid var(--grade-a-border);
}

.tag-blue {
  background-color: var(--grade-b-bg);
  color: var(--grade-b);
  border: 1px solid var(--grade-b-border);
}

.tag-red {
  background-color: var(--grade-c-bg);
  color: var(--grade-c);
  border: 1px solid var(--grade-c-border);
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>

