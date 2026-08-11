<script setup lang="ts">
import { RouterLink } from 'vue-router'

const tasks = [
  {
    to: '/users',
    title: 'Таблица пользователей',
    stack: 'Ant Design Vue · Pinia · JSONPlaceholder',
    points: ['Пагинация 10/20/50', 'Сортировка и фильтры', 'Hover подсветка'],
  },
  {
    to: '/todos',
    title: 'Список задач',
    stack: 'Pinia · localStorage',
    points: ['CRUD задач', 'Фильтр all/active/done', 'Персистентность'],
  },
  {
    to: '/tabs',
    title: 'Табы',
    stack: 'Vue Router query',
    points: ['Активная вкладка', 'Сохранение в URL', 'Анимация перехода'],
  },
  {
    to: '/feedback',
    title: 'Форма обратной связи',
    stack: 'VeeValidate · Pinia',
    points: ['Realtime-валидация', 'Состояния формы', 'Mock API + localStorage'],
  },
  {
    to: '/infinite-scroll',
    title: 'Infinite scroll лента',
    stack: 'Intersection Observer · /posts',
    points: ['Подгрузка при скролле', 'Скелетоны', 'Индикатор конца'],
  },
  {
    to: '/modal',
    title: 'Модальное окно',
    stack: 'Teleport · slots',
    points: ['Закрытие по overlay/ESC', 'Слот-контент', 'Teleport в body'],
  },
] as const
</script>

<template>
  <section class="page home">
    <div class="page__header">
      <h2 class="page__title">Перечень заданий</h2>
      <p class="page__subtitle">
        Единый Vue 3 + TypeScript стек: Composition API, Pinia, SCSS.
        Каждое задание — отдельная страница. Общие части (layout, Modal, стили)
        переиспользуются.
      </p>
    </div>

    <div class="home__grid">
      <RouterLink
        v-for="(task, index) in tasks"
        :key="task.to"
        :to="task.to"
        class="task-card"
      >
        <span class="task-card__index">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3 class="task-card__title">{{ task.title }}</h3>
        <p class="task-card__stack">{{ task.stack }}</p>
        <ul class="task-card__points">
          <li v-for="point in task.points" :key="point">{{ point }}</li>
        </ul>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.task-card {
  position: relative;
  overflow: hidden;
  padding: 1.25rem;
  border-radius: $radius-lg;
  border: 1px solid rgba(213, 224, 231, 0.95);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: $shadow-soft;
  transition:
    transform $duration-base $ease-out,
    border-color $duration-fast $ease-out,
    box-shadow $duration-base $ease-out;
}

.task-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, $color-accent, transparent);
  opacity: 0;
  transition: opacity $duration-fast $ease-out;
}

.task-card:hover {
  transform: translateY(-4px);
  border-color: rgba(15, 122, 108, 0.35);
  box-shadow: 0 16px 36px rgba(11, 31, 42, 0.12);
}

.task-card:hover::before {
  opacity: 1;
}

.task-card__index {
  display: block;
  font-family: $font-display;
  font-size: 0.8rem;
  font-weight: 700;
  color: $color-accent;
  letter-spacing: 0.06em;
}

.task-card__title {
  margin-top: 0.55rem;
  font-size: 1.1rem;
  font-weight: 650;
}

.task-card__stack {
  margin-top: 0.35rem;
  color: $color-muted;
  font-size: 0.85rem;
}

.task-card__points {
  margin: 0.9rem 0 0;
  padding-left: 1.1rem;
  color: $color-ink-soft;
  font-size: 0.9rem;
  line-height: 1.45;
}
</style>
