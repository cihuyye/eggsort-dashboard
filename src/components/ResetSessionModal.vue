<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-container">
        <!-- Icon Warning -->
        <div class="modal-icon-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <!-- Content -->
        <div class="modal-content">
          <h3 class="modal-title">Konfirmasi Reset Sesi</h3>
          <p class="modal-description">
            Tindakan ini akan menghapus <strong>semua data pemindaian sesi saat ini</strong> termasuk log telur, statistik KPI, dan grafik volume. Data yang sudah terekspor tidak akan terpengaruh.
          </p>
          <p class="modal-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Aksi ini tidak dapat dibatalkan.
          </p>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button class="btn-cancel" @click="$emit('cancel')">
            <span>Batal</span>
          </button>
          <button class="btn-confirm" @click="$emit('confirm')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            <span>Ya, Reset Sesi</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(5, 10, 20, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.modal-container {
  background-color: var(--bg-card);
  border: 1.5px solid var(--border-card);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  max-width: 440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 24px 24px;
  gap: 20px;
}

/* Warning Icon */
.modal-icon-warning {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
  border: 2px solid rgba(251, 191, 36, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon-warning svg {
  width: 28px;
  height: 28px;
  color: #f59e0b;
}

/* Content */
.modal-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-title);
  margin: 0;
  letter-spacing: -0.01em;
}

.modal-description {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-body);
  margin: 0;
}

.modal-description strong {
  font-weight: 700;
  color: var(--text-title);
}

.modal-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #f59e0b;
  background-color: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.25);
  padding: 8px 14px;
  border-radius: 8px;
  margin: 0;
}

.modal-warning svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  padding-top: 4px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.btn-cancel {
  background-color: var(--bg-card-subtle);
  color: var(--text-body);
  border: 1px solid var(--border-card);
}

.btn-cancel:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--text-muted);
  transform: translateY(-1px);
}

.btn-confirm {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  border: 1px solid rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
}

.btn-confirm svg {
  width: 16px;
  height: 16px;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

@media (max-width: 480px) {
  .modal-container {
    padding: 24px 20px 20px;
    gap: 16px;
  }

  .modal-icon-warning {
    width: 48px;
    height: 48px;
  }

  .modal-icon-warning svg {
    width: 24px;
    height: 24px;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-description {
    font-size: 0.85rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
