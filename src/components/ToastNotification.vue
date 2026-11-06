<template>
  <Transition name="toast-fade">
    <div v-if="show" class="toast-box">
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div class="toast-text">{{ message }}</div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' }
})
</script>

<style scoped>
.toast-box {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #0f172a;
  color: #f8fafc;
  padding: 12px 18px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 100;
}

html.dark .toast-box {
  background-color: #1e293b;
  border-color: rgba(255, 255, 255, 0.15);
}

.toast-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--teal-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon svg {
  width: 12px;
  height: 12px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>

