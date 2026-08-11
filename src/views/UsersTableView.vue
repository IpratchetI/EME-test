<script setup lang="ts">
import { computed, h, onMounted } from 'vue'
import { Table, Select, Tag } from 'ant-design-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { useUsersStore } from '@/stores/users'
import type { AppUser, UserRole, UserSortKey, UserStatus } from '@/types/user'

const store = useUsersStore()

const roleOptions = [
  { value: 'all', label: 'Все роли' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Manager', label: 'Manager' },
  { value: 'User', label: 'User' },
  { value: 'Guest', label: 'Guest' },
]

const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'active', label: 'Активен' },
  { value: 'inactive', label: 'Неактивен' },
  { value: 'pending', label: 'Ожидает' },
]

const statusLabel: Record<UserStatus, string> = {
  active: 'Активен',
  inactive: 'Неактивен',
  pending: 'Ожидает',
}

const statusColor: Record<UserStatus, string> = {
  active: 'green',
  inactive: 'default',
  pending: 'gold',
}

function formatRegisteredAt(value: string) {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}.${month}.${year}`
}

const columns = computed<TableColumnsType<AppUser>>(() => [
  {
    title: 'Имя',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    sortOrder: store.sortKey === 'name' ? store.sortOrder : null,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
    sortOrder: store.sortKey === 'email' ? store.sortOrder : null,
  },
  {
    title: 'Роль',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: UserStatus }) =>
      h(Tag, { color: statusColor[text] }, () => statusLabel[text]),
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'registeredAt',
    key: 'registeredAt',
    sorter: true,
    sortOrder: store.sortKey === 'registeredAt' ? store.sortOrder : null,
    customRender: ({ text }: { text: string }) => formatRegisteredAt(text),
  },
])

const onChange: TableProps<AppUser>['onChange'] = (pagination, _filters, sorter) => {
  const nextPageSize = pagination.pageSize
  const nextPage = pagination.current

  if (nextPageSize && nextPageSize !== store.pageSize) {
    store.setPageSize(nextPageSize)
  } else if (nextPage) {
    store.setPage(nextPage)
  }

  const single = Array.isArray(sorter) ? sorter[0] : sorter
  if (single?.field && single.order) {
    store.setSort(String(single.field) as UserSortKey, single.order)
  } else if (single?.field && !single.order) {
    store.setSort(String(single.field) as UserSortKey, null)
  }
}

onMounted(() => {
  void store.loadUsers()
})
</script>

<template>
  <section class="page">
    <div class="page__header">
      <h2 class="page__title">Таблица пользователей</h2>
      <p class="page__subtitle">
        Ant Design Table + Pinia. База с JSONPlaceholder <code>/users</code>,
        локально расширена для пагинации 10/20/50.
      </p>
    </div>

    <div class="panel users">
      <div class="users__filters">
        <label class="field">
          <span class="field__label">Роль</span>
          <Select
            :value="store.roleFilter"
            style="width: 180px"
            :options="roleOptions"
            @change="(value) => store.setRoleFilter(value as UserRole | 'all')"
          />
        </label>

        <label class="field">
          <span class="field__label">Статус</span>
          <Select
            :value="store.statusFilter"
            style="width: 180px"
            :options="statusOptions"
            @change="(value) => store.setStatusFilter(value as UserStatus | 'all')"
          />
        </label>

        <button
          type="button"
          class="btn btn--ghost users__refresh"
          :disabled="store.loading"
          @click="store.loadUsers()"
        >
          Обновить
        </button>
      </div>

      <p v-if="store.error" class="users__error">{{ store.error }}</p>

      <Table
        class="users__table"
        row-key="id"
        size="middle"
        :loading="store.loading"
        :columns="columns"
        :data-source="store.pagedUsers"
        :pagination="{
          current: store.page,
          pageSize: store.pageSize,
          total: store.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }"
        :row-class-name="() => 'users-row'"
        @change="onChange"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.users {
  display: grid;
  gap: 1rem;
}

.users__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.users__refresh {
  margin-left: auto;
}

.users__error {
  color: $color-danger;
}

.users__table {
  overflow: auto;
}

:deep(.users-row) {
  transition: background $duration-fast $ease-out;
}

:deep(.users-row:hover > td) {
  background: rgba(15, 122, 108, 0.08) !important;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: $color-accent-soft;
  padding: 0.1em 0.35em;
  border-radius: 6px;
}
</style>
