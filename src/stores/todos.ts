import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { TodoFilter, TodoItem } from '@/types/todo'

const STORAGE_KEY = 'eme-todos'

function loadTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TodoItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<TodoItem[]>(loadTodos())
  const filter = ref<TodoFilter>('all')

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter((todo) => !todo.completed)
      case 'completed':
        return todos.value.filter((todo) => todo.completed)
      default:
        return todos.value
    }
  })

  const activeCount = computed(() => todos.value.filter((todo) => !todo.completed).length)
  const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length)

  function addTodo(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return

    todos.value.unshift({
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    })
  }

  function updateTodo(id: string, title: string) {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) return
    const trimmed = title.trim()
    if (!trimmed) return
    todo.title = trimmed
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) return
    todo.completed = !todo.completed
  }

  function removeTodo(id: string) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  function setFilter(next: TodoFilter) {
    filter.value = next
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed)
  }

  watch(
    todos,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  return {
    todos,
    filter,
    filteredTodos,
    activeCount,
    completedCount,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodo,
    setFilter,
    clearCompleted,
  }
})
