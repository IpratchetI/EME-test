<script setup lang="ts">
import { computed, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import { useTodosStore } from '@/stores/todos'
import type { TodoFilter } from '@/types/todo'

const store = useTodosStore()

const draft = ref('')
const editingId = ref<string | null>(null)
const editingTitle = ref('')
const deleteId = ref<string | null>(null)

const filters: { id: TodoFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'Активные' },
  { id: 'completed', label: 'Выполненные' },
]

const deleteTarget = computed(() => store.todos.find((todo) => todo.id === deleteId.value) ?? null)

function submitNew() {
  store.addTodo(draft.value)
  draft.value = ''
}

function startEdit(id: string, title: string) {
  editingId.value = id
  editingTitle.value = title
}

function saveEdit() {
  if (!editingId.value) return
  store.updateTodo(editingId.value, editingTitle.value)
  editingId.value = null
  editingTitle.value = ''
}

function cancelEdit() {
  editingId.value = null
  editingTitle.value = ''
}

function askDelete(id: string) {
  deleteId.value = id
}

function confirmDelete() {
  if (!deleteId.value) return
  store.removeTodo(deleteId.value)
  deleteId.value = null
}
</script>

<template>
  <section class="page">
    <div class="page__header">
      <h2 class="page__title">Список задач</h2>
      <p class="page__subtitle">
        CRUD задач на Pinia с фильтром и сохранением в localStorage.
      </p>
    </div>

    <div class="panel todos">
      <form class="todos__create" @submit.prevent="submitNew">
        <label class="field" style="flex: 1">
          <span class="field__label">Новая задача</span>
          <input
            v-model="draft"
            class="field__control"
            type="text"
            placeholder="Например: Подготовить демо"
            maxlength="120"
          />
        </label>
        <button type="submit" class="btn btn--primary" :disabled="!draft.trim()">
          Добавить
        </button>
      </form>

      <div class="todos__toolbar">
        <div class="todos__filters" role="tablist" aria-label="Фильтр задач">
          <button
            v-for="item in filters"
            :key="item.id"
            type="button"
            class="chip"
            :class="{ 'chip--active': store.filter === item.id }"
            @click="store.setFilter(item.id)"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="todos__stats">
          <span>Активных: {{ store.activeCount }}</span>
          <button
            type="button"
            class="btn btn--ghost"
            :disabled="store.completedCount === 0"
            @click="store.clearCompleted()"
          >
            Очистить выполненные
          </button>
        </div>
      </div>

      <ul v-if="store.filteredTodos.length" class="todos__list">
        <li v-for="todo in store.filteredTodos" :key="todo.id" class="todo-item">
          <label class="todo-item__check">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="store.toggleTodo(todo.id)"
            />
            <span class="sr-only">Выполнено</span>
          </label>

          <div class="todo-item__body">
            <template v-if="editingId === todo.id">
              <input
                v-model="editingTitle"
                class="field__control"
                type="text"
                maxlength="120"
                @keydown.enter.prevent="saveEdit"
                @keydown.esc.prevent="cancelEdit"
              />
              <div class="todo-item__edit-actions">
                <button type="button" class="btn btn--primary" @click="saveEdit">
                  Сохранить
                </button>
                <button type="button" class="btn btn--ghost" @click="cancelEdit">
                  Отмена
                </button>
              </div>
            </template>
            <template v-else>
              <p :class="{ 'todo-item__title--done': todo.completed }">
                {{ todo.title }}
              </p>
            </template>
          </div>

          <div v-if="editingId !== todo.id" class="todo-item__actions">
            <button
              type="button"
              class="btn btn--ghost"
              @click="startEdit(todo.id, todo.title)"
            >
              Изменить
            </button>
            <button type="button" class="btn btn--danger" @click="askDelete(todo.id)">
              Удалить
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="todos__empty">Пока нет задач в этом фильтре.</p>
    </div>

    <Modal :open="Boolean(deleteTarget)" title="Удалить задачу?" @close="deleteId = null">
      <p>
        Задача «{{ deleteTarget?.title }}» будет удалена безвозвратно.
      </p>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="deleteId = null">
          Отмена
        </button>
        <button type="button" class="btn btn--danger" @click="confirmDelete">
          Удалить
        </button>
      </template>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
.todos {
  display: grid;
  gap: 1.15rem;
}

.todos__create {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: end;
}

.todos__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.85rem;
  align-items: center;
}

.todos__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  border: 1px solid $color-border;
  background: #fff;
  color: $color-muted;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background $duration-fast $ease-out,
    color $duration-fast $ease-out,
    border-color $duration-fast $ease-out;
}

.chip--active {
  background: $color-accent-soft;
  border-color: rgba(15, 122, 108, 0.35);
  color: $color-accent-hover;
}

.todos__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
  color: $color-muted;
  font-size: 0.92rem;
}

.todos__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.todo-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.85rem;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background: linear-gradient(180deg, #fff, rgba(243, 247, 249, 0.65));
  transition: border-color $duration-fast $ease-out;
}

.todo-item:hover {
  border-color: rgba(15, 122, 108, 0.35);
}

.todo-item__check input {
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.35rem;
  accent-color: $color-accent;
}

.todo-item__body {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}

.todo-item__body p {
  line-height: 1.45;
  word-break: break-word;
}

.todo-item__title--done {
  color: $color-muted;
  text-decoration: line-through;
}

.todo-item__actions,
.todo-item__edit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.todos__empty {
  color: $color-muted;
  padding: 1rem 0.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 720px) {
  .todo-item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .todo-item__actions {
    grid-column: 2;
  }
}
</style>
