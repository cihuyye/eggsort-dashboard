<template>
  <div class="app-layout">
    <!-- Left Creative Sidebar -->
    <Sidebar
      :activeTab="activeTab"
      @update:activeTab="activeTab = $event"
      :operatorProfile="operatorProfile"
    />

    <!-- Main Content Panel -->
    <div class="main-panel">
      <!-- Top Navigation Bar -->
      <TopNav
        :theme="theme"
        :toggleTheme="toggleTheme"
        :fps="fps"
        :isAutoMode="isAutoMode"
        :activeTab="activeTab"
        :operatorProfile="operatorProfile"
        @select-profile="activeTab = 'profile'"
      />

      <!-- Content Container -->
      <main class="content-container">
        <!-- View 1: Main Realtime Dashboard (Shown when activeTab === 'dashboard') -->
        <div v-if="activeTab === 'dashboard'" class="dashboard-body">
          <!-- Sub Header & System Action Controls -->
          <SubHeader
            :isAutoMode="isAutoMode"
            :toggleAutoMode="toggleAutoMode"
            :resetSession="resetSession"
          />

          <!-- Top 4 KPI Metric Cards -->
          <KpiCards
            :totalScanned="totalScanned"
            :gradeACount="gradeACount"
            :gradeBCount="gradeBCount"
            :rejectCount="rejectCount"
            :gradeAPercent="gradeAPercent"
            :gradeBPercent="gradeBPercent"
            :rejectPercent="rejectPercent"
            :speedPerMin="speedPerMin"
            :rejectCapacity="rejectCapacity"
          />

          <!-- Middle Section: 2 Columns (Camera Stream on Left, AI Decision & Geometry on Right) -->
          <div class="middle-grid">
            <!-- Left Column: Camera Feed -->
            <div class="middle-col-left">
              <CameraStream
                :fps="fps"
                :latency="latency"
                :inferenceTime="inferenceTime"
                :isLedOn="isLedOn"
                :streamMode="streamMode"
                :toggleStreamMode="toggleStreamMode"
                :takeSnapshot="takeSnapshot"
                :isSnapshotting="isSnapshotting"
                :currentEgg="currentEgg"
                :triggerToast="triggerToast"
                @open-detail="openEggDetail(currentEgg)"
              />
            </div>

            <!-- Right Column: Keputusan Mutu & Parameter Metrik -->
            <div class="middle-col-right">
              <QualityDecisionCard :currentEgg="currentEgg" @open-detail="openEggDetail(currentEgg)" />
              <GeometryMetricsCard :currentEgg="currentEgg" />
            </div>
          </div>

          <!-- Bottom Section: Log Pemindaian Terkini (Live Feed Queue Table) -->
          <div class="bottom-section">
            <ScanLogTable
              :scanLogs="scanLogs"
              :filterGrade="filterGrade"
              @update:filterGrade="filterGrade = $event"
              :totalScanned="totalScanned"
              :mqttFreq="mqttFreq"
              :exportCSV="exportCSV"
              @open-detail="openEggDetail($event)"
            />
          </div>
        </div>

        <!-- View 2: Dedicated Profile & Account Security Page (Shown when activeTab === 'profile') -->
        <div v-else-if="activeTab === 'profile'">
          <ProfileView
            :operatorProfile="operatorProfile"
            :updateProfile="updateProfile"
            :triggerToast="triggerToast"
          />
        </div>

        <!-- View 3: Dedicated History & Analytics Page (Shown when activeTab === 'history') -->
        <div v-else-if="activeTab === 'history'">
          <HistoryAnalyticsView :triggerToast="triggerToast" />
        </div>

        <!-- View 4: Extra Tabs (Calibration, System Info) -->
        <div v-else>
          <ExtraTabsView
            :activeTab="activeTab"
            :gradeAPercent="gradeAPercent"
            :gradeBPercent="gradeBPercent"
            :rejectPercent="rejectPercent"
            :gradeACount="gradeACount"
            :gradeBCount="gradeBCount"
            :rejectCount="rejectCount"
            :speedPerMin="speedPerMin"
            :exportCSV="exportCSV"
            :triggerToast="triggerToast"
          />
        </div>
      </main>
    </div>

    <!-- Toast Notification Overlay -->
    <ToastNotification :show="showToast" :message="toastMessage" />

    <!-- Interactive Egg Inspection Detail Pop-up Modal -->
    <EggDetailModal
      :show="showDetailModal"
      :eggData="selectedEgg || currentEgg"
      :triggerToast="triggerToast"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEggSort } from './composables/useEggSort'
import Sidebar from './components/Sidebar.vue'
import TopNav from './components/TopNav.vue'
import SubHeader from './components/SubHeader.vue'
import KpiCards from './components/KpiCards.vue'
import CameraStream from './components/CameraStream.vue'
import QualityDecisionCard from './components/QualityDecisionCard.vue'
import GeometryMetricsCard from './components/GeometryMetricsCard.vue'
import ScanLogTable from './components/ScanLogTable.vue'
import ExtraTabsView from './components/ExtraTabsView.vue'
import HistoryAnalyticsView from './components/HistoryAnalyticsView.vue'
import ProfileView from './components/ProfileView.vue'
import ToastNotification from './components/ToastNotification.vue'
import EggDetailModal from './components/EggDetailModal.vue'

const showDetailModal = ref(false)
const selectedEgg = ref(null)

const openEggDetail = (egg) => {
  if (egg) {
    selectedEgg.value = egg
  } else {
    selectedEgg.value = currentEgg.value
  }
  showDetailModal.value = true
}

const {
  theme,
  toggleTheme,
  isAutoMode,
  toggleAutoMode,
  isEmergencyStop,
  triggerEmergencyStop,
  streamMode,
  toggleStreamMode,
  isLedOn,
  fps,
  latency,
  inferenceTime,
  mqttFreq,
  activeTab,
  filterGrade,
  isSnapshotting,
  toastMessage,
  showToast,
  triggerToast,
  operatorProfile,
  updateProfile,
  totalScanned,
  speedPerMin,
  gradeACount,
  gradeBCount,
  rejectCount,
  gradeAPercent,
  gradeBPercent,
  rejectPercent,
  rejectCapacity,
  currentEgg,
  scanLogs,
  resetSession,
  takeSnapshot,
  exportCSV
} = useEggSort()
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: var(--bg-app);
}

.content-container {
  padding: 24px 28px 40px 28px;
  flex: 1;
  max-width: 1720px;
  width: 100%;
  margin: 0 auto;
}

.dashboard-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Middle 2-Column Section */
.middle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.middle-col-left {
  display: flex;
  flex-direction: column;
}

.middle-col-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bottom-section {
  width: 100%;
}

@media (max-width: 1200px) {
  .middle-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 16px;
  }
}
</style>
