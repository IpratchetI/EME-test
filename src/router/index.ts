import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Задания' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersTableView.vue'),
      meta: { title: 'Таблица пользователей' },
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('@/views/TodoListView.vue'),
      meta: { title: 'Список задач' },
    },
    {
      path: '/tabs',
      name: 'tabs',
      component: () => import('@/views/TabsView.vue'),
      meta: { title: 'Табы' },
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/FeedbackFormView.vue'),
      meta: { title: 'Форма обратной связи' },
    },
    {
      path: '/infinite-scroll',
      name: 'infinite-scroll',
      component: () => import('@/views/InfiniteScrollView.vue'),
      meta: { title: 'Infinite scroll' },
    },
    {
      path: '/modal',
      name: 'modal',
      component: () => import('@/views/ModalDemoView.vue'),
      meta: { title: 'Модальное окно' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'EME Test'
  document.title = `${title} · EME Test`
})

export default router
