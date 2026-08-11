import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUsers } from '@/api/users'
import type {
  AppUser,
  SortOrder,
  UserRole,
  UserSortKey,
  UserStatus,
} from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<AppUser[]>([])
  const loading = ref(false)
  const error = ref('')

  const page = ref(1)
  const pageSize = ref(10)
  const sortKey = ref<UserSortKey>('name')
  const sortOrder = ref<SortOrder>('ascend')
  const roleFilter = ref<UserRole | 'all'>('all')
  const statusFilter = ref<UserStatus | 'all'>('all')

  const filteredUsers = computed(() => {
    let list = [...users.value]

    if (roleFilter.value !== 'all') {
      list = list.filter((user) => user.role === roleFilter.value)
    }

    if (statusFilter.value !== 'all') {
      list = list.filter((user) => user.status === statusFilter.value)
    }

    list.sort((a, b) => {
      const left = a[sortKey.value]
      const right = b[sortKey.value]
      const result = String(left).localeCompare(String(right), 'ru', {
        numeric: true,
        sensitivity: 'base',
      })
      return sortOrder.value === 'ascend' ? result : -result
    })

    return list
  })

  const total = computed(() => filteredUsers.value.length)

  const pagedUsers = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredUsers.value.slice(start, start + pageSize.value)
  })

  async function loadUsers() {
    loading.value = true
    error.value = ''

    try {
      users.value = await fetchUsers()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  function setPage(next: number) {
    page.value = next
  }

  function setPageSize(next: number) {
    pageSize.value = next
    page.value = 1
  }

  function setSort(key: UserSortKey, order: SortOrder | null) {
    if (!order) {
      sortKey.value = 'name'
      sortOrder.value = 'ascend'
      return
    }
    sortKey.value = key
    sortOrder.value = order
  }

  function setRoleFilter(role: UserRole | 'all') {
    roleFilter.value = role
    page.value = 1
  }

  function setStatusFilter(status: UserStatus | 'all') {
    statusFilter.value = status
    page.value = 1
  }

  return {
    users,
    loading,
    error,
    page,
    pageSize,
    sortKey,
    sortOrder,
    roleFilter,
    statusFilter,
    filteredUsers,
    total,
    pagedUsers,
    loadUsers,
    setPage,
    setPageSize,
    setSort,
    setRoleFilter,
    setStatusFilter,
  }
})
