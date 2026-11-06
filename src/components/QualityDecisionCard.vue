<template>
  <div class="quality-card">
    <!-- Header -->
    <div class="card-header">
      <div class="title-with-icon">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span class="card-title">Keputusan Mutu (SVM Engine)</span>
      </div>
      <span class="realtime-badge">REAL-TIME</span>
    </div>

    <!-- Grade Hero Card -->
    <div class="hero-decision-box" :class="currentEgg.grade.toLowerCase().replace(' ', '-')">
      <div class="decision-left">
        <div class="classification-meta">KLASIFIKASI TELUR TERPINDAI</div>
        <div class="grade-big-name">{{ currentEgg.grade }}</div>
        <div class="grade-status-pill">
          <span class="pill-dot"></span>
          <span>{{ currentEgg.gradeLabel }}</span>
        </div>
      </div>

      <div class="decision-right">
        <div class="score-meta">Confidence Score</div>
        <div class="score-value">{{ currentEgg.confidence }}%</div>
        <div class="svm-prob-row">
          <span>SVM Probability:</span>
          <strong>{{ currentEgg.svmProbability }}</strong>
        </div>
      </div>
    </div>

    <!-- Routing Actuator Section -->
    <div class="routing-actuator-box">
      <div class="actuator-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 3 21 3 21 8" />
          <line x1="4" y1="20" x2="21" y2="3" />
          <polyline points="21 16 21 21 16 21" />
          <line x1="15" y1="15" x2="21" y2="21" />
          <line x1="4" y1="4" x2="9" y2="9" />
        </svg>
      </div>
      <div class="actuator-text-box">
        <div class="actuator-label">Routing Aktuator: Gate 1</div>
        <div class="actuator-detail">{{ currentEgg.actuator }}</div>
      </div>
      <div class="trig-time-badge">
        Trig: {{ currentEgg.triggerTime }}
      </div>
    </div>

    <!-- Algorithm Decision Criteria Checklist -->
    <div class="algorithm-reasons-box">
      <div class="reasons-header">ALASAN KEPUTUSAN ALGORITMA:</div>
      <div class="criteria-list">
        <div
          v-for="(crit, index) in currentEgg.criteria"
          :key="index"
          class="criteria-item"
          :class="{ passed: crit.passed, failed: !crit.passed }"
        >
          <div class="crit-icon-box">
            <!-- Check Icon for Passed -->
            <svg v-if="crit.passed" class="crit-icon check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <!-- Cross / Exclamation for Failed -->
            <svg v-else class="crit-icon cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div class="crit-content">
            <span class="crit-title">{{ crit.title }}:</span>
            <span class="crit-desc">{{ crit.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentEgg: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.quality-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.2s ease;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.card-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-title);
}

.realtime-badge {
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--font-mono);
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-muted);
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

/* Hero Decision Banner */
.hero-decision-box {
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.hero-decision-box.grade-a {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.16) 100%);
  border-color: var(--grade-a-border);
}

.hero-decision-box.grade-b {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.16) 100%);
  border-color: var(--grade-b-border);
}

.hero-decision-box.reject {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.16) 100%);
  border-color: var(--grade-c-border);
}

.classification-meta {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.grade-big-name {
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-decision-box.grade-a .grade-big-name {
  color: var(--grade-a);
}

.hero-decision-box.grade-b .grade-big-name {
  color: var(--grade-b);
}

.hero-decision-box.reject .grade-big-name {
  color: var(--grade-c);
}

.grade-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  margin-top: 6px;
  color: #ffffff;
}

.hero-decision-box.grade-a .grade-status-pill {
  background-color: var(--teal-primary);
}

.hero-decision-box.grade-b .grade-status-pill {
  background-color: var(--grade-b);
}

.hero-decision-box.reject .grade-status-pill {
  background-color: var(--grade-c);
}

.pill-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #ffffff;
}

.decision-right {
  text-align: right;
}

.score-meta {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
}

.score-value {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--text-title);
  font-family: var(--font-mono);
  line-height: 1.2;
}

.svm-prob-row {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-top: 4px;
}

.svm-prob-row strong {
  color: var(--teal-primary);
  margin-left: 4px;
}

/* Actuator Routing */
.routing-actuator-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  padding: 10px 14px;
  border-radius: 10px;
}

.actuator-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: var(--teal-light);
  color: var(--teal-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.actuator-icon svg {
  width: 16px;
  height: 16px;
}

.actuator-text-box {
  flex: 1;
}

.actuator-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-title);
}

.actuator-detail {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.trig-time-badge {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

/* Algorithm Criteria Checklist */
.algorithm-reasons-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reasons-header {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.criteria-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  line-height: 1.4;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.criteria-item.passed {
  background-color: var(--grade-a-bg);
  border-color: var(--grade-a-border);
}

.criteria-item.failed {
  background-color: var(--grade-c-bg);
  border-color: var(--grade-c-border);
}

.crit-icon-box {
  margin-top: 2px;
  flex-shrink: 0;
}

.crit-icon {
  width: 14px;
  height: 14px;
}

.crit-icon.check {
  color: var(--grade-a);
}

.crit-icon.cross {
  color: var(--grade-c);
}

.crit-content {
  display: flex;
  flex-direction: column;
}

.crit-title {
  font-weight: 700;
  color: var(--text-title);
}

.crit-desc {
  color: var(--text-muted);
  font-size: 0.72rem;
}
</style>

