<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const navItems = [
  {
    to: '/',
    label: 'Обзор',
    description: 'Все задания',
  },
  {
    to: '/users',
    label: 'Таблица пользователей',
    description: 'Ant Design + Pinia',
  },
  {
    to: '/todos',
    label: 'Список задач',
    description: 'CRUD + localStorage',
  },
  {
    to: '/tabs',
    label: 'Табы',
    description: 'URL query + анимация',
  },
  {
    to: '/feedback',
    label: 'Форма обратной связи',
    description: 'VeeValidate + Pinia',
  },
  {
    to: '/infinite-scroll',
    label: 'Infinite scroll',
    description: 'Intersection Observer',
  },
  {
    to: '/modal',
    label: 'Модальное окно',
    description: 'Teleport + slots',
  },
] as const

const currentTitle = computed(() => {
  const title = route.meta.title
  return typeof title === 'string' ? title : 'EME Test'
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__mark">EME</span>
        <div>
          <p class="sidebar__name">EME Test</p>
          <p class="sidebar__tag">Vue 3 · TypeScript</p>
        </div>
      </div>

      <nav class="sidebar__nav" aria-label="Задания">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ 'nav-item--active': route.path === item.to }"
        >
          <span class="nav-item__label">{{ item.label }}</span>
          <span class="nav-item__desc">{{ item.description }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <p class="topbar__eyebrow">Тестовое задание</p>
        <h1 class="topbar__title">{{ currentTitle }}</h1>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: grid;
  grid-template-columns: $nav-width minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 1.5rem 1rem;
  border-right: 1px solid rgba(213, 224, 231, 0.85);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.35rem 0.5rem;
}

.sidebar__mark {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(145deg, $color-accent, $color-ink-soft);
  color: #fff;
  font-family: $font-display;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.sidebar__name {
  font-family: $font-display;
  font-weight: 700;
  font-size: 1rem;
}

.sidebar__tag {
  margin-top: 0.15rem;
  color: $color-muted;
  font-size: 0.8rem;
}

.sidebar__nav {
  display: grid;
  gap: 0.35rem;
  overflow: auto;
}

.nav-item {
  display: grid;
  gap: 0.15rem;
  padding: 0.75rem 0.85rem;
  border-radius: $radius-md;
  transition:
    background $duration-fast $ease-out,
    transform $duration-fast $ease-out;
}

.nav-item:hover {
  background: rgba(15, 122, 108, 0.08);
  transform: translateX(2px);
}

.nav-item--active {
  background: $color-accent-soft;
}

.nav-item__label {
  font-weight: 650;
  font-size: 0.95rem;
}

.nav-item__desc {
  color: $color-muted;
  font-size: 0.78rem;
}

.workspace {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 1.5rem 1.75rem 0.5rem;
}

.topbar__eyebrow {
  color: $color-accent;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.topbar__title {
  margin-top: 0.35rem;
  font-size: clamp(1.5rem, 2vw, 1.85rem);
}

.content {
  padding: 1rem 1.75rem 2rem;
  max-width: $content-max;
  width: 100%;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(213, 224, 231, 0.85);
  }

  .sidebar__nav {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .content,
  .topbar {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
