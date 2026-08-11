<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type TabId = 'overview' | 'details' | 'settings'

interface TabItem {
  id: TabId
  label: string
  title: string
  body: string
}

const tabs: TabItem[] = [
  {
    id: 'overview',
    label: 'Обзор',
    title: 'Обзор продукта',
    body: 'Краткое описание раздела. Активная вкладка сохраняется в URL как query-параметр tab.',
  },
  {
    id: 'details',
    label: 'Детали',
    title: 'Технические детали',
    body: 'Здесь может быть любой контент вкладки: текст, списки, формы. Переключение анимировано через Transition.',
  },
  {
    id: 'settings',
    label: 'Настройки',
    title: 'Настройки отображения',
    body: 'Обновите страницу — активная вкладка восстановится из адреса, например /tabs?tab=settings.',
  },
]

const route = useRoute()
const router = useRouter()

const activeTab = computed<TabId>(() => {
  const value = route.query.tab
  const tab = typeof value === 'string' ? value : 'overview'
  return tabs.some((item) => item.id === tab) ? (tab as TabId) : 'overview'
})

const current = computed(() => tabs.find((tab) => tab.id === activeTab.value) ?? tabs[0])

function setTab(tab: TabId) {
  router.replace({ query: { ...route.query, tab } })
}

onMounted(() => {
  const value = route.query.tab
  const isValid = typeof value === 'string' && tabs.some((tab) => tab.id === value)
  if (!isValid) {
    setTab('overview')
  }
})
</script>

<template>
  <section class="page">
    <div class="page__header">
      <h2 class="page__title">Табы</h2>
      <p class="page__subtitle">
        Вкладки с подсветкой активной, анимацией контента и синхронизацией через
        <code>?tab=</code>.
      </p>
    </div>

    <div class="panel tabs">
      <div class="tabs__list" role="tablist" aria-label="Пример вкладок">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="tabs__trigger"
          :class="{ 'tabs__trigger--active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="setTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tabs__panels">
        <Transition name="tab-fade" mode="out-in">
          <div :key="current.id" class="tabs__panel" role="tabpanel">
            <h3>{{ current.title }}</h3>
            <p>{{ current.body }}</p>
            <p class="tabs__meta">
              Текущий URL-параметр:
              <strong>tab={{ activeTab }}</strong>
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tabs {
  display: grid;
  gap: 1.15rem;
}

.tabs__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.35rem;
  border-radius: $radius-md;
  background: rgba(15, 122, 108, 0.06);
}

.tabs__trigger {
  border: none;
  background: transparent;
  color: $color-muted;
  font-weight: 600;
  padding: 0.7rem 1rem;
  border-radius: $radius-sm;
  cursor: pointer;
  transition:
    background $duration-fast $ease-out,
    color $duration-fast $ease-out,
    transform $duration-fast $ease-out;
}

.tabs__trigger:hover {
  color: $color-ink;
  background: rgba(255, 255, 255, 0.7);
}

.tabs__trigger--active {
  color: $color-ink;
  background: #fff;
  box-shadow: 0 4px 14px rgba(11, 31, 42, 0.08);
}

.tabs__panel {
  display: grid;
  gap: 0.65rem;
  min-height: 140px;
  padding: 0.35rem 0.15rem 0.15rem;
}

.tabs__panel h3 {
  font-size: 1.15rem;
}

.tabs__panel p {
  color: $color-ink-soft;
  line-height: 1.55;
  max-width: 60ch;
}

.tabs__meta {
  margin-top: 0.35rem;
  color: $color-muted !important;
  font-size: 0.92rem;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: $color-accent-soft;
  padding: 0.1em 0.35em;
  border-radius: 6px;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition:
    opacity $duration-base $ease-out,
    transform $duration-base $ease-out;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
