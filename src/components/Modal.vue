<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    title: '',
    closeOnOverlay: true,
    closeOnEsc: true,
  },
)

const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
}

function onOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (props.closeOnEsc && event.key === 'Escape' && props.open) {
    close()
  }
}

function lockScroll(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : ''
}

watch(
  () => props.open,
  (open) => lockScroll(open),
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  lockScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Диалоговое окно'"
      >
        <div class="modal__overlay" @click="onOverlayClick" />

        <div class="modal__panel" role="document">
          <header v-if="title || $slots.header" class="modal__header">
            <slot name="header">
              <h2 class="modal__title">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="modal__close"
              aria-label="Закрыть"
              @click="close"
            >
              ×
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 1.25rem;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(11, 31, 42, 0.48);
  backdrop-filter: blur(4px);
}

.modal__panel {
  position: relative;
  z-index: 1;
  width: min(100%, 520px);
  max-height: min(86vh, 720px);
  overflow: auto;
  border-radius: $radius-lg;
  background: $color-surface-elevated;
  border: 1px solid rgba(213, 224, 231, 0.95);
  box-shadow: 0 24px 60px rgba(11, 31, 42, 0.22);
}

.modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem 0.75rem;
}

.modal__title {
  font-size: 1.15rem;
  font-weight: 600;
}

.modal__close {
  border: none;
  background: transparent;
  color: $color-muted;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.1rem 0.35rem;
  border-radius: $radius-sm;
  transition:
    color $duration-fast $ease-out,
    background $duration-fast $ease-out;
}

.modal__close:hover {
  color: $color-ink;
  background: rgba(15, 122, 108, 0.08);
}

.modal__body {
  padding: 0.5rem 1.25rem 1.25rem;
  color: $color-ink-soft;
  line-height: 1.55;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 0 1.25rem 1.25rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity $duration-base $ease-out;
}

.modal-enter-active .modal__panel,
.modal-leave-active .modal__panel {
  transition: transform $duration-base $ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__panel,
.modal-leave-to .modal__panel {
  transform: translateY(12px) scale(0.98);
}
</style>
