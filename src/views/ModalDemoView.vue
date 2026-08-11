<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'

const isOpen = ref(false)
const confirmOpen = ref(false)

function openBasic() {
  isOpen.value = true
}

function openConfirm() {
  confirmOpen.value = true
}
</script>

<template>
  <section class="page">
    <div class="page__header">
      <h2 class="page__title">Модальное окно</h2>
      <p class="page__subtitle">
        Кастомный Modal: Teleport в body, закрытие по overlay и ESC, слоты для
        заголовка, контента и футера.
      </p>
    </div>

    <div class="panel modal-demo">
      <div class="modal-demo__actions">
        <button type="button" class="btn btn--primary" @click="openBasic">
          Открыть Modal
        </button>
        <button type="button" class="btn btn--ghost" @click="openConfirm">
          Modal с футером
        </button>
      </div>

      <ul class="modal-demo__list">
        <li>Teleport → <code>body</code></li>
        <li>Закрытие по клику на оверлей</li>
        <li>Закрытие по ESC</li>
        <li>Слоты: default / header / footer</li>
      </ul>
    </div>

    <Modal :open="isOpen" title="Базовый Modal" @close="isOpen = false">
      <p>
        Контент передаётся через default-слот. Окно телепортируется в
        <code>body</code>, поэтому не зависит от overflow родителя.
      </p>
    </Modal>

    <Modal :open="confirmOpen" title="Подтверждение" @close="confirmOpen = false">
      <p>Можно ли закрыть это окно кнопкой в футере или по ESC / overlay?</p>

      <template #footer>
        <button type="button" class="btn btn--ghost" @click="confirmOpen = false">
          Отмена
        </button>
        <button type="button" class="btn btn--primary" @click="confirmOpen = false">
          Понятно
        </button>
      </template>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
.modal-demo {
  display: grid;
  gap: 1.25rem;
}

.modal-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modal-demo__list {
  margin: 0;
  padding-left: 1.1rem;
  color: $color-ink-soft;
  line-height: 1.55;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: $color-accent-soft;
  padding: 0.1em 0.35em;
  border-radius: 6px;
}
</style>
