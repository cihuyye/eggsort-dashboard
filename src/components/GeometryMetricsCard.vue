<template>
  <div class="metrics-card">
    <!-- Header -->
    <div class="card-header">
      <div class="title-with-icon">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span class="card-title">Parameter Citra & Metrik Geometri</span>
      </div>
      <span class="badge-subtle">FOV + Candling</span>
    </div>

    <!-- 3x2 Parameter Grid -->
    <div class="params-grid">
      <!-- Tile 1: Panjang -->
      <div class="param-tile">
        <div class="param-meta">Panjang (L)</div>
        <div class="param-val-row">
          <span class="param-val">{{ currentEgg.length }}</span>
          <span class="param-unit">mm</span>
        </div>
        <div class="param-sub">{{ currentEgg.lengthPx }} piksel</div>
        <div class="param-standard">Normal (55-62mm)</div>
      </div>

      <!-- Tile 2: Lebar -->
      <div class="param-tile">
        <div class="param-meta">Lebar (W)</div>
        <div class="param-val-row">
          <span class="param-val">{{ currentEgg.width }}</span>
          <span class="param-unit">mm</span>
        </div>
        <div class="param-sub">{{ currentEgg.widthPx }} piksel</div>
        <div class="param-standard">Normal (40-46mm)</div>
      </div>

      <!-- Tile 3: Shape Index -->
      <div class="param-tile highlight-tile">
        <div class="param-meta">Shape Index</div>
        <div class="param-val-row">
          <span class="param-val highlight-val">{{ currentEgg.shapeIndex }}%</span>
        </div>
        <div class="param-sub">(SI = W/L × 100)</div>
        <div class="param-standard status-good">Ideal (72-76%)</div>
      </div>

      <!-- Tile 4: Mean Brightness -->
      <div class="param-tile">
        <div class="param-meta">Mean Brightness</div>
        <div class="param-val-row">
          <span class="param-val">{{ currentEgg.meanBrightness }}</span>
        </div>
        <div class="param-sub">Grayscale Candling</div>
        <div class="param-standard">Standar 110-185</div>
      </div>

      <!-- Tile 5: Integritas Cangkang -->
      <div class="param-tile">
        <div class="param-meta">Integritas Cangkang</div>
        <div class="param-val-row">
          <span class="param-val" :class="{ 'status-danger': currentEgg.shellIntegrity === 'Retak', 'status-good': currentEgg.shellIntegrity === 'Bersih' }">
            {{ currentEgg.shellIntegrity }}
          </span>
        </div>
        <div class="param-sub">{{ currentEgg.shellIntegritySub }}</div>
        <div class="param-standard">Normal Kerabang</div>
      </div>

      <!-- Tile 6: Kondisi Internal (Haugh Unit) -->
      <div class="param-tile">
        <div class="param-meta">Kondisi Internal</div>
        <div class="param-val-row">
          <span class="param-val">{{ currentEgg.internalHaugh }}</span>
        </div>
        <div class="param-sub">{{ currentEgg.internalHaughSub }}</div>
        <div class="param-standard status-good">Transparansi Utuh</div>
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
.metrics-card {
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

.badge-subtle {
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--font-mono);
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-muted);
  padding: 2px 7px;
  border-radius: 4px;
}

/* 3x2 Grid */
.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.param-tile {
  background-color: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.param-tile:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.param-meta {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.param-val-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.param-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-title);
  font-family: var(--font-mono);
  line-height: 1.2;
}

.param-unit {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

.highlight-val {
  color: var(--teal-primary);
}

.param-sub {
  font-size: 0.65rem;
  color: var(--text-subtle);
  margin-top: 2px;
}

.param-standard {
  font-size: 0.64rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 6px;
  padding-top: 4px;
  border-top: 1px solid var(--border-subtle);
}

.status-good {
  color: var(--teal-primary);
}

.status-danger {
  color: var(--grade-c);
}

@media (max-width: 640px) {
  .params-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

